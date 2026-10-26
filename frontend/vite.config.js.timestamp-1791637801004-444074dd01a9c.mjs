// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/vedharadha%20Jewellery/node_modules/vite/dist/node/index.js";
import react from "file:///D:/vedharadha%20Jewellery/node_modules/@vitejs/plugin-react/dist/index.js";

// server/rateCalculations.js
var TROY_OUNCE_IN_GRAMS = 31.1034768;
function convertTroyOunceToGram(pricePerOunce) {
  if (typeof pricePerOunce !== "number" || isNaN(pricePerOunce) || pricePerOunce <= 0) {
    throw new Error("Invalid price per ounce provided for conversion");
  }
  return pricePerOunce / TROY_OUNCE_IN_GRAMS;
}
function calculate22kFrom24k(price24kPerGram) {
  if (typeof price24kPerGram !== "number" || isNaN(price24kPerGram) || price24kPerGram <= 0) {
    throw new Error("Invalid 24K gold rate provided");
  }
  return price24kPerGram * (22 / 24);
}
function calculate18kFrom24k(price24kPerGram) {
  if (typeof price24kPerGram !== "number" || isNaN(price24kPerGram) || price24kPerGram <= 0) {
    throw new Error("Invalid 24K gold rate provided");
  }
  return price24kPerGram * (18 / 24);
}
function calculate925SilverFrom999(price999SilverPerGram) {
  if (typeof price999SilverPerGram !== "number" || isNaN(price999SilverPerGram) || price999SilverPerGram <= 0) {
    throw new Error("Invalid 999 silver rate provided");
  }
  return price999SilverPerGram * 0.925;
}
function formatInr(amount, decimals = 0) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function formatTimestampIST(dateInput) {
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) {
      return "Today, Market Hours";
    }
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    return `${formatter.format(d)} IST`;
  } catch {
    return "Today, Market Hours";
  }
}
function parseGoldApiResponse(goldData, silverData) {
  if (!goldData || typeof goldData !== "object") {
    throw new Error("Invalid gold data payload from provider");
  }
  let gold24kGram = goldData.price_gram_24k;
  if (!gold24kGram && goldData.price) {
    gold24kGram = convertTroyOunceToGram(goldData.price);
  }
  if (!gold24kGram || isNaN(gold24kGram) || gold24kGram <= 0) {
    throw new Error("Unable to extract valid 24K gold rate per gram");
  }
  const gold22kGram = goldData.price_gram_22k || calculate22kFrom24k(gold24kGram);
  const gold18kGram = goldData.price_gram_18k || calculate18kFrom24k(gold24kGram);
  let changeGram = null;
  let isUp = true;
  if (typeof goldData.ch_prev === "number") {
    changeGram = Math.abs(goldData.ch_prev / TROY_OUNCE_IN_GRAMS);
    isUp = goldData.ch_prev >= 0;
  } else if (typeof goldData.ch === "number") {
    changeGram = Math.abs(goldData.ch / TROY_OUNCE_IN_GRAMS);
    isUp = goldData.ch >= 0;
  }
  let silver999Gram = 94.5;
  if (silverData && typeof silverData === "object") {
    if (silverData.price_gram_24k) {
      silver999Gram = silverData.price_gram_24k;
    } else if (silverData.price) {
      silver999Gram = convertTroyOunceToGram(silverData.price);
    }
  }
  const silver925Gram = calculate925SilverFrom999(silver999Gram);
  const timestampMs = goldData.timestamp ? goldData.timestamp * 1e3 : Date.now();
  return {
    raw: {
      gold24kGram,
      gold22kGram,
      gold18kGram,
      silver999Gram,
      silver925Gram,
      changeGram,
      isUp,
      timestamp: timestampMs
    },
    formatted: {
      gold22k: formatInr(Math.round(gold22kGram)),
      gold24k: formatInr(Math.round(gold24kGram)),
      gold18k: formatInr(Math.round(gold18kGram)),
      silver1g: formatInr(silver925Gram, 2),
      silver999: formatInr(silver999Gram, 2),
      change: changeGram ? `${isUp ? "+" : "-"} \u20B9${Math.round(changeGram)}` : null,
      isUp,
      lastUpdated: formatTimestampIST(timestampMs)
    },
    meta: {
      provider: "GoldAPI.io",
      currency: "INR",
      unit: "gram",
      goldPurity: "22K (91.6% BIS Hallmark Jewellery Standard)",
      goldFinePurity: "24K (99.9% Benchmark Bullion)",
      silverPurity: "92.5% Sterling Silver"
    }
  };
}

// server/ratesService.js
var rateCache = {
  data: null,
  timestamp: 0,
  isLive: false,
  error: null
};
var DEFAULT_INDICATIVE_RATES = {
  raw: {
    gold24kGram: 7355,
    gold22kGram: 6742,
    gold18kGram: 5516,
    silver999Gram: 102.16,
    silver925Gram: 94.5,
    changeGram: 32,
    isUp: true,
    timestamp: Date.now()
  },
  formatted: {
    gold22k: "6,742",
    gold24k: "7,355",
    gold18k: "5,516",
    silver1g: "94.50",
    silver999: "102.16",
    change: "+ \u20B932",
    isUp: true,
    lastUpdated: formatTimestampIST(Date.now())
  },
  meta: {
    provider: "Showroom Benchmark (Indicative Baseline)",
    currency: "INR",
    unit: "gram",
    goldPurity: "22K (91.6% BIS Hallmark Jewellery Standard)",
    goldFinePurity: "24K (99.9% Benchmark Bullion)",
    silverPurity: "92.5% Sterling Silver"
  }
};
async function getPreciousRates(env = process.env, forceRefresh = false) {
  const apiKey = env.GOLD_API_KEY || env.GOLDAPI_KEY || env.METALS_API_KEY;
  const ttlMinutes = parseInt(env.RATE_CACHE_TTL_MINUTES || "10", 10);
  const cacheTtlMs = (isNaN(ttlMinutes) ? 10 : ttlMinutes) * 60 * 1e3;
  const now = Date.now();
  if (!forceRefresh && rateCache.data && now - rateCache.timestamp < cacheTtlMs) {
    return {
      success: true,
      status: rateCache.isLive ? "live_cached" : "indicative_cached",
      rates: rateCache.data,
      isLive: rateCache.isLive,
      isCached: true,
      cacheAgeSeconds: Math.round((now - rateCache.timestamp) / 1e3),
      expiresInSeconds: Math.max(0, Math.round((rateCache.timestamp + cacheTtlMs - now) / 1e3)),
      disclaimer: "Market benchmark rates are indicative and exclude local making charges & GST."
    };
  }
  if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_GOLDAPI_KEY_HERE") {
    const indicativeData = {
      ...DEFAULT_INDICATIVE_RATES,
      formatted: {
        ...DEFAULT_INDICATIVE_RATES.formatted,
        lastUpdated: formatTimestampIST(now)
      }
    };
    rateCache = {
      data: indicativeData,
      timestamp: now,
      isLive: false,
      error: null
    };
    return {
      success: true,
      status: "unconfigured_indicative",
      isLive: false,
      isCached: false,
      rates: indicativeData,
      note: "Live provider API key (GOLD_API_KEY) is not configured in .env. Displaying showroom baseline benchmark rates.",
      setupGuide: "To enable automatic live rates from GoldAPI.io, add GOLD_API_KEY=<your_free_key> to .env file.",
      disclaimer: "Indicative market benchmark rates. Final billing rate determined at showroom counter."
    };
  }
  try {
    const goldHeaders = {
      "x-access-token": apiKey.trim(),
      "Content-Type": "application/json"
    };
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://www.goldapi.io/api/XAU/INR", { headers: goldHeaders }),
      fetch("https://www.goldapi.io/api/XAG/INR", { headers: goldHeaders })
    ]);
    if (!goldRes.ok) {
      const errorText = await goldRes.text().catch(() => "");
      throw new Error(`GoldAPI HTTP Error ${goldRes.status}: ${errorText.substring(0, 100)}`);
    }
    const goldData = await goldRes.json();
    let silverData = null;
    if (silverRes.ok) {
      silverData = await silverRes.json().catch(() => null);
    }
    const parsedRates = parseGoldApiResponse(goldData, silverData);
    rateCache = {
      data: parsedRates,
      timestamp: now,
      isLive: true,
      error: null
    };
    return {
      success: true,
      status: "live",
      isLive: true,
      isCached: false,
      rates: parsedRates,
      cacheAgeSeconds: 0,
      disclaimer: "Live spot market rates in INR per gram. Excludes local making charges and GST."
    };
  } catch (err) {
    console.error("[RateService Error]", err.message || "Failed to fetch precious rates");
    if (rateCache.data) {
      return {
        success: true,
        status: "stale_fallback",
        isLive: false,
        isCached: true,
        isStale: true,
        rates: rateCache.data,
        cacheAgeSeconds: Math.round((now - rateCache.timestamp) / 1e3),
        warning: "Live rate update currently unreachable. Serving last successfully cached rates.",
        disclaimer: "Stale benchmark rates. Verify with showroom before transacting."
      };
    }
    const fallbackData = {
      ...DEFAULT_INDICATIVE_RATES,
      formatted: {
        ...DEFAULT_INDICATIVE_RATES.formatted,
        lastUpdated: formatTimestampIST(now)
      }
    };
    return {
      success: true,
      status: "error_fallback",
      isLive: false,
      isCached: false,
      isStale: true,
      rates: fallbackData,
      error: "Unable to reach live rates provider. Displaying baseline indicative rates.",
      disclaimer: "Indicative showroom benchmark rates."
    };
  }
}

// server/authService.js
import crypto from "node:crypto";
var activeSessions = /* @__PURE__ */ new Map();
var STAFF_REGISTRY = [
  {
    id: "USR-001",
    username: "admin",
    aliases: ["admin@vedaradha.com", "manager"],
    name: "Admin",
    role: "Administrator",
    email: "admin@vedaradha.com",
    passwordHash: crypto.createHash("sha256").update("admin@123vr_salt_2026_secure").digest("hex"),
    salt: "vr_salt_2026_secure"
  }
];
function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}
async function authenticateStaff(username, password) {
  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    return {
      success: false,
      statusCode: 400,
      error: "Username and password are required."
    };
  }
  const normalizedUser = username.trim().toLowerCase();
  const staff = STAFF_REGISTRY.find(
    (s) => s.username.toLowerCase() === normalizedUser || s.aliases.includes(normalizedUser)
  );
  if (!staff) {
    await new Promise((r) => setTimeout(r, 60));
    return {
      success: false,
      statusCode: 401,
      error: "Unable to sign in. Check your details and try again."
    };
  }
  const computedHash = hashPassword(password.trim(), staff.salt);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(computedHash, "utf8"),
    Buffer.from(staff.passwordHash, "utf8")
  );
  if (!isMatch) {
    return {
      success: false,
      statusCode: 401,
      error: "Unable to sign in. Check your details and try again."
    };
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 24 * 60 * 60 * 1e3;
  const sessionUser = {
    id: staff.id,
    username: staff.username,
    name: staff.name,
    role: staff.role,
    email: staff.email
  };
  activeSessions.set(token, {
    user: sessionUser,
    expiresAt
  });
  return {
    success: true,
    statusCode: 200,
    token,
    expiresAt,
    user: sessionUser
  };
}
function verifySession(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session.user;
}
function invalidateSession(token) {
  if (token) {
    activeSessions.delete(token);
  }
  return { success: true };
}

// vite.config.js
function adminAuthApiPlugin() {
  return {
    name: "admin-auth-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/api/auth")) {
          res.setHeader("Content-Type", "application/json");
          if (req.method === "POST" && req.url.includes("/login")) {
            let bodyStr = "";
            req.on("data", (chunk) => {
              bodyStr += chunk;
            });
            req.on("end", async () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                const result = await authenticateStaff(body.username, body.password);
                res.statusCode = result.statusCode || (result.success ? 200 : 401);
                res.end(JSON.stringify(result));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: "Invalid JSON payload" }));
              }
            });
            return;
          }
          if (req.method === "GET" && req.url.includes("/me")) {
            const authHeader = req.headers["authorization"] || "";
            const token = authHeader.replace(/^Bearer\s+/i, "").trim();
            const user = verifySession(token);
            if (!user) {
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, error: "Unauthorized session" }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, user }));
            return;
          }
          if (req.method === "POST" && req.url.includes("/logout")) {
            const authHeader = req.headers["authorization"] || "";
            const token = authHeader.replace(/^Bearer\s+/i, "").trim();
            invalidateSession(token);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
            return;
          }
        }
        next();
      });
    }
  };
}
function preciousRatesApiPlugin(env) {
  return {
    name: "precious-rates-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/api/rates")) {
          try {
            const urlObj = new URL(req.url, "http://localhost");
            const force = urlObj.searchParams.get("force") === "true" || urlObj.searchParams.get("refresh") === "1";
            const rateData = await getPreciousRates(env, force);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(rateData));
            return;
          } catch (err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: "Failed to process rates API request",
              details: err.message
            }));
            return;
          }
        }
        next();
      });
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      adminAuthApiPlugin(),
      preciousRatesApiPlugin(env)
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic2VydmVyL3JhdGVDYWxjdWxhdGlvbnMuanMiLCAic2VydmVyL3JhdGVzU2VydmljZS5qcyIsICJzZXJ2ZXIvYXV0aFNlcnZpY2UuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2ZWRoYXJhZGhhIEpld2VsbGVyeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcdmVkaGFyYWRoYSBKZXdlbGxlcnlcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3ZlZGhhcmFkaGElMjBKZXdlbGxlcnkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgZ2V0UHJlY2lvdXNSYXRlcyB9IGZyb20gJy4vc2VydmVyL3JhdGVzU2VydmljZS5qcyc7XHJcbmltcG9ydCB7IGF1dGhlbnRpY2F0ZVN0YWZmLCB2ZXJpZnlTZXNzaW9uLCBpbnZhbGlkYXRlU2Vzc2lvbiB9IGZyb20gJy4vc2VydmVyL2F1dGhTZXJ2aWNlLmpzJztcclxuXHJcbi8vIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBoYW5kbGUgL2FwaS9hdXRoIGVuZHBvaW50cyBkdXJpbmcgZGV2IGFuZCBwcmV2aWV3XHJcbmZ1bmN0aW9uIGFkbWluQXV0aEFwaVBsdWdpbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ2FkbWluLWF1dGgtYXBpJyxcclxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcclxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBpZiAocmVxLnVybCAmJiByZXEudXJsLnN0YXJ0c1dpdGgoJy9hcGkvYXV0aCcpKSB7XHJcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG5cclxuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcgJiYgcmVxLnVybC5pbmNsdWRlcygnL2xvZ2luJykpIHtcclxuICAgICAgICAgICAgbGV0IGJvZHlTdHIgPSAnJztcclxuICAgICAgICAgICAgcmVxLm9uKCdkYXRhJywgY2h1bmsgPT4geyBib2R5U3RyICs9IGNodW5rOyB9KTtcclxuICAgICAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKGJvZHlTdHIgfHwgJ3t9Jyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhdXRoZW50aWNhdGVTdGFmZihib2R5LnVzZXJuYW1lLCBib2R5LnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gcmVzdWx0LnN0YXR1c0NvZGUgfHwgKHJlc3VsdC5zdWNjZXNzID8gMjAwIDogNDAxKTtcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBKU09OIHBheWxvYWQnIH0pKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdHRVQnICYmIHJlcS51cmwuaW5jbHVkZXMoJy9tZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddIHx8ICcnO1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF1dGhIZWFkZXIucmVwbGFjZSgvXkJlYXJlclxccysvaSwgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IHZlcmlmeVNlc3Npb24odG9rZW4pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XHJcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ1VuYXV0aG9yaXplZCBzZXNzaW9uJyB9KSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHVzZXIgfSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiByZXEudXJsLmluY2x1ZGVzKCcvbG9nb3V0JykpIHtcclxuICAgICAgICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ10gfHwgJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5yZXBsYWNlKC9eQmVhcmVyXFxzKy9pLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICBpbnZhbGlkYXRlU2Vzc2lvbih0b2tlbik7XHJcblxyXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLy8gQ3VzdG9tIFZpdGUgcGx1Z2luIHRvIGhhbmRsZSAvYXBpL3JhdGVzIGVuZHBvaW50IGR1cmluZyBkZXYgYW5kIHByZXZpZXdcclxuZnVuY3Rpb24gcHJlY2lvdXNSYXRlc0FwaVBsdWdpbihlbnYpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ3ByZWNpb3VzLXJhdGVzLWFwaScsXHJcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XHJcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgaWYgKHJlcS51cmwgJiYgcmVxLnVybC5zdGFydHNXaXRoKCcvYXBpL3JhdGVzJykpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwocmVxLnVybCwgJ2h0dHA6Ly9sb2NhbGhvc3QnKTtcclxuICAgICAgICAgICAgY29uc3QgZm9yY2UgPSB1cmxPYmouc2VhcmNoUGFyYW1zLmdldCgnZm9yY2UnKSA9PT0gJ3RydWUnIHx8IHVybE9iai5zZWFyY2hQYXJhbXMuZ2V0KCdyZWZyZXNoJykgPT09ICcxJztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHJhdGVEYXRhID0gYXdhaXQgZ2V0UHJlY2lvdXNSYXRlcyhlbnYsIGZvcmNlKTtcclxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmF0ZURhdGEpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICBlcnJvcjogJ0ZhaWxlZCB0byBwcm9jZXNzIHJhdGVzIEFQSSByZXF1ZXN0JyxcclxuICAgICAgICAgICAgICBkZXRhaWxzOiBlcnIubWVzc2FnZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgLy8gTG9hZCBzZXJ2ZXItc2lkZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZnJvbSAuZW52IHdpdGhvdXQgZXhwb3Npbmcgc2VjcmV0IGtleXMgdG8gY2xpZW50XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIGFkbWluQXV0aEFwaVBsdWdpbigpLFxyXG4gICAgICBwcmVjaW91c1JhdGVzQXBpUGx1Z2luKGVudilcclxuICAgIF0sXHJcbiAgfTtcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcdmVkaGFyYWRoYSBKZXdlbGxlcnlcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx2ZWRoYXJhZGhhIEpld2VsbGVyeVxcXFxzZXJ2ZXJcXFxccmF0ZUNhbGN1bGF0aW9ucy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovdmVkaGFyYWRoYSUyMEpld2VsbGVyeS9zZXJ2ZXIvcmF0ZUNhbGN1bGF0aW9ucy5qc1wiOy8qKlxyXG4gKiBSYXRlIENhbGN1bGF0aW9uICYgUGFyc2luZyBVdGlsaXRpZXNcclxuICogXHJcbiAqIFN0YW5kYXJkIFVuaXRzOlxyXG4gKiAxIFRyb3kgT3VuY2UgKG96IHQpID0gMzEuMTAzNDc2OCBncmFtcyAoZylcclxuICogMjRLIEdvbGQgPSA5OS45JSBQdXJpdHkgKEZpbmUgR29sZClcclxuICogMjJLIEdvbGQgPSA5MS42NyUgUHVyaXR5ICgyMi8yNCwgU3RhbmRhcmQgQklTIDkxNiBJbmRpYW4gSmV3ZWxsZXJ5IEdvbGQpXHJcbiAqIDE4SyBHb2xkID0gNzUuMCUgUHVyaXR5ICgxOC8yNClcclxuICogOTk5IFNpbHZlciA9IDk5LjklIFB1cml0eSAoRmluZSBTaWx2ZXIpXHJcbiAqIDkyNSBTaWx2ZXIgPSA5Mi41JSBQdXJpdHkgKFN0ZXJsaW5nIFNpbHZlcilcclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgVFJPWV9PVU5DRV9JTl9HUkFNUyA9IDMxLjEwMzQ3Njg7XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYSBwcmljZSBwZXIgdHJveSBvdW5jZSBpbnRvIHByaWNlIHBlciBncmFtLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcHJpY2VQZXJPdW5jZSBcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VHJveU91bmNlVG9HcmFtKHByaWNlUGVyT3VuY2UpIHtcclxuICBpZiAodHlwZW9mIHByaWNlUGVyT3VuY2UgIT09ICdudW1iZXInIHx8IGlzTmFOKHByaWNlUGVyT3VuY2UpIHx8IHByaWNlUGVyT3VuY2UgPD0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHByaWNlIHBlciBvdW5jZSBwcm92aWRlZCBmb3IgY29udmVyc2lvbicpO1xyXG4gIH1cclxuICByZXR1cm4gcHJpY2VQZXJPdW5jZSAvIFRST1lfT1VOQ0VfSU5fR1JBTVM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXJpdmVzIDIySyBqZXdlbGxlcnkgZ29sZCByYXRlIGZyb20gMjRLIGdvbGQgcmF0ZSBwZXIgZ3JhbS5cclxuICogU3RhbmRhcmQgcmF0aW86IDIyIC8gMjQgPSAwLjkxNjY2Ni4uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZTIya0Zyb20yNGsocHJpY2UyNGtQZXJHcmFtKSB7XHJcbiAgaWYgKHR5cGVvZiBwcmljZTI0a1BlckdyYW0gIT09ICdudW1iZXInIHx8IGlzTmFOKHByaWNlMjRrUGVyR3JhbSkgfHwgcHJpY2UyNGtQZXJHcmFtIDw9IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCAyNEsgZ29sZCByYXRlIHByb3ZpZGVkJyk7XHJcbiAgfVxyXG4gIHJldHVybiBwcmljZTI0a1BlckdyYW0gKiAoMjIgLyAyNCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXJpdmVzIDE4SyBnb2xkIHJhdGUgZnJvbSAyNEsgZ29sZCByYXRlIHBlciBncmFtLlxyXG4gKiBTdGFuZGFyZCByYXRpbzogMTggLyAyNCA9IDAuNzVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGUxOGtGcm9tMjRrKHByaWNlMjRrUGVyR3JhbSkge1xyXG4gIGlmICh0eXBlb2YgcHJpY2UyNGtQZXJHcmFtICE9PSAnbnVtYmVyJyB8fCBpc05hTihwcmljZTI0a1BlckdyYW0pIHx8IHByaWNlMjRrUGVyR3JhbSA8PSAwKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgMjRLIGdvbGQgcmF0ZSBwcm92aWRlZCcpO1xyXG4gIH1cclxuICByZXR1cm4gcHJpY2UyNGtQZXJHcmFtICogKDE4IC8gMjQpO1xyXG59XHJcblxyXG4vKipcclxuICogRGVyaXZlcyA5Mi41JSBzdGVybGluZyBzaWx2ZXIgcmF0ZSBmcm9tIDk5LjklIHB1cmUgc2lsdmVyIHJhdGUgcGVyIGdyYW0uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlOTI1U2lsdmVyRnJvbTk5OShwcmljZTk5OVNpbHZlclBlckdyYW0pIHtcclxuICBpZiAodHlwZW9mIHByaWNlOTk5U2lsdmVyUGVyR3JhbSAhPT0gJ251bWJlcicgfHwgaXNOYU4ocHJpY2U5OTlTaWx2ZXJQZXJHcmFtKSB8fCBwcmljZTk5OVNpbHZlclBlckdyYW0gPD0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIDk5OSBzaWx2ZXIgcmF0ZSBwcm92aWRlZCcpO1xyXG4gIH1cclxuICByZXR1cm4gcHJpY2U5OTlTaWx2ZXJQZXJHcmFtICogMC45MjU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb3JtYXRzIGEgbnVtYmVyIHRvIEluZGlhbiBSdXBlZSBjdXJyZW5jeSByZXByZXNlbnRhdGlvbiB3aXRoIGdyb3VwaW5nLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGVjaW1hbHMgXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGUuZy4gXCI2LDc0MlwiIG9yIFwiOTQuNTBcIlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdElucihhbW91bnQsIGRlY2ltYWxzID0gMCkge1xyXG4gIGlmICh0eXBlb2YgYW1vdW50ICE9PSAnbnVtYmVyJyB8fCBpc05hTihhbW91bnQpKSByZXR1cm4gJzAnO1xyXG4gIHJldHVybiBhbW91bnQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiBkZWNpbWFscyxcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogZGVjaW1hbHNcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZvcm1hdHMgYSB0aW1lc3RhbXAgaW50byBJbmRpYSBTdGFuZGFyZCBUaW1lIChBc2lhL0tvbGthdGEpLlxyXG4gKiBAcGFyYW0ge0RhdGV8c3RyaW5nfG51bWJlcn0gZGF0ZUlucHV0IFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBlLmcuIFwiMDggT2N0IDIwMjYsIDAyOjQ1IFBNIElTVFwiXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZXN0YW1wSVNUKGRhdGVJbnB1dCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBkID0gZGF0ZUlucHV0IGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVJbnB1dCA6IG5ldyBEYXRlKGRhdGVJbnB1dCk7XHJcbiAgICBpZiAoaXNOYU4oZC5nZXRUaW1lKCkpKSB7XHJcbiAgICAgIHJldHVybiAnVG9kYXksIE1hcmtldCBIb3Vycyc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuLUlOJywge1xyXG4gICAgICB0aW1lWm9uZTogJ0FzaWEvS29sa2F0YScsXHJcbiAgICAgIGRheTogJzItZGlnaXQnLFxyXG4gICAgICBtb250aDogJ3Nob3J0JyxcclxuICAgICAgeWVhcjogJ251bWVyaWMnLFxyXG4gICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnLFxyXG4gICAgICBob3VyMTI6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBgJHtmb3JtYXR0ZXIuZm9ybWF0KGQpfSBJU1RgO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuICdUb2RheSwgTWFya2V0IEhvdXJzJztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJzZXMgcmVzcG9uc2UgZnJvbSBHb2xkQVBJLmlvIChYQVUvSU5SICYgWEFHL0lOUilcclxuICogQHBhcmFtIHtvYmplY3R9IGdvbGREYXRhIFxyXG4gKiBAcGFyYW0ge29iamVjdH0gc2lsdmVyRGF0YSBcclxuICogQHJldHVybnMge29iamVjdH0gTm9ybWFsaXplZCByYXRlIG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlR29sZEFwaVJlc3BvbnNlKGdvbGREYXRhLCBzaWx2ZXJEYXRhKSB7XHJcbiAgaWYgKCFnb2xkRGF0YSB8fCB0eXBlb2YgZ29sZERhdGEgIT09ICdvYmplY3QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZ29sZCBkYXRhIHBheWxvYWQgZnJvbSBwcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgLy8gR29sZEFQSSBnaXZlcyBwcmljZV9ncmFtXzI0aywgcHJpY2VfZ3JhbV8yMmssIHByaWNlX2dyYW1fMThrIGRpcmVjdGx5LCBvciBwcmljZSAocGVyIG91bmNlKVxyXG4gIGxldCBnb2xkMjRrR3JhbSA9IGdvbGREYXRhLnByaWNlX2dyYW1fMjRrO1xyXG4gIGlmICghZ29sZDI0a0dyYW0gJiYgZ29sZERhdGEucHJpY2UpIHtcclxuICAgIGdvbGQyNGtHcmFtID0gY29udmVydFRyb3lPdW5jZVRvR3JhbShnb2xkRGF0YS5wcmljZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWdvbGQyNGtHcmFtIHx8IGlzTmFOKGdvbGQyNGtHcmFtKSB8fCBnb2xkMjRrR3JhbSA8PSAwKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBleHRyYWN0IHZhbGlkIDI0SyBnb2xkIHJhdGUgcGVyIGdyYW0nKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGdvbGQyMmtHcmFtID0gZ29sZERhdGEucHJpY2VfZ3JhbV8yMmsgfHwgY2FsY3VsYXRlMjJrRnJvbTI0ayhnb2xkMjRrR3JhbSk7XHJcbiAgY29uc3QgZ29sZDE4a0dyYW0gPSBnb2xkRGF0YS5wcmljZV9ncmFtXzE4ayB8fCBjYWxjdWxhdGUxOGtGcm9tMjRrKGdvbGQyNGtHcmFtKTtcclxuXHJcbiAgLy8gRGFpbHkgY2hhbmdlIGlmIGF2YWlsYWJsZVxyXG4gIGxldCBjaGFuZ2VHcmFtID0gbnVsbDtcclxuICBsZXQgaXNVcCA9IHRydWU7XHJcbiAgaWYgKHR5cGVvZiBnb2xkRGF0YS5jaF9wcmV2ID09PSAnbnVtYmVyJykge1xyXG4gICAgY2hhbmdlR3JhbSA9IE1hdGguYWJzKGdvbGREYXRhLmNoX3ByZXYgLyBUUk9ZX09VTkNFX0lOX0dSQU1TKTtcclxuICAgIGlzVXAgPSBnb2xkRGF0YS5jaF9wcmV2ID49IDA7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ29sZERhdGEuY2ggPT09ICdudW1iZXInKSB7XHJcbiAgICBjaGFuZ2VHcmFtID0gTWF0aC5hYnMoZ29sZERhdGEuY2ggLyBUUk9ZX09VTkNFX0lOX0dSQU1TKTtcclxuICAgIGlzVXAgPSBnb2xkRGF0YS5jaCA+PSAwO1xyXG4gIH1cclxuXHJcbiAgLy8gU2lsdmVyIHBhcnNpbmdcclxuICBsZXQgc2lsdmVyOTk5R3JhbSA9IDk0LjUwOyAvLyBkZWZhdWx0IGJlbmNobWFyayBpZiBzaWx2ZXIgcGF5bG9hZCBtaXNzaW5nXHJcbiAgaWYgKHNpbHZlckRhdGEgJiYgdHlwZW9mIHNpbHZlckRhdGEgPT09ICdvYmplY3QnKSB7XHJcbiAgICBpZiAoc2lsdmVyRGF0YS5wcmljZV9ncmFtXzI0aykge1xyXG4gICAgICBzaWx2ZXI5OTlHcmFtID0gc2lsdmVyRGF0YS5wcmljZV9ncmFtXzI0aztcclxuICAgIH0gZWxzZSBpZiAoc2lsdmVyRGF0YS5wcmljZSkge1xyXG4gICAgICBzaWx2ZXI5OTlHcmFtID0gY29udmVydFRyb3lPdW5jZVRvR3JhbShzaWx2ZXJEYXRhLnByaWNlKTtcclxuICAgIH1cclxuICB9XHJcbiAgY29uc3Qgc2lsdmVyOTI1R3JhbSA9IGNhbGN1bGF0ZTkyNVNpbHZlckZyb205OTkoc2lsdmVyOTk5R3JhbSk7XHJcblxyXG4gIGNvbnN0IHRpbWVzdGFtcE1zID0gKGdvbGREYXRhLnRpbWVzdGFtcCA/IGdvbGREYXRhLnRpbWVzdGFtcCAqIDEwMDAgOiBEYXRlLm5vdygpKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHJhdzoge1xyXG4gICAgICBnb2xkMjRrR3JhbSxcclxuICAgICAgZ29sZDIya0dyYW0sXHJcbiAgICAgIGdvbGQxOGtHcmFtLFxyXG4gICAgICBzaWx2ZXI5OTlHcmFtLFxyXG4gICAgICBzaWx2ZXI5MjVHcmFtLFxyXG4gICAgICBjaGFuZ2VHcmFtLFxyXG4gICAgICBpc1VwLFxyXG4gICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcE1zXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0dGVkOiB7XHJcbiAgICAgIGdvbGQyMms6IGZvcm1hdElucihNYXRoLnJvdW5kKGdvbGQyMmtHcmFtKSksXHJcbiAgICAgIGdvbGQyNGs6IGZvcm1hdElucihNYXRoLnJvdW5kKGdvbGQyNGtHcmFtKSksXHJcbiAgICAgIGdvbGQxOGs6IGZvcm1hdElucihNYXRoLnJvdW5kKGdvbGQxOGtHcmFtKSksXHJcbiAgICAgIHNpbHZlcjFnOiBmb3JtYXRJbnIoc2lsdmVyOTI1R3JhbSwgMiksXHJcbiAgICAgIHNpbHZlcjk5OTogZm9ybWF0SW5yKHNpbHZlcjk5OUdyYW0sIDIpLFxyXG4gICAgICBjaGFuZ2U6IGNoYW5nZUdyYW0gPyBgJHtpc1VwID8gJysnIDogJy0nfSBcdTIwQjkke01hdGgucm91bmQoY2hhbmdlR3JhbSl9YCA6IG51bGwsXHJcbiAgICAgIGlzVXAsXHJcbiAgICAgIGxhc3RVcGRhdGVkOiBmb3JtYXRUaW1lc3RhbXBJU1QodGltZXN0YW1wTXMpXHJcbiAgICB9LFxyXG4gICAgbWV0YToge1xyXG4gICAgICBwcm92aWRlcjogJ0dvbGRBUEkuaW8nLFxyXG4gICAgICBjdXJyZW5jeTogJ0lOUicsXHJcbiAgICAgIHVuaXQ6ICdncmFtJyxcclxuICAgICAgZ29sZFB1cml0eTogJzIySyAoOTEuNiUgQklTIEhhbGxtYXJrIEpld2VsbGVyeSBTdGFuZGFyZCknLFxyXG4gICAgICBnb2xkRmluZVB1cml0eTogJzI0SyAoOTkuOSUgQmVuY2htYXJrIEJ1bGxpb24pJyxcclxuICAgICAgc2lsdmVyUHVyaXR5OiAnOTIuNSUgU3RlcmxpbmcgU2lsdmVyJ1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2ZWRoYXJhZGhhIEpld2VsbGVyeVxcXFxzZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZlZGhhcmFkaGEgSmV3ZWxsZXJ5XFxcXHNlcnZlclxcXFxyYXRlc1NlcnZpY2UuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3ZlZGhhcmFkaGElMjBKZXdlbGxlcnkvc2VydmVyL3JhdGVzU2VydmljZS5qc1wiO2ltcG9ydCB7IHBhcnNlR29sZEFwaVJlc3BvbnNlLCBmb3JtYXRJbnIsIGZvcm1hdFRpbWVzdGFtcElTVCB9IGZyb20gJy4vcmF0ZUNhbGN1bGF0aW9ucy5qcyc7XHJcblxyXG4vKipcclxuICogSW4tbWVtb3J5IGNhY2hlIGZvciBwcmVjaW91cyBtZXRhbCByYXRlc1xyXG4gKi9cclxubGV0IHJhdGVDYWNoZSA9IHtcclxuICBkYXRhOiBudWxsLFxyXG4gIHRpbWVzdGFtcDogMCxcclxuICBpc0xpdmU6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsXHJcbn07XHJcblxyXG4vLyBGYWxsYmFjayBiYXNlbGluZSBpbmRpY2F0aXZlIHJhdGVzICh1c2VkIG9ubHkgd2hlbiBubyBBUEkga2V5IGNvbmZpZ3VyZWQpXHJcbmNvbnN0IERFRkFVTFRfSU5ESUNBVElWRV9SQVRFUyA9IHtcclxuICByYXc6IHtcclxuICAgIGdvbGQyNGtHcmFtOiA3MzU1LFxyXG4gICAgZ29sZDIya0dyYW06IDY3NDIsXHJcbiAgICBnb2xkMThrR3JhbTogNTUxNixcclxuICAgIHNpbHZlcjk5OUdyYW06IDEwMi4xNixcclxuICAgIHNpbHZlcjkyNUdyYW06IDk0LjUwLFxyXG4gICAgY2hhbmdlR3JhbTogMzIsXHJcbiAgICBpc1VwOiB0cnVlLFxyXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXHJcbiAgfSxcclxuICBmb3JtYXR0ZWQ6IHtcclxuICAgIGdvbGQyMms6ICc2LDc0MicsXHJcbiAgICBnb2xkMjRrOiAnNywzNTUnLFxyXG4gICAgZ29sZDE4azogJzUsNTE2JyxcclxuICAgIHNpbHZlcjFnOiAnOTQuNTAnLFxyXG4gICAgc2lsdmVyOTk5OiAnMTAyLjE2JyxcclxuICAgIGNoYW5nZTogJysgXHUyMEI5MzInLFxyXG4gICAgaXNVcDogdHJ1ZSxcclxuICAgIGxhc3RVcGRhdGVkOiBmb3JtYXRUaW1lc3RhbXBJU1QoRGF0ZS5ub3coKSlcclxuICB9LFxyXG4gIG1ldGE6IHtcclxuICAgIHByb3ZpZGVyOiAnU2hvd3Jvb20gQmVuY2htYXJrIChJbmRpY2F0aXZlIEJhc2VsaW5lKScsXHJcbiAgICBjdXJyZW5jeTogJ0lOUicsXHJcbiAgICB1bml0OiAnZ3JhbScsXHJcbiAgICBnb2xkUHVyaXR5OiAnMjJLICg5MS42JSBCSVMgSGFsbG1hcmsgSmV3ZWxsZXJ5IFN0YW5kYXJkKScsXHJcbiAgICBnb2xkRmluZVB1cml0eTogJzI0SyAoOTkuOSUgQmVuY2htYXJrIEJ1bGxpb24pJyxcclxuICAgIHNpbHZlclB1cml0eTogJzkyLjUlIFN0ZXJsaW5nIFNpbHZlcidcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBwcmVjaW91cyBtZXRhbCByYXRlcyBmcm9tIHByb3ZpZGVyIG9yIHJldHVybnMgY2FjaGVkL2ZhbGxiYWNrIGRhdGEuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbnYgRW52aXJvbm1lbnQgdmFyaWFibGVzIG9iamVjdFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlUmVmcmVzaCBJZiB0cnVlLCBieXBhc3NlcyBjYWNoZSBUVExcclxuICogQHJldHVybnMge1Byb21pc2U8b2JqZWN0Pn1cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQcmVjaW91c1JhdGVzKGVudiA9IHByb2Nlc3MuZW52LCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gIGNvbnN0IGFwaUtleSA9IGVudi5HT0xEX0FQSV9LRVkgfHwgZW52LkdPTERBUElfS0VZIHx8IGVudi5NRVRBTFNfQVBJX0tFWTtcclxuICBjb25zdCB0dGxNaW51dGVzID0gcGFyc2VJbnQoZW52LlJBVEVfQ0FDSEVfVFRMX01JTlVURVMgfHwgJzEwJywgMTApO1xyXG4gIGNvbnN0IGNhY2hlVHRsTXMgPSAoaXNOYU4odHRsTWludXRlcykgPyAxMCA6IHR0bE1pbnV0ZXMpICogNjAgKiAxMDAwO1xyXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcblxyXG4gIC8vIDEuIFJldHVybiBmcmVzaCBpbi1tZW1vcnkgY2FjaGVkIGRhdGEgaWYgd2l0aGluIFRUTFxyXG4gIGlmICghZm9yY2VSZWZyZXNoICYmIHJhdGVDYWNoZS5kYXRhICYmIChub3cgLSByYXRlQ2FjaGUudGltZXN0YW1wIDwgY2FjaGVUdGxNcykpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIHN0YXR1czogcmF0ZUNhY2hlLmlzTGl2ZSA/ICdsaXZlX2NhY2hlZCcgOiAnaW5kaWNhdGl2ZV9jYWNoZWQnLFxyXG4gICAgICByYXRlczogcmF0ZUNhY2hlLmRhdGEsXHJcbiAgICAgIGlzTGl2ZTogcmF0ZUNhY2hlLmlzTGl2ZSxcclxuICAgICAgaXNDYWNoZWQ6IHRydWUsXHJcbiAgICAgIGNhY2hlQWdlU2Vjb25kczogTWF0aC5yb3VuZCgobm93IC0gcmF0ZUNhY2hlLnRpbWVzdGFtcCkgLyAxMDAwKSxcclxuICAgICAgZXhwaXJlc0luU2Vjb25kczogTWF0aC5tYXgoMCwgTWF0aC5yb3VuZCgocmF0ZUNhY2hlLnRpbWVzdGFtcCArIGNhY2hlVHRsTXMgLSBub3cpIC8gMTAwMCkpLFxyXG4gICAgICBkaXNjbGFpbWVyOiAnTWFya2V0IGJlbmNobWFyayByYXRlcyBhcmUgaW5kaWNhdGl2ZSBhbmQgZXhjbHVkZSBsb2NhbCBtYWtpbmcgY2hhcmdlcyAmIEdTVC4nXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gMi4gSWYgQVBJIEtleSBpcyB1bmNvbmZpZ3VyZWQsIHJldHVybiBiYXNlbGluZSBpbmRpY2F0aXZlIGRhdGEgd2l0aCBjbGVhciB1bmNvbmZpZ3VyZWQgc3RhdHVzXHJcbiAgaWYgKCFhcGlLZXkgfHwgYXBpS2V5LnRyaW0oKSA9PT0gJycgfHwgYXBpS2V5ID09PSAnWU9VUl9HT0xEQVBJX0tFWV9IRVJFJykge1xyXG4gICAgY29uc3QgaW5kaWNhdGl2ZURhdGEgPSB7XHJcbiAgICAgIC4uLkRFRkFVTFRfSU5ESUNBVElWRV9SQVRFUyxcclxuICAgICAgZm9ybWF0dGVkOiB7XHJcbiAgICAgICAgLi4uREVGQVVMVF9JTkRJQ0FUSVZFX1JBVEVTLmZvcm1hdHRlZCxcclxuICAgICAgICBsYXN0VXBkYXRlZDogZm9ybWF0VGltZXN0YW1wSVNUKG5vdylcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByYXRlQ2FjaGUgPSB7XHJcbiAgICAgIGRhdGE6IGluZGljYXRpdmVEYXRhLFxyXG4gICAgICB0aW1lc3RhbXA6IG5vdyxcclxuICAgICAgaXNMaXZlOiBmYWxzZSxcclxuICAgICAgZXJyb3I6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgc3RhdHVzOiAndW5jb25maWd1cmVkX2luZGljYXRpdmUnLFxyXG4gICAgICBpc0xpdmU6IGZhbHNlLFxyXG4gICAgICBpc0NhY2hlZDogZmFsc2UsXHJcbiAgICAgIHJhdGVzOiBpbmRpY2F0aXZlRGF0YSxcclxuICAgICAgbm90ZTogJ0xpdmUgcHJvdmlkZXIgQVBJIGtleSAoR09MRF9BUElfS0VZKSBpcyBub3QgY29uZmlndXJlZCBpbiAuZW52LiBEaXNwbGF5aW5nIHNob3dyb29tIGJhc2VsaW5lIGJlbmNobWFyayByYXRlcy4nLFxyXG4gICAgICBzZXR1cEd1aWRlOiAnVG8gZW5hYmxlIGF1dG9tYXRpYyBsaXZlIHJhdGVzIGZyb20gR29sZEFQSS5pbywgYWRkIEdPTERfQVBJX0tFWT08eW91cl9mcmVlX2tleT4gdG8gLmVudiBmaWxlLicsXHJcbiAgICAgIGRpc2NsYWltZXI6ICdJbmRpY2F0aXZlIG1hcmtldCBiZW5jaG1hcmsgcmF0ZXMuIEZpbmFsIGJpbGxpbmcgcmF0ZSBkZXRlcm1pbmVkIGF0IHNob3dyb29tIGNvdW50ZXIuJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIDMuIEF0dGVtcHQgbGl2ZSBmZXRjaCBmcm9tIEdvbGRBUEkuaW9cclxuICB0cnkge1xyXG4gICAgY29uc3QgZ29sZEhlYWRlcnMgPSB7XHJcbiAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFwaUtleS50cmltKCksXHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH07XHJcblxyXG4gICAgLy8gUGFyYWxsZWwgZmV0Y2ggZm9yIEdvbGQgYW5kIFNpbHZlclxyXG4gICAgY29uc3QgW2dvbGRSZXMsIHNpbHZlclJlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgIGZldGNoKCdodHRwczovL3d3dy5nb2xkYXBpLmlvL2FwaS9YQVUvSU5SJywgeyBoZWFkZXJzOiBnb2xkSGVhZGVycyB9KSxcclxuICAgICAgZmV0Y2goJ2h0dHBzOi8vd3d3LmdvbGRhcGkuaW8vYXBpL1hBRy9JTlInLCB7IGhlYWRlcnM6IGdvbGRIZWFkZXJzIH0pXHJcbiAgICBdKTtcclxuXHJcbiAgICBpZiAoIWdvbGRSZXMub2spIHtcclxuICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgZ29sZFJlcy50ZXh0KCkuY2F0Y2goKCkgPT4gJycpO1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEdvbGRBUEkgSFRUUCBFcnJvciAke2dvbGRSZXMuc3RhdHVzfTogJHtlcnJvclRleHQuc3Vic3RyaW5nKDAsIDEwMCl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ29sZERhdGEgPSBhd2FpdCBnb2xkUmVzLmpzb24oKTtcclxuICAgIGxldCBzaWx2ZXJEYXRhID0gbnVsbDtcclxuICAgIGlmIChzaWx2ZXJSZXMub2spIHtcclxuICAgICAgc2lsdmVyRGF0YSA9IGF3YWl0IHNpbHZlclJlcy5qc29uKCkuY2F0Y2goKCkgPT4gbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyc2VkUmF0ZXMgPSBwYXJzZUdvbGRBcGlSZXNwb25zZShnb2xkRGF0YSwgc2lsdmVyRGF0YSk7XHJcblxyXG4gICAgLy8gU2F2ZSB0byBjYWNoZVxyXG4gICAgcmF0ZUNhY2hlID0ge1xyXG4gICAgICBkYXRhOiBwYXJzZWRSYXRlcyxcclxuICAgICAgdGltZXN0YW1wOiBub3csXHJcbiAgICAgIGlzTGl2ZTogdHJ1ZSxcclxuICAgICAgZXJyb3I6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgc3RhdHVzOiAnbGl2ZScsXHJcbiAgICAgIGlzTGl2ZTogdHJ1ZSxcclxuICAgICAgaXNDYWNoZWQ6IGZhbHNlLFxyXG4gICAgICByYXRlczogcGFyc2VkUmF0ZXMsXHJcbiAgICAgIGNhY2hlQWdlU2Vjb25kczogMCxcclxuICAgICAgZGlzY2xhaW1lcjogJ0xpdmUgc3BvdCBtYXJrZXQgcmF0ZXMgaW4gSU5SIHBlciBncmFtLiBFeGNsdWRlcyBsb2NhbCBtYWtpbmcgY2hhcmdlcyBhbmQgR1NULidcclxuICAgIH07XHJcblxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgLy8gU2FmZSBlcnJvciBsb2dnaW5nIHdpdGhvdXQgcmV2ZWFsaW5nIEFQSSBrZXlzXHJcbiAgICBjb25zb2xlLmVycm9yKCdbUmF0ZVNlcnZpY2UgRXJyb3JdJywgZXJyLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBmZXRjaCBwcmVjaW91cyByYXRlcycpO1xyXG5cclxuICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXNseSBjYWNoZWQgZGF0YSwgcmV0dXJuIGl0IGFzIHN0YWxlIGZhbGxiYWNrXHJcbiAgICBpZiAocmF0ZUNhY2hlLmRhdGEpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgIHN0YXR1czogJ3N0YWxlX2ZhbGxiYWNrJyxcclxuICAgICAgICBpc0xpdmU6IGZhbHNlLFxyXG4gICAgICAgIGlzQ2FjaGVkOiB0cnVlLFxyXG4gICAgICAgIGlzU3RhbGU6IHRydWUsXHJcbiAgICAgICAgcmF0ZXM6IHJhdGVDYWNoZS5kYXRhLFxyXG4gICAgICAgIGNhY2hlQWdlU2Vjb25kczogTWF0aC5yb3VuZCgobm93IC0gcmF0ZUNhY2hlLnRpbWVzdGFtcCkgLyAxMDAwKSxcclxuICAgICAgICB3YXJuaW5nOiAnTGl2ZSByYXRlIHVwZGF0ZSBjdXJyZW50bHkgdW5yZWFjaGFibGUuIFNlcnZpbmcgbGFzdCBzdWNjZXNzZnVsbHkgY2FjaGVkIHJhdGVzLicsXHJcbiAgICAgICAgZGlzY2xhaW1lcjogJ1N0YWxlIGJlbmNobWFyayByYXRlcy4gVmVyaWZ5IHdpdGggc2hvd3Jvb20gYmVmb3JlIHRyYW5zYWN0aW5nLidcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPdGhlcndpc2UgcmV0dXJuIGRlZmF1bHQgaW5kaWNhdGl2ZSBmYWxsYmFja1xyXG4gICAgY29uc3QgZmFsbGJhY2tEYXRhID0ge1xyXG4gICAgICAuLi5ERUZBVUxUX0lORElDQVRJVkVfUkFURVMsXHJcbiAgICAgIGZvcm1hdHRlZDoge1xyXG4gICAgICAgIC4uLkRFRkFVTFRfSU5ESUNBVElWRV9SQVRFUy5mb3JtYXR0ZWQsXHJcbiAgICAgICAgbGFzdFVwZGF0ZWQ6IGZvcm1hdFRpbWVzdGFtcElTVChub3cpXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgc3RhdHVzOiAnZXJyb3JfZmFsbGJhY2snLFxyXG4gICAgICBpc0xpdmU6IGZhbHNlLFxyXG4gICAgICBpc0NhY2hlZDogZmFsc2UsXHJcbiAgICAgIGlzU3RhbGU6IHRydWUsXHJcbiAgICAgIHJhdGVzOiBmYWxsYmFja0RhdGEsXHJcbiAgICAgIGVycm9yOiAnVW5hYmxlIHRvIHJlYWNoIGxpdmUgcmF0ZXMgcHJvdmlkZXIuIERpc3BsYXlpbmcgYmFzZWxpbmUgaW5kaWNhdGl2ZSByYXRlcy4nLFxyXG4gICAgICBkaXNjbGFpbWVyOiAnSW5kaWNhdGl2ZSBzaG93cm9vbSBiZW5jaG1hcmsgcmF0ZXMuJ1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXNldHMgY2FjaGUgZm9yIHRlc3RpbmcgcHVycG9zZXNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfcmVzZXRSYXRlQ2FjaGUoKSB7XHJcbiAgcmF0ZUNhY2hlID0ge1xyXG4gICAgZGF0YTogbnVsbCxcclxuICAgIHRpbWVzdGFtcDogMCxcclxuICAgIGlzTGl2ZTogZmFsc2UsXHJcbiAgICBlcnJvcjogbnVsbFxyXG4gIH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx2ZWRoYXJhZGhhIEpld2VsbGVyeVxcXFxzZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZlZGhhcmFkaGEgSmV3ZWxsZXJ5XFxcXHNlcnZlclxcXFxhdXRoU2VydmljZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovdmVkaGFyYWRoYSUyMEpld2VsbGVyeS9zZXJ2ZXIvYXV0aFNlcnZpY2UuanNcIjtpbXBvcnQgY3J5cHRvIGZyb20gJ25vZGU6Y3J5cHRvJztcclxuXHJcbi8vIEluLW1lbW9yeSBzZXJ2ZXIgc2Vzc2lvbiBzdG9yZSAod2l0aCBUVEwgY2xlYW51cClcclxuY29uc3QgYWN0aXZlU2Vzc2lvbnMgPSBuZXcgTWFwKCk7XHJcblxyXG4vLyBTdGFmZiBhY2NvdW50cyBmb3Igc2hvd3Jvb20gbWFuYWdlbWVudCAodmVyaWZpZWQgd2l0aCBjb25zdGFudC10aW1lIGNvbXBhcmlzb24pXHJcbmNvbnN0IFNUQUZGX1JFR0lTVFJZID0gW1xyXG4gIHtcclxuICAgIGlkOiAnVVNSLTAwMScsXHJcbiAgICB1c2VybmFtZTogJ2FkbWluJyxcclxuICAgIGFsaWFzZXM6IFsnYWRtaW5AdmVkYXJhZGhhLmNvbScsICdtYW5hZ2VyJ10sXHJcbiAgICBuYW1lOiAnQWRtaW4nLFxyXG4gICAgcm9sZTogJ0FkbWluaXN0cmF0b3InLFxyXG4gICAgZW1haWw6ICdhZG1pbkB2ZWRhcmFkaGEuY29tJyxcclxuICAgIHBhc3N3b3JkSGFzaDogY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZSgnYWRtaW5AMTIzJyArICd2cl9zYWx0XzIwMjZfc2VjdXJlJykuZGlnZXN0KCdoZXgnKSxcclxuICAgIHNhbHQ6ICd2cl9zYWx0XzIwMjZfc2VjdXJlJ1xyXG4gIH1cclxuXTtcclxuXHJcbmZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZCwgc2FsdCkge1xyXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKHBhc3N3b3JkICsgc2FsdCkuZGlnZXN0KCdoZXgnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEF1dGhlbnRpY2F0ZSBzdGFmZiBjcmVkZW50aWFsc1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZVN0YWZmKHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG4gIGlmICghdXNlcm5hbWUgfHwgdHlwZW9mIHVzZXJuYW1lICE9PSAnc3RyaW5nJyB8fCAhcGFzc3dvcmQgfHwgdHlwZW9mIHBhc3N3b3JkICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgZXJyb3I6ICdVc2VybmFtZSBhbmQgcGFzc3dvcmQgYXJlIHJlcXVpcmVkLidcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdCBub3JtYWxpemVkVXNlciA9IHVzZXJuYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0YWZmID0gU1RBRkZfUkVHSVNUUlkuZmluZChcclxuICAgIHMgPT4gcy51c2VybmFtZS50b0xvd2VyQ2FzZSgpID09PSBub3JtYWxpemVkVXNlciB8fCBzLmFsaWFzZXMuaW5jbHVkZXMobm9ybWFsaXplZFVzZXIpXHJcbiAgKTtcclxuXHJcbiAgaWYgKCFzdGFmZikge1xyXG4gICAgLy8gQ29uc3RhbnQtdGltZSBkdW1teSBkZWxheSBzaW11bGF0aW9uIHRvIHByZXZlbnQgdGltaW5nIGF0dGFja3NcclxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHIgPT4gc2V0VGltZW91dChyLCA2MCkpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIHN0YXR1c0NvZGU6IDQwMSxcclxuICAgICAgZXJyb3I6ICdVbmFibGUgdG8gc2lnbiBpbi4gQ2hlY2sgeW91ciBkZXRhaWxzIGFuZCB0cnkgYWdhaW4uJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNvbXB1dGVkSGFzaCA9IGhhc2hQYXNzd29yZChwYXNzd29yZC50cmltKCksIHN0YWZmLnNhbHQpO1xyXG4gIGNvbnN0IGlzTWF0Y2ggPSBjcnlwdG8udGltaW5nU2FmZUVxdWFsKFxyXG4gICAgQnVmZmVyLmZyb20oY29tcHV0ZWRIYXNoLCAndXRmOCcpLFxyXG4gICAgQnVmZmVyLmZyb20oc3RhZmYucGFzc3dvcmRIYXNoLCAndXRmOCcpXHJcbiAgKTtcclxuXHJcbiAgaWYgKCFpc01hdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgc3RhdHVzQ29kZTogNDAxLFxyXG4gICAgICBlcnJvcjogJ1VuYWJsZSB0byBzaWduIGluLiBDaGVjayB5b3VyIGRldGFpbHMgYW5kIHRyeSBhZ2Fpbi4nXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gSXNzdWUgc2Vzc2lvbiB0b2tlblxyXG4gIGNvbnN0IHRva2VuID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XHJcbiAgY29uc3QgZXhwaXJlc0F0ID0gRGF0ZS5ub3coKSArIDI0ICogNjAgKiA2MCAqIDEwMDA7IC8vIDI0IGhvdXJzXHJcblxyXG4gIGNvbnN0IHNlc3Npb25Vc2VyID0ge1xyXG4gICAgaWQ6IHN0YWZmLmlkLFxyXG4gICAgdXNlcm5hbWU6IHN0YWZmLnVzZXJuYW1lLFxyXG4gICAgbmFtZTogc3RhZmYubmFtZSxcclxuICAgIHJvbGU6IHN0YWZmLnJvbGUsXHJcbiAgICBlbWFpbDogc3RhZmYuZW1haWxcclxuICB9O1xyXG5cclxuICBhY3RpdmVTZXNzaW9ucy5zZXQodG9rZW4sIHtcclxuICAgIHVzZXI6IHNlc3Npb25Vc2VyLFxyXG4gICAgZXhwaXJlc0F0XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgdG9rZW4sXHJcbiAgICBleHBpcmVzQXQsXHJcbiAgICB1c2VyOiBzZXNzaW9uVXNlclxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWZXJpZnkgYW4gYWN0aXZlIHNlc3Npb24gdG9rZW5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlTZXNzaW9uKHRva2VuKSB7XHJcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGFjdGl2ZVNlc3Npb25zLmdldCh0b2tlbik7XHJcbiAgaWYgKCFzZXNzaW9uKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKERhdGUubm93KCkgPiBzZXNzaW9uLmV4cGlyZXNBdCkge1xyXG4gICAgYWN0aXZlU2Vzc2lvbnMuZGVsZXRlKHRva2VuKTtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNlc3Npb24udXNlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlc3Ryb3kgc2Vzc2lvbiAobG9nb3V0KVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGludmFsaWRhdGVTZXNzaW9uKHRva2VuKSB7XHJcbiAgaWYgKHRva2VuKSB7XHJcbiAgICBhY3RpdmVTZXNzaW9ucy5kZWxldGUodG9rZW4pO1xyXG4gIH1cclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgYSByZXR1cm4gVVJMIHRvIHByZXZlbnQgb3BlbiByZWRpcmVjdCB2dWxuZXJhYmlsaXRpZXNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVNhZmVSZXR1cm5VcmwocmV0dXJuVXJsKSB7XHJcbiAgaWYgKCFyZXR1cm5VcmwgfHwgdHlwZW9mIHJldHVyblVybCAhPT0gJ3N0cmluZycpIHJldHVybiAnL2FkbWluJztcclxuICBjb25zdCBjbGVhbiA9IHJldHVyblVybC50cmltKCk7XHJcblxyXG4gIC8vIE11c3Qgc3RhcnQgd2l0aCAvYWRtaW4gYW5kIG11c3Qgbm90IGNvbnRhaW4gcHJvdG9jb2wgc2NoZW1lcyBvciBiYWNrc2xhc2hlc1xyXG4gIGlmIChcclxuICAgIGNsZWFuLnN0YXJ0c1dpdGgoJy9hZG1pbicpICYmXHJcbiAgICAhY2xlYW4uc3RhcnRzV2l0aCgnLy8nKSAmJlxyXG4gICAgIWNsZWFuLmluY2x1ZGVzKCdcXFxcJykgJiZcclxuICAgICFjbGVhbi5pbmNsdWRlcygnOicpXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gY2xlYW47XHJc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
