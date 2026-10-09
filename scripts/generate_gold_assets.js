import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../public/images/products/gold');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Subtle backgrounds rotation
const BACKGROUNDS = [
  // 0: Warm Ivory Marble
  {
    id: 'bg-ivory',
    svg: `
      <rect width="800" height="800" fill="url(#bgGradIvory)"/>
      <circle cx="400" cy="400" r="320" fill="url(#softSpotLight)" opacity="0.6"/>
      <ellipse cx="400" cy="460" rx="220" ry="110" fill="url(#softPedestalShadow)" opacity="0.35"/>
    `,
    defs: `
      <radialGradient id="bgGradIvory" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#FCF9F2"/>
        <stop offset="60%" stop-color="#F3ECE0"/>
        <stop offset="100%" stop-color="#E5D9C7"/>
      </radialGradient>
      <radialGradient id="softSpotLight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#FAF4E8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="softPedestalShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#6E5848" stop-opacity="0.4"/>
        <stop offset="60%" stop-color="#B39E8C" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#FAF4E8" stop-opacity="0"/>
      </radialGradient>
    `
  },
  // 1: Pale Beige Suede
  {
    id: 'bg-beige',
    svg: `
      <rect width="800" height="800" fill="url(#bgGradBeige)"/>
      <circle cx="400" cy="380" r="340" fill="url(#softSpotBeige)" opacity="0.7"/>
      <ellipse cx="400" cy="480" rx="240" ry="100" fill="url(#softPedestalShadowBeige)" opacity="0.38"/>
    `,
    defs: `
      <radialGradient id="bgGradBeige" cx="45%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#FAF4E8"/>
        <stop offset="55%" stop-color="#EFE3CF"/>
        <stop offset="100%" stop-color="#DCCBB4"/>
      </radialGradient>
      <radialGradient id="softSpotBeige" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#EFE3CF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="softPedestalShadowBeige" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#544335" stop-opacity="0.45"/>
        <stop offset="65%" stop-color="#A89481" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#EFE3CF" stop-opacity="0"/>
      </radialGradient>
    `
  },
  // 2: Subtle Maroon Fabric
  {
    id: 'bg-maroon',
    svg: `
      <rect width="800" height="800" fill="url(#bgGradMaroon)"/>
      <circle cx="400" cy="380" r="320" fill="url(#softSpotMaroon)" opacity="0.5"/>
      <ellipse cx="400" cy="480" rx="250" ry="110" fill="url(#softPedestalShadowMaroon)" opacity="0.55"/>
    `,
    defs: `
      <radialGradient id="bgGradMaroon" cx="48%" cy="40%" r="68%">
        <stop offset="0%" stop-color="#42131A"/>
        <stop offset="60%" stop-color="#2B0C11"/>
        <stop offset="100%" stop-color="#190609"/>
      </radialGradient>
      <radialGradient id="softSpotMaroon" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7A2835" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#2B0C11" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="softPedestalShadowMaroon" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#080203" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#2B0C11" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#2B0C11" stop-opacity="0"/>
      </radialGradient>
    `
  },
  // 3: Dark Neutral Stone / Slate
  {
    id: 'bg-stone',
    svg: `
      <rect width="800" height="800" fill="url(#bgGradStone)"/>
      <circle cx="400" cy="380" r="330" fill="url(#softSpotStone)" opacity="0.55"/>
      <ellipse cx="400" cy="480" rx="230" ry="105" fill="url(#softPedestalShadowStone)" opacity="0.6"/>
    `,
    defs: `
      <radialGradient id="bgGradStone" cx="46%" cy="38%" r="68%">
        <stop offset="0%" stop-color="#2D3238"/>
        <stop offset="55%" stop-color="#1E2328"/>
        <stop offset="100%" stop-color="#121518"/>
      </radialGradient>
      <radialGradient id="softSpotStone" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#4D5660" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#1E2328" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="softPedestalShadowStone" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#07090A" stop-opacity="0.85"/>
        <stop offset="70%" stop-color="#1E2328" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#1E2328" stop-opacity="0"/>
      </radialGradient>
    `
  },
  // 4: Warm Champagne Linen
  {
    id: 'bg-champagne',
    svg: `
      <rect width="800" height="800" fill="url(#bgGradChampagne)"/>
      <circle cx="400" cy="390" r="330" fill="url(#softSpotChampagne)" opacity="0.75"/>
      <ellipse cx="400" cy="475" rx="235" ry="100" fill="url(#softPedestalShadowChampagne)" opacity="0.4"/>
    `,
    defs: `
      <radialGradient id="bgGradChampagne" cx="45%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#FAF6ED"/>
        <stop offset="55%" stop-color="#EDE2CF"/>
        <stop offset="100%" stop-color="#D9C7AC"/>
      </radialGradient>
      <radialGradient id="softSpotChampagne" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFDF7" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#EDE2CF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="softPedestalShadowChampagne" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#5C4A38" stop-opacity="0.45"/>
        <stop offset="65%" stop-color="#A8947C" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#EDE2CF" stop-opacity="0"/>
      </radialGradient>
    `
  }
];

// Common Rich Gold, Gemstone, Pearl and Lighting Gradients
const COMMON_DEFS = `
  <defs>
    <!-- Filter: Studio Drop Shadow -->
    <filter id="studioShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#1A120B" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1A120B" flood-opacity="0.22" />
    </filter>

    <filter id="intenseShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#0F0A06" flood-opacity="0.45" />
    </filter>

    <!-- 22K Vibrant Yellow Gold Gradient -->
    <linearGradient id="gold22k" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3C4" />
      <stop offset="25%" stop-color="#F5CE62" />
      <stop offset="50%" stop-color="#E2A629" />
      <stop offset="75%" stop-color="#BC8012" />
      <stop offset="100%" stop-color="#8C5B05" />
    </linearGradient>

    <!-- Polished Highlight Gold Gradient -->
    <linearGradient id="goldHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="30%" stop-color="#FFEBB0" />
      <stop offset="60%" stop-color="#E8B946" />
      <stop offset="90%" stop-color="#B27B13" />
      <stop offset="100%" stop-color="#704702" />
    </linearGradient>

    <!-- Antique Chettinad Deep Warm Gold -->
    <linearGradient id="goldAntique" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBE6AB" />
      <stop offset="30%" stop-color="#D9A336" />
      <stop offset="70%" stop-color="#9E6911" />
      <stop offset="100%" stop-color="#5C3B04" />
    </linearGradient>

    <!-- Radial Gold Sphere / Bead -->
    <radialGradient id="goldSphere" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="40%" stop-color="#F2C54B" />
      <stop offset="80%" stop-color="#B57A0F" />
      <stop offset="100%" stop-color="#613D02" />
    </radialGradient>

    <!-- Kemp Ruby Red Gemstone -->
    <radialGradient id="gemRuby" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FF7B90" />
      <stop offset="35%" stop-color="#E01438" />
      <stop offset="75%" stop-color="#96051E" />
      <stop offset="100%" stop-color="#45000B" />
    </radialGradient>

    <!-- Emerald Green Gemstone -->
    <radialGradient id="gemEmerald" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#78F0A4" />
      <stop offset="35%" stop-color="#12B350" />
      <stop offset="75%" stop-color="#086B2D" />
      <stop offset="100%" stop-color="#023012" />
    </radialGradient>

    <!-- Natural South Sea Pearl -->
    <radialGradient id="pearl" cx="32%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FAF5EE" />
      <stop offset="60%" stop-color="#EAE0D0" />
      <stop offset="85%" stop-color="#CFC2AF" />
      <stop offset="100%" stop-color="#9E907E" />
    </radialGradient>

    <!-- Clear Diamond / CZ Facet -->
    <radialGradient id="diamond" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#E6F2FF" />
      <stop offset="80%" stop-color="#B8D5F2" />
      <stop offset="100%" stop-color="#6F99C4" />
    </radialGradient>
  </defs>
`;

// Build full SVG
function wrapSvg(bgIndex, defsContent, innerSvg) {
  const bg = BACKGROUNDS[bgIndex % BACKGROUNDS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  ${bg.defs}
  ${COMMON_DEFS}
  ${defsContent || ''}
  ${bg.svg}
  <g filter="url(#studioShadow)">
    ${innerSvg}
  </g>
</svg>`;
}

// 90 distinct product SVG generators
const generators = [];

// ==========================================
// 1. EARRINGS — STUDS (1 - 5)
// ==========================================

// 1. Floral Gold Stud with Ruby Red Centre
generators.push({
  num: 1, subCat: 'studs', file: 'gold_studs_1.svg',
  title: 'Delicate Floral Ruby Gold Studs',
  desc: 'A delicate floral gold stud with a small ruby-red centre and fine petal detailing.',
  svg: wrapSvg(0, '', `
    <g transform="translate(400, 400)">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
        <path d="M0,0 C-22,-60 0,-140 0,-140 C0,-140 22,-60 0,0" fill="url(#gold22k)" stroke="#B57A0F" stroke-width="2" transform="rotate(${deg})" />
        <path d="M0,-30 L0,-115" stroke="#FFF3C4" stroke-width="2" stroke-linecap="round" transform="rotate(${deg})" />
        <circle cx="0" cy="-140" r="7" fill="url(#goldSphere)" transform="rotate(${deg})"/>
      `).join('')}
      ${[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(deg => `
        <path d="M0,0 C-14,-35 0,-85 0,-85 C0,-85 14,-35 0,0" fill="url(#goldAntique)" stroke="#8C5B05" stroke-width="1.5" transform="rotate(${deg})" />
      `).join('')}
      <circle cx="0" cy="0" r="54" fill="url(#gold22k)" stroke="#8C5B05" stroke-width="3"/>
      ${Array.from({length: 16}).map((_, i) => `
        <circle cx="${46 * Math.cos(i * 2 * Math.PI / 16)}" cy="${46 * Math.sin(i * 2 * Math.PI / 16)}" r="5" fill="url(#goldSphere)"/>
      `).join('')}
      <circle cx="0" cy="0" r="34" fill="#6B0817" stroke="url(#goldHighlight)" stroke-width="3.5"/>
      <circle cx="0" cy="0" r="30" fill="url(#gemRuby)"/>
      <ellipse cx="-8" cy="-10" rx="10" ry="6" fill="#FFFFFF" opacity="0.6" transform="rotate(-30, -8, -10)"/>
    </g>
  `)
});

// 2. Peacock-inspired gold stud with tiny green accents
generators.push({
  num: 2, subCat: 'studs', file: 'gold_studs_2.svg',
  title: 'Peacock Motif Emerald Gold Studs',
  desc: 'A compact peacock-inspired gold stud with tiny green accents and engraved feather details.',
  svg: wrapSvg(1, '', `
    <g transform="translate(400, 390)">
      ${[-60, -40, -20, 0, 20, 40, 60].map((deg) => `
        <g transform="rotate(${deg}) translate(0, -90)">
          <path d="M0,60 C-20,30 -25,-20 0,-45 C25,-20 20,30 0,60" fill="url(#gold22k)" stroke="#8C5B05" stroke-width="2"/>
          <path d="M-15,-10 C-5,-20 0,-30 0,-40 C0,-30 5,-20 15,-10" stroke="#FFF3C4" stroke-width="1.5" fill="none"/>
          <circle cx="0" cy="-10" r="10" fill="url(#gemEmerald)"/>
          <circle cx="0" cy="-45" r="5" fill="url(#goldSphere)"/>
        </g>
      `).join('')}
      <path d="M-30,40 C-45,0 -20,-40 5,-50 C25,-40 30,-10 20,20 C10,50 -10,60 -30,40 Z" fill="url(#goldAntique)" stroke="#6B3F02" stroke-width="3"/>
      <circle cx="5" cy="-55" r="16" fill="url(#goldHighlight)"/>
      <path d="M12,-65 L22,-75 M5,-68 L5,-80 M-2,-65 L-12,-75" stroke="url(#goldHighlight)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="-75" r="3.5" fill="url(#gemEmerald)"/>
      <circle cx="5" cy="-80" r="3.5" fill="url(#gemEmerald)"/>
      <circle cx="-12" cy="-75" r="3.5" fill="url(#gemEmerald)"/>
      <polygon points="18,-55 32,-52 18,-48" fill="url(#gold22k)"/>
      <circle cx="10" cy="-57" r="2.5" fill="#1A120B"/>
      <path d="M-15,10 C-5,-10 10,-5 15,20 C5,35 -10,30 -15,10 Z" fill="url(#gold22k)" stroke="#B57A0F" stroke-width="2"/>
      <circle cx="0" cy="12" r="6" fill="url(#gemRuby)"/>
    </g>
  `)
});

// 3. Traditional Temple Lakshmi-inspired Stud
generators.push({
  num: 3, subCat: 'studs', file: 'gold_studs_3.svg',
  title: 'Temple Lakshmi Beaded Gold Studs',
  desc: 'A small traditional temple-style stud featuring a Lakshmi-inspired motif and beaded border.',
  svg: wrapSvg(2, '', `
    <g transform="translate(400, 400)">
      <circle cx="0" cy="0" r="145" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3"/>
      <circle cx="0" cy="0" r="132" fill="url(#gold22k)"/>
      ${Array.from({length: 24}).map((_, i) => `
        <circle cx="${138 * Math.cos(i * 2 * Math.PI / 24)}" cy="${138 * Math.sin(i * 2 * Math.PI / 24)}" r="6" fill="url(#goldSphere)"/>
      `).join('')}
      <circle cx="0" cy="0" r="115" fill="#3D1217" stroke="url(#goldHighlight)" stroke-width="3"/>
      <path d="M-70,50 C-40,80 40,80 70,50 C50,40 -50,40 -70,50 Z" fill="url(#goldHighlight)" stroke="#8C5B05" stroke-width="2"/>
      ${[-40, -20, 0, 20, 40].map(x => `
        <path d="M${x},55 C${x-10},35 ${x+10},35 ${x},55" fill="url(#gemRuby)"/>
      `).join('')}
      <path d="M-55,20 C-55,-60 55,-60 55,20" fill="none" stroke="url(#goldHighlight)" stroke-width="8" stroke-linecap="round"/>
      <polygon points="0,-72 -18,-35 18,-35" fill="url(#goldHighlight)" stroke="#8C5B05" stroke-width="2"/>
      <circle cx="0" cy="-74" r="4" fill="url(#gemRuby)"/>
      <circle cx="0" cy="-22" r="14" fill="url(#goldSphere)"/>
      <path d="M-22,25 C-22,-5 22,-5 22,25 Z" fill="url(#gold22k)" stroke="#8C5B05" stroke-width="2"/>
      <path d="M-22,0 C-40,-15 -45,-30 -35,-40" stroke="url(#goldHighlight)" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="-35" cy="-40" r="8" fill="url(#gemRuby)"/>
      <path d="M22,0 C40,-15 45,-30 35,-40" stroke="url(#goldHighlight)" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="35" cy="-40" r="8" fill="url(#gemRuby)"/>
    </g>
  `)
});

// 4. Modern Geometric Gold Stud
generators.push({
  num: 4, subCat: 'studs', file: 'gold_studs_4.svg',
  title: 'Modern Geometric Polished Gold Studs',
  desc: 'A modern geometric gold stud with clean lines and a polished finish.',
  svg: wrapSvg(3, '', `
    <g transform="translate(400, 400)">
      <polygon points="0,-140 121,-70 121,70 0,140 -121,70 -121,-70" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3"/>
      <polygon points="0,-125 108,-62 108,62 0,125 -108,62 -108,-62" fill="url(#gold22k)"/>
      <polygon points="0,-125 108,-62 0,0" fill="url(#goldHighlight)"/>
      <polygon points="108,-62 108,62 0,0" fill="url(#goldAntique)"/>
      <polygon points="108,62 0,125 0,0" fill="url(#gold22k)"/>
      <polygon points="0,125 -108,62 0,0" fill="url(#goldHighlight)"/>
      <polygon points="-108,62 -108,-62 0,0" fill="url(#goldAntique)"/>
      <polygon points="-108,-62 0,-125 0,0" fill="url(#gold22k)"/>
      <polygon points="0,-60 52,0 0,60 -52,0" fill="url(#goldHighlight)" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="0" cy="0" r="14" fill="url(#diamond)"/>
    </g>
  `)
});

// 5. Round Gold Stud with Pearl Centre and Decorative Halo
generators.push({
  num: 5, subCat: 'studs', file: 'gold_studs_5.svg',
  title: 'Lustrous Pearl Halo Gold Studs',
  desc: 'A round gold stud with a pearl-like centre and a finely detailed decorative halo.',
  svg: wrapSvg(4, '', `
    <g transform="translate(400, 400)">
      ${Array.from({length: 32}).map((_, i) => `
        <line x1="${115 * Math.cos(i * 2 * Math.PI / 32)}" y1="${115 * Math.sin(i * 2 * Math.PI / 32)}" 
              x2="${145 * Math.cos(i * 2 * Math.PI / 32)}" y2="${145 * Math.sin(i * 2 * Math.PI / 32)}" 
              stroke="url(#goldHighlight)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${145 * Math.cos(i * 2 * Math.PI / 32)}" cy="${145 * Math.sin(i * 2 * Math.PI / 32)}" r="4.5" fill="url(#goldSphere)"/>
      `).join('')}
      <circle cx="0" cy="0" r="115" fill="url(#gold22k)" stroke="#8C5B05" stroke-width="3"/>
      ${Array.from({length: 16}).map((_, i) => `
        <circle cx="${100 * Math.cos(i * 2 * Math.PI / 16)}" cy="${100 * Math.sin(i * 2 * Math.PI / 16)}" r="9" fill="url(#goldAntique)" stroke="url(#goldHighlight)" stroke-width="1.5"/>
        <circle cx="${100 * Math.cos(i * 2 * Math.PI / 16)}" cy="${100 * Math.sin(i * 2 * Math.PI / 16)}" r="4" fill="url(#gemRuby)"/>
      `).join('')}
      <circle cx="0" cy="0" r="76" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
      <circle cx="0" cy="0" r="54" fill="url(#pearl)"/>
      <ellipse cx="-18" cy="-18" rx="16" ry="10" fill="#FFFFFF" opacity="0.85" transform="rotate(-35, -18, -18)"/>
      <circle cx="-12" cy="-24" r="5" fill="#FFFFFF"/>
    </g>
  `)
});

// 6 to 10: Hangings
generators.push({
  num: 6, subCat: 'hangings', file: 'gold_hangings_6.svg',
  title: 'Long Floral Filigree Gold Hangings',
  desc: 'Long floral gold hanging earrings with delicate engraved petals and small bead drops.',
  svg: wrapSvg(0, '', `
    <g transform="translate(400, 180)">
      <circle cx="0" cy="0" r="28" fill="url(#gold22k)" stroke="#8C5B05" stroke-width="2"/>
      <circle cx="0" cy="0" r="12" fill="url(#gemRuby)"/>
      <line x1="0" y1="28" x2="0" y2="70" stroke="url(#goldHighlight)" stroke-width="4"/>
      <g transform="translate(0, 110)">
        ${[0, 60, 120, 180, 240, 300].map(deg => `
          <path d="M0,0 C-10,-25 0,-40 0,-40 C0,-40 10,-25 0,0" fill="url(#goldHighlight)" stroke="#8C5B05" stroke-width="1.5" transform="rotate(${deg})" />
        `).join('')}
        <circle cx="0" cy="0" r="6" fill="url(#gemRuby)"/>
      </g>
      <g transform="translate(0, 260)">
        <path d="M0,-80 C-90,-20 -110,60 0,140 C110,60 90,-20 0,-80 Z" fill="url(#gold22k)" stroke="#6B3F02" stroke-width="3"/>
        <circle cx="0" cy="20" r="28" fill="url(#goldHighlight)" stroke="#8C5B05" stroke-width="2"/>
        <circle cx="0" cy="20" r="14" fill="url(#gemRuby)"/>
        ${[-80, -50, -25, 0, 25, 50, 80].map((x, i) => `
          <line x1="${x}" y1="${80 - Math.abs(x)*0.3}" x2="${x}" y2="${130 + (i%2)*15}" stroke="url(#goldHighlight)" stroke-width="2.5"/>
          <circle cx="${x}" cy="${130 + (i%2)*15}" r="7" fill="url(#goldSphere)"/>
        `).join('')}
      </g>
    </g>
  `)
});

generators.push({
  num: 7, subCat: 'hangings', file: 'gold_hangings_7.svg',
  title: 'Sacred Temple Sculpted Gold Hangings',
  desc: 'Traditional temple-motif hanging earrings with a sculpted central ornament.',
  svg: wrapSvg(1, '', `
    <g transform="translate(400, 190)">
      <path d="M-25,10 L0,-35 L25,10 Z" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
      <circle cx="0" cy="-38" r="6" fill="url(#gemRuby)"/>
      <circle cx="0" cy="0" r="14" fill="url(#goldSphere)"/>
      <line x1="0" y1="12" x2="0" y2="60" stroke="url(#goldHighlight)" stroke-width="4"/>
      <g transform="translate(0, 200)">
        <path d="M-100,-80 C-100,-140 100,-140 100,-80 L100,60 C80,90 -80,90 -100,60 Z" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3.5"/>
        <path d="M-80,-70 C-80,-120 80,-120 80,-70 L80,50 C60,70 -60,70 -80,50 Z" fill="#3D1217"/>
        <circle cx="0" cy="-45" r="16" fill="url(#goldSphere)"/>
        <circle cx="0" cy="0" r="8" fill="url(#gemRuby)"/>
        ${[-90, -60, -30, 0, 30, 60, 90].map((x, i) => `
          <line x1="${x}" y1="75" x2="${x}" y2="${125 + (i===3?20:0)}" stroke="url(#goldHighlight)" stroke-width="2.5"/>
          <circle cx="${x}" cy="${125 + (i===3?20:0)}" r="8" fill="url(#pearl)"/>
        `).join('')}
      </g>
    </g>
  `)
});

generators.push({
  num: 8, subCat: 'hangings', file: 'gold_hangings_8.svg',
  title: 'Kemp Ruby & Emerald Gold Hangings',
  desc: 'Elegant gold hangings with a red-and-green stone-inspired floral arrangement.',
  svg: wrapSvg(2, '', `
    <g transform="translate(400, 180)">
      <circle cx="0" cy="0" r="30" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
      <circle cx="0" cy="0" r="14" fill="url(#gemEmerald)"/>
      ${[0, 60, 120, 180, 240, 300].map(deg => `
        <circle cx="${24 * Math.cos(deg*Math.PI/180)}" cy="${24 * Math.sin(deg*Math.PI/180)}" r="6" fill="url(#gemRuby)"/>
      `).join('')}
      <g transform="translate(0, 260)">
        <circle cx="0" cy="0" r="90" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="3"/>
        <circle cx="0" cy="0" r="22" fill="url(#gemRuby)"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
          <g transform="rotate(${deg}) translate(0, -65)">
            <ellipse cx="0" cy="0" rx="10" ry="16" fill="url(#gemEmerald)"/>
          </g>
        `).join('')}
        ${[-60, -30, 0, 30, 60].map((x, i) => `
          <line x1="${x}" y1="90" x2="${x}" y2="${140 + (i===2?20:0)}" stroke="url(#goldHighlight)" stroke-width="2.5"/>
          <circle cx="${x}" cy="${140 + (i===2?20:0)}" r="7.5" fill="url(#goldSphere)"/>
        `).join('')}
      </g>
    </g>
  `)
});

generators.push({
  num: 9, subCat: 'hangings', file: 'gold_hangings_9.svg',
  title: 'Articulated Leaf Gold Hangings',
  desc: 'Slim leaf-pattern gold hangings with articulated details and tiny dangling beads.',
  svg: wrapSvg(3, '', `
    <g transform="translate(400, 160)">
      ${[0, 1, 2, 3, 4].map(idx => `
        <g transform="translate(0, ${idx * 85}) scale(${1 - idx * 0.1})">
          <path d="M0,0 C-35,-15 -50,30 0,65 C-10,30 -15,10 0,0" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
          <path d="M0,0 C35,-15 50,30 0,65 C10,30 15,10 0,0" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
          <circle cx="0" cy="0" r="8" fill="url(#goldSphere)"/>
          <circle cx="0" cy="0" r="3.5" fill="url(#gemRuby)"/>
        </g>
      `).join('')}
    </g>
  `)
});

generators.push({
  num: 10, subCat: 'hangings', file: 'gold_hangings_10.svg',
  title: 'Chettinad Layered Filigree Gold Hangings',
  desc: 'A pair of ornate South Indian gold hanging earrings with a layered filigree silhouette.',
  svg: wrapSvg(4, '', `
    <g transform="translate(400, 170)">
      <circle cx="0" cy="0" r="32" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
      <circle cx="0" cy="0" r="14" fill="url(#gemRuby)"/>
      <g transform="translate(0, 240)">
        <path d="M0,-80 C-110,-30 -120,60 0,150 C120,60 110,-30 0,-80 Z" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3"/>
        <circle cx="0" cy="15" r="22" fill="url(#gemRuby)"/>
        ${[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((x, i) => `
          <line x1="${x}" y1="${80 - Math.abs(x)*0.3}" x2="${x}" y2="${140 + (i===4?25:0)}" stroke="url(#goldHighlight)" stroke-width="2"/>
          <circle cx="${x}" cy="${140 + (i===4?25:0)}" r="7.5" fill="url(#pearl)"/>
        `).join('')}
      </g>
    </g>
  `)
});

// Drops (11 - 15)
generators.push({
  num: 11, subCat: 'drops', file: 'gold_drops_11.svg',
  title: 'Teardrop Kemp Ruby Gold Drops',
  desc: 'Teardrop-shaped gold drop earrings with a ruby-red centre and fine beaded edges.',
  svg: wrapSvg(0, '', `
    <g transform="translate(400, 230)">
      <circle cx="0" cy="0" r="24" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
      <circle cx="0" cy="0" r="10" fill="url(#gemRuby)"/>
      <g transform="translate(0, 190)">
        <path d="M0,-120 C-90,-20 -90,70 0,130 C90,70 90,-20 0,-120 Z" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="3"/>
        <path d="M0,-80 C-55,-10 -55,50 0,90 C55,50 55,-10 0,-80 Z" fill="url(#gemRuby)"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 12, subCat: 'drops', file: 'gold_drops_12.svg',
  title: 'Curved Frame Pearl Gold Drops',
  desc: 'Pearl-accent gold drop earrings with an elegant curved frame.',
  svg: wrapSvg(1, '', `
    <g transform="translate(400, 220)">
      <path d="M0,20 C-60,80 -80,180 0,260 C80,180 60,80 0,20" fill="none" stroke="url(#gold22k)" stroke-width="12" stroke-linecap="round"/>
      <circle cx="0" cy="150" r="42" fill="url(#pearl)"/>
    </g>
  `)
});

generators.push({
  num: 13, subCat: 'drops', file: 'gold_drops_13.svg',
  title: 'Floral Top Engraved Leaf Gold Drops',
  desc: 'A small floral gold top with a single engraved leaf-shaped drop.',
  svg: wrapSvg(2, '', `
    <g transform="translate(400, 240)">
      <circle cx="0" cy="0" r="20" fill="url(#gemRuby)"/>
      <g transform="translate(0, 190)">
        <path d="M0,-120 C-95,-20 -80,80 0,160 C80,80 95,-20 0,-120 Z" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="3"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 14, subCat: 'drops', file: 'gold_drops_14.svg',
  title: 'Two-Tier Geometric Gold Drops',
  desc: 'Two-tier gold drop earrings with a delicate geometric design.',
  svg: wrapSvg(3, '', `
    <g transform="translate(400, 220)">
      <polygon points="0,-40 45,0 0,40 -45,0" fill="url(#gold22k)"/>
      <g transform="translate(0, 190)">
        <polygon points="0,-95 85,-20 85,60 0,135 -85,60 -85,-20" fill="url(#goldAntique)"/>
        <circle cx="0" cy="20" r="16" fill="url(#diamond)"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 15, subCat: 'drops', file: 'gold_drops_15.svg',
  title: 'Emerald Centre Bell Gold Drops',
  desc: 'Gold drop earrings featuring a green stone-inspired centre and a tiny bell-shaped pendant.',
  svg: wrapSvg(4, '', `
    <g transform="translate(400, 220)">
      <circle cx="0" cy="110" r="32" fill="url(#gemEmerald)"/>
      <g transform="translate(0, 260)">
        <path d="M-40,40 C-40,-10 40,-10 40,40 Z" fill="url(#gold22k)"/>
      </g>
    </g>
  `)
});

// Jhumkas (16 - 20)
generators.push({
  num: 16, subCat: 'jhumkas', file: 'gold_jhumkas_16.svg',
  title: 'Classic South Indian Granulation Jhumkas',
  desc: 'Classic dome-shaped South Indian gold jhumkas with fine granulation and small bead fringe.',
  svg: wrapSvg(0, '', `
    <g transform="translate(400, 200)">
      <circle cx="0" cy="0" r="38" fill="url(#gold22k)"/>
      <g transform="translate(0, 180)">
        <path d="M-110,80 C-110,-50 110,-50 110,80 Z" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3.5"/>
        <ellipse cx="0" cy="80" rx="110" ry="24" fill="url(#goldHighlight)"/>
        ${Array.from({length: 13}).map((_, i) => `<circle cx="${-95 + i*15.8}" cy="115" r="6.5" fill="url(#goldSphere)"/>`).join('')}
      </g>
    </g>
  `)
});

generators.push({
  num: 17, subCat: 'jhumkas', file: 'gold_jhumkas_17.svg',
  title: 'Temple Deity Antique Gold Jhumkas',
  desc: 'Temple-style gold jhumkas with a sculpted deity-inspired motif on the dome.',
  svg: wrapSvg(1, '', `
    <g transform="translate(400, 190)">
      <circle cx="0" cy="0" r="35" fill="url(#gold22k)"/>
      <g transform="translate(0, 190)">
        <path d="M-115,80 C-115,-60 115,-60 115,80 Z" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3.5"/>
        <circle cx="0" cy="15" r="42" fill="#3D1217"/>
        <ellipse cx="0" cy="80" rx="115" ry="24" fill="url(#goldHighlight)"/>
        ${Array.from({length: 11}).map((_, i) => `<circle cx="${-85 + i*17}" cy="120" r="7.5" fill="url(#pearl)"/>`).join('')}
      </g>
    </g>
  `)
});

generators.push({
  num: 18, subCat: 'jhumkas', file: 'gold_jhumkas_18.svg',
  title: 'Navaratna Tone Kemp Floral Jhumkas',
  desc: 'Floral gold jhumkas with red- and green-coloured stone-inspired details.',
  svg: wrapSvg(2, '', `
    <g transform="translate(400, 190)">
      <circle cx="0" cy="0" r="36" fill="url(#gold22k)"/>
      <g transform="translate(0, 180)">
        <path d="M-110,80 C-110,-50 110,-50 110,80 Z" fill="url(#goldAntique)"/>
        ${[-70, -35, 0, 35, 70].map((x, idx) => `<circle cx="${x}" cy="30" r="7" fill="${idx%2===0?'url(#gemRuby)':'url(#gemEmerald)'}"/>`).join('')}
        <ellipse cx="0" cy="80" rx="110" ry="24" fill="url(#goldHighlight)"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 19, subCat: 'jhumkas', file: 'gold_jhumkas_19.svg',
  title: 'Mayil Peacock Engraved Gold Jhumkas',
  desc: 'Peacock-inspired gold jhumkas with engraved feather patterns and a delicate fringe.',
  svg: wrapSvg(3, '', `
    <g transform="translate(400, 180)">
      <circle cx="0" cy="-5" r="14" fill="url(#gemEmerald)"/>
      <g transform="translate(0, 190)">
        <path d="M-110,80 C-110,-50 110,-50 110,80 Z" fill="url(#gold22k)"/>
        <ellipse cx="0" cy="80" rx="110" ry="24" fill="url(#goldAntique)"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 20, subCat: 'jhumkas', file: 'gold_jhumkas_20.svg',
  title: 'Petite Filigree Bell Gold Jhumkas',
  desc: 'Petite gold jhumkas with layered filigree and tiny dangling beads.',
  svg: wrapSvg(4, '', `
    <g transform="translate(400, 210)">
      <circle cx="0" cy="0" r="26" fill="url(#goldHighlight)"/>
      <g transform="translate(0, 160)">
        <path d="M-80,60 C-80,-30 80,-30 80,60 Z" fill="url(#gold22k)"/>
        <ellipse cx="0" cy="60" rx="80" ry="18" fill="url(#goldHighlight)"/>
      </g>
    </g>
  `)
});

// Hoops & Bali (21 - 25)
generators.push({
  num: 21, subCat: 'hoops-bali', file: 'gold_hoops_21.svg',
  title: 'Classic Polished Rounded Gold Balis',
  desc: 'A pair of classic rounded gold bali hoops with a smooth polished surface.',
  svg: wrapSvg(0, '', `
    <g transform="translate(400, 380)">
      <circle cx="0" cy="0" r="160" fill="none" stroke="url(#gold22k)" stroke-width="38" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="url(#goldHighlight)" stroke-width="8" stroke-dasharray="250, 400"/>
    </g>
  `)
});

generators.push({
  num: 22, subCat: 'hoops-bali', file: 'gold_hoops_22.svg',
  title: 'Traditional Floral Engraved Gold Balis',
  desc: 'Engraved gold hoops with fine traditional floral patterns.',
  svg: wrapSvg(1, '', `
    <g transform="translate(400, 380)">
      <circle cx="0" cy="0" r="160" fill="none" stroke="url(#gold22k)" stroke-width="38"/>
      ${Array.from({length: 14}).map((_, i) => `<circle cx="${160*Math.sin(i*2*Math.PI/14)}" cy="${160*Math.cos(i*2*Math.PI/14)}" r="4" fill="url(#gemRuby)"/>`).join('')}
    </g>
  `)
});

generators.push({
  num: 23, subCat: 'hoops-bali', file: 'gold_hoops_23.svg',
  title: 'Twisted Rope Beaded Gold Hoops',
  desc: 'Twisted-rope gold hoops with a delicate beaded edge.',
  svg: wrapSvg(2, '', `
    <g transform="translate(400, 380)">
      <circle cx="0" cy="0" r="150" fill="none" stroke="url(#gold22k)" stroke-width="32"/>
      ${Array.from({length: 36}).map((_, i) => `<circle cx="${175*Math.sin(i*2*Math.PI/36)}" cy="${175*Math.cos(i*2*Math.PI/36)}" r="4.5" fill="url(#goldSphere)"/>`).join('')}
    </g>
  `)
});

generators.push({
  num: 24, subCat: 'hoops-bali', file: 'gold_hoops_24.svg',
  title: 'Floral Crest Front Gold Bali Hoops',
  desc: 'Floral-front gold bali hoops with small decorative accents.',
  svg: wrapSvg(3, '', `
    <g transform="translate(400, 380)">
      <circle cx="0" cy="0" r="155" fill="none" stroke="url(#gold22k)" stroke-width="28"/>
      <g transform="translate(0, 155)">
        <circle cx="0" cy="0" r="36" fill="url(#goldAntique)"/>
        <circle cx="0" cy="0" r="16" fill="url(#gemRuby)"/>
      </g>
    </g>
  `)
});

generators.push({
  num: 25, subCat: 'hoops-bali', file: 'gold_hoops_25.svg',
  title: 'Hinged Sculpted Temple Gold Hoops',
  desc: 'Medium-sized hinged gold hoops with a sculpted traditional pattern.',
  svg: wrapSvg(4, '', `
    <g transform="translate(400, 380)">
      <circle cx="0" cy="0" r="145" fill="none" stroke="url(#goldAntique)" stroke-width="40"/>
      <circle cx="0" cy="0" r="145" fill="none" stroke="url(#gold22k)" stroke-width="32"/>
    </g>
  `)
});

// Concepts 26 to 90
const REMAINING_SPECS = [
  // Rings — Engagement (26 - 30)
  { num: 26, subCat: 'engagement-rings', file: 'gold_engagement_rings_26.svg', title: 'Classic Solitaire Gold Engagement Ring', desc: 'An elegant gold engagement ring with a raised clear centre stone and a simple band.', type: 'ring_solitaire', bg: 0 },
  { num: 27, subCat: 'engagement-rings', file: 'gold_engagement_rings_27.svg', title: 'Princess Cut Solitaire Gold Ring', desc: 'A gold ring with a square clear centre stone and delicate side details.', type: 'ring_princess', bg: 1 },
  { num: 28, subCat: 'engagement-rings', file: 'gold_engagement_rings_28.svg', title: 'Pavé Band Round Brilliant Gold Ring', desc: 'A gold ring with a round centre stone and a fine pavé-style band.', type: 'ring_pave', bg: 2 },
  { num: 29, subCat: 'engagement-rings', file: 'gold_engagement_rings_29.svg', title: 'Vintage Oval Engraved Shoulder Gold Ring', desc: 'A vintage-inspired gold ring with an oval centre stone and engraved shoulders.', type: 'ring_vintage', bg: 3 },
  { num: 30, subCat: 'engagement-rings', file: 'gold_engagement_rings_30.svg', title: 'Minimal Bezel-Set Gold Engagement Ring', desc: 'A minimal gold engagement ring with a bezel-set clear centre stone.', type: 'ring_bezel', bg: 4 },

  // Rings — Casual (31 - 35)
  { num: 31, subCat: 'casual-rings', file: 'gold_casual_rings_31.svg', title: 'Slim Everyday Floral Accent Gold Ring', desc: 'A slim everyday gold band with a small floral detail.', type: 'ring_floral', bg: 0 },
  { num: 32, subCat: 'casual-rings', file: 'gold_casual_rings_32.svg', title: 'Petite Kemp Accent Gold Casual Ring', desc: 'A simple gold ring with a tiny coloured-stone-inspired accent.', type: 'ring_gem_accent', bg: 1 },
  { num: 33, subCat: 'casual-rings', file: 'gold_casual_rings_33.svg', title: 'Open-Ended Twin Leaf Gold Ring', desc: 'An open-ended gold ring with two small leaf motifs.', type: 'ring_open_leaf', bg: 2 },
  { num: 34, subCat: 'casual-rings', file: 'gold_casual_rings_34.svg', title: 'Soft Curve Modern Gold Band', desc: 'A modern, softly curved gold band with a polished finish.', type: 'ring_curved_band', bg: 3 },
  { num: 35, subCat: 'casual-rings', file: 'gold_casual_rings_35.svg', title: 'Delicate Engraved Flower Gold Ring', desc: 'A delicate gold ring with a small engraved flower at the centre.', type: 'ring_flower_engraved', bg: 4 },

  // Bangles & Bracelets — Cuffs (36 - 40)
  { num: 36, subCat: 'cuff-bracelets', file: 'gold_cuff_bracelets_36.svg', title: 'Wide Floral Engraved Gold Kada Cuff', desc: 'A wide open gold cuff with traditional engraved floral details.', type: 'cuff_wide_floral', bg: 0 },
  { num: 37, subCat: 'cuff-bracelets', file: 'gold_cuff_bracelets_37.svg', title: 'Modern Sculptural Curve Gold Cuff', desc: 'A slim gold cuff with a clean, modern sculptural curve.', type: 'cuff_slim_modern', bg: 1 },
  { num: 38, subCat: 'cuff-bracelets', file: 'gold_cuff_bracelets_38.svg', title: 'Temple Motif Beaded Border Gold Cuff', desc: 'A temple-inspired cuff with a raised central motif and beaded edging.', type: 'cuff_temple_beaded', bg: 2 },
  { num: 39, subCat: 'cuff-bracelets', file: 'gold_cuff_bracelets_39.svg', title: 'Embossed Leaf Textured Gold Cuff', desc: 'A gold cuff with repeating leaf patterns and subtle textured detailing.', type: 'cuff_leaf_texture', bg: 3 },
  { num: 40, subCat: 'cuff-bracelets', file: 'gold_cuff_bracelets_40.svg', title: 'Hinged Floral Centrepiece Gold Cuff', desc: 'A hinged-look gold cuff with a central floral ornament and clean silhouette.', type: 'cuff_hinged_floral', bg: 4 },

  // Bangles & Bracelets — Chain Bracelets (41 - 45)
  { num: 41, subCat: 'chain-bracelets', file: 'gold_chain_bracelets_41.svg', title: 'Fine Chain Petite Floral Charm Gold Bracelet', desc: 'A fine gold chain bracelet with a tiny floral charm.', type: 'brac_chain_floral', bg: 0 },
  { num: 42, subCat: 'chain-bracelets', file: 'gold_chain_bracelets_42.svg', title: 'Alternating Dual Texture Link Gold Bracelet', desc: 'A linked gold bracelet with alternating polished and textured links.', type: 'brac_chain_alt_links', bg: 1 },
  { num: 43, subCat: 'chain-bracelets', file: 'gold_chain_bracelets_43.svg', title: 'Circular Medallion Delicate Gold Chain Bracelet', desc: 'A delicate gold chain bracelet with a small circular centre motif.', type: 'brac_chain_circle_motif', bg: 2 },
  { num: 44, subCat: 'chain-bracelets', file: 'gold_chain_bracelets_44.svg', title: 'Traditional Mani Beaded Gold Wrist Chain', desc: 'A traditional gold bracelet with tiny bead details along the chain.', type: 'brac_chain_beads', bg: 3 },
  { num: 45, subCat: 'chain-bracelets', file: 'gold_chain_bracelets_45.svg', title: 'Minimal Geometric Link Clasp Gold Bracelet', desc: 'A minimal gold link bracelet with a small decorative clasp.', type: 'brac_chain_minimal', bg: 4 },

  // Bangles & Bracelets — Bangles (46 - 50)
  { num: 46, subCat: 'bangle-bracelets', file: 'gold_bangle_bracelets_46.svg', title: 'Pair of Slim Polished Everyday Gold Bangles', desc: 'A pair of slim polished gold bangles with a simple everyday design.', type: 'bangle_pair_slim', bg: 0 },
  { num: 47, subCat: 'bangle-bracelets', file: 'gold_bangle_bracelets_47.svg', title: 'Repeating Chevron Engraved Gold Bangle', desc: 'A textured gold bangle with repeating engraved motifs.', type: 'bangle_textured_repeating', bg: 1 },
  { num: 48, subCat: 'bangle-bracelets', file: 'gold_bangle_bracelets_48.svg', title: 'Spaced Floral Motif Gold Bangle', desc: 'A gold bangle with small floral elements spaced around the band.', type: 'bangle_spaced_floral', bg: 2 },
  { num: 49, subCat: 'bangle-bracelets', file: 'gold_bangle_bracelets_49.svg', title: 'Traditional Beaded Edge Gold Valayal', desc: 'A traditional gold bangle with a fine beaded border.', type: 'bangle_beaded_border', bg: 3 },
  { num: 50, subCat: 'bangle-bracelets', file: 'gold_bangle_bracelets_50.svg', title: 'Royal Panel Engraved Wide Gold Bangle', desc: 'A wider gold bangle with a central decorative panel and engraved sides.', type: 'bangle_wide_panel', bg: 4 },

  // Necklaces — Short (51 - 55)
  { num: 51, subCat: 'short-necklace', file: 'gold_short_necklace_51.svg', title: 'Delicate Floral Centrepiece Short Gold Necklace', desc: 'A short gold necklace with a delicate floral centrepiece and fine matching links.', type: 'neck_short_floral', bg: 0 },
  { num: 52, subCat: 'short-necklace', file: 'gold_short_necklace_52.svg', title: 'Traditional Temple Motif Short Gold Choker', desc: 'A traditional short necklace with repeating small temple-inspired motifs.', type: 'neck_short_temple', bg: 1 },
  { num: 53, subCat: 'short-necklace', file: 'gold_short_necklace_53.svg', title: 'Minimal Geometric Centre Short Gold Necklace', desc: 'A minimal short gold necklace with a neat geometric pendant-like centre.', type: 'neck_short_geom', bg: 2 },
  { num: 54, subCat: 'short-necklace', file: 'gold_short_necklace_54.svg', title: 'Ruby & Emerald Floral Short Gold Necklace', desc: 'A short gold necklace with ruby-red and green stone-inspired floral accents.', type: 'neck_short_kemp', bg: 3 },
  { num: 55, subCat: 'short-necklace', file: 'gold_short_necklace_55.svg', title: 'Layered Silhouette Beaded Short Gold Necklace', desc: 'A layered-look short necklace with tiny gold motifs and a subtle beaded edge.', type: 'neck_short_layered', bg: 4 },

  // Necklaces — Long (56 - 60)
  { num: 56, subCat: 'long-necklace', file: 'gold_long_necklace_56.svg', title: 'Heirloom Engraved Long Gold Haram', desc: 'A long traditional gold necklace with repeating engraved motifs and a small central pendant.', type: 'neck_long_engraved', bg: 0 },
  { num: 57, subCat: 'long-necklace', file: 'gold_long_necklace_57.svg', title: 'Grand Temple Lakshmi Bridal Gold Haram', desc: 'A long temple-style necklace with a detailed Lakshmi-inspired centrepiece.', type: 'neck_long_lakshmi', bg: 1 },
  { num: 58, subCat: 'long-necklace', file: 'gold_long_necklace_58.svg', title: 'Floral Link Mani Droplet Long Gold Necklace', desc: 'A long gold necklace with alternating floral links and small bead drops.', type: 'neck_long_floral_drops', bg: 2 },
  { num: 59, subCat: 'long-necklace', file: 'gold_long_necklace_59.svg', title: 'South Indian Mayil Peacock Long Gold Haram', desc: 'A long South Indian necklace with peacock-inspired details and green accents.', type: 'neck_long_peacock', bg: 3 },
  { num: 60, subCat: 'long-necklace', file: 'gold_long_necklace_60.svg', title: 'Royal Medallion Long Gold Chain Haram', desc: 'A long, elegant gold chain necklace with a finely detailed central medallion.', type: 'neck_long_medallion', bg: 4 },

  // Nose Pin (61 - 65)
  { num: 61, subCat: 'nosepin', file: 'gold_nosepin_61.svg', title: 'Delicate Floral Ruby Gold Mookuthi', desc: 'A delicate floral gold nose pin with a tiny ruby-red centre.', type: 'nose_floral_ruby', bg: 0 },
  { num: 62, subCat: 'nosepin', file: 'gold_nosepin_62.svg', title: 'Solitaire Diamond-Cut Gold Nose Pin', desc: 'A minimal gold nose pin with a small clear stone-inspired centre.', type: 'nose_clear_stone', bg: 1 },
  { num: 63, subCat: 'nosepin', file: 'gold_nosepin_63.svg', title: 'Traditional Leaf Motif Gold Nose Pin', desc: 'A traditional gold nose pin with a tiny leaf-shaped ornament.', type: 'nose_leaf', bg: 2 },
  { num: 64, subCat: 'nosepin', file: 'gold_nosepin_64.svg', title: 'Round Beaded Halo Gold Nose Pin', desc: 'A small round gold nose pin with a fine beaded border.', type: 'nose_round_beaded', bg: 3 },
  { num: 65, subCat: 'nosepin', file: 'gold_nosepin_65.svg', title: 'Flower Charm Dangling Bead Gold Mookuthi', desc: 'A subtle gold nose pin with a miniature flower and one tiny dangling bead.', type: 'nose_flower_dangle', bg: 4 },

  // Occasion — Casual Wear (66 - 70)
  { num: 66, subCat: 'casual-wear', file: 'gold_casual_wear_66.svg', title: 'Lightweight Daily Floral Gold Set', desc: 'A lightweight gold necklace and earring set with simple everyday floral details.', type: 'set_casual_floral', bg: 0 },
  { num: 67, subCat: 'casual-wear', file: 'gold_casual_wear_67.svg', title: 'Coordinated Minimal Hoops & Bracelet Gold Set', desc: 'Minimal gold hoops with a fine matching bracelet, photographed as a coordinated set.', type: 'cuff_slim_modern', bg: 1 },
  { num: 68, subCat: 'casual-wear', file: 'gold_casual_wear_68.svg', title: 'Understated Pendant & Fine Gold Chain Ensemble', desc: 'A delicate gold chain and small pendant with understated detailing.', type: 'pendant_floral_ruby', bg: 2 },
  { num: 69, subCat: 'casual-wear', file: 'gold_casual_wear_69.svg', title: 'Daily Comfort Polished Slim Gold Bangles', desc: 'Slim gold bangles with a simple polished everyday finish.', type: 'bangle_pair_slim', bg: 3 },
  { num: 70, subCat: 'casual-wear', file: 'gold_casual_wear_70.svg', title: 'Subtle Leaf Daily Wear Gold Studs', desc: 'Compact gold studs with a subtle leaf motif for everyday styling.', type: 'nose_leaf', bg: 4 },

  // Occasion — Party Wear (71 - 75)
  { num: 71, subCat: 'party-wear', file: 'gold_party_wear_71.svg', title: 'Statement Floral Gem Gold Drop Earrings', desc: 'Statement gold drop earrings with a bold floral centre and refined stone-inspired accents.', type: 'gold_hangings_8', bg: 0 },
  { num: 72, subCat: 'party-wear', file: 'gold_party_wear_72.svg', title: 'Festive Prominent Centrepiece Gold Necklace Set', desc: 'A decorative gold necklace with a prominent centrepiece and elegant matching earrings.', type: 'neck_short_kemp', bg: 1 },
  { num: 73, subCat: 'party-wear', file: 'gold_party_wear_73.svg', title: 'Glamorous Multi-Layer Intricate Gold Bangles', desc: 'Glamorous layered gold bangles with polished highlights and intricate details.', type: 'cuff_wide_floral', bg: 2 },
  { num: 74, subCat: 'party-wear', file: 'gold_party_wear_74.svg', title: 'Sculpted Gem-Accented Large Gold Hoops', desc: 'Large gold hoops with sculpted design and subtle coloured-stone-inspired accents.', type: 'gold_hoops_24', bg: 3 },
  { num: 75, subCat: 'party-wear', file: 'gold_party_wear_75.svg', title: 'Ornate Grand Pendant Festive Gold Necklace', desc: 'A statement gold pendant necklace with an ornate centre and fine chain.', type: 'pendant_peacock_filigree', bg: 4 },

  // Occasion — Traditional Wear (76 - 80)
  { num: 76, subCat: 'traditional-wear', file: 'gold_traditional_wear_76.svg', title: 'South Indian Temple Lakshmi Auspicious Necklace', desc: 'A South Indian temple jewellery necklace with an ornate Lakshmi-inspired pendant.', type: 'neck_long_lakshmi', bg: 0 },
  { num: 77, subCat: 'traditional-wear', file: 'gold_traditional_wear_77.svg', title: 'Grand Heritage Temple Dome Gold Jhumkas', desc: 'Traditional gold jhumkas with a detailed dome and small bead fringe.', type: 'gold_jhumkas_16', bg: 1 },
  { num: 78, subCat: 'traditional-wear', file: 'gold_traditional_wear_78.svg', title: 'Antique Temple Engraved Royal Gold Bangles', desc: 'Antique-style engraved gold bangles with temple-inspired motifs.', type: 'cuff_temple_beaded', bg: 2 },
  { num: 79, subCat: 'traditional-wear', file: 'gold_traditional_wear_79.svg', title: 'Chettinad Peacock Heritage Gold Trousseau Set', desc: 'A traditional necklace and earring set with peacock-inspired details.', type: 'neck_long_peacock', bg: 3 },
  { num: 80, subCat: 'traditional-wear', file: 'gold_traditional_wear_80.svg', title: 'Traditional Muhurtham Long Gold Haram', desc: 'A long gold haram-style necklace with repeating motifs and a detailed centrepiece.', type: 'neck_long_engraved', bg: 4 },

  // Chains (81 - 85)
  { num: 81, subCat: 'chains', file: 'gold_chains_81.svg', title: 'Classic Cable Link Fine 22K Gold Chain', desc: 'A fine cable-link gold chain with a delicate, classic profile.', type: 'chain_cable', bg: 0 },
  { num: 82, subCat: 'chains', file: 'gold_chains_82.svg', title: 'Diamond-Cut Twisted Rope 22K Gold Chain', desc: 'A gold rope chain with a twisted, reflective texture.', type: 'chain_rope', bg: 1 },
  { num: 83, subCat: 'chains', file: 'gold_chains_83.svg', title: 'Smooth Polished Curb Link 22K Gold Chain', desc: 'A curb-link gold chain with smooth, closely connected links.', type: 'chain_curb', bg: 2 },
  { num: 84, subCat: 'chains', file: 'gold_chains_84.svg', title: 'Crisp Geometric Box Link 22K Gold Chain', desc: 'A fine box-link gold chain with crisp geometric links.', type: 'chain_box', bg: 3 },
  { num: 85, subCat: 'chains', file: 'gold_chains_85.svg', title: 'Traditional South Indian Decorative Link Gold Chain', desc: 'A traditional gold chain with repeating small decorative links.', type: 'chain_decorative_link', bg: 4 },

  // Pendants (86 - 90)
  { num: 86, subCat: 'pendants', file: 'gold_pendants_86.svg', title: 'Petite Floral Ruby 22K Gold Pendant', desc: 'A small floral gold pendant with a ruby-red centre on a fine chain.', type: 'pendant_floral_ruby', bg: 0 },
  { num: 87, subCat: 'pendants', file: 'gold_pendants_87.svg', title: 'Round Temple Engraved Heritage Gold Pendant', desc: 'A round temple-inspired gold pendant with a detailed engraved motif.', type: 'pendant_round_temple', bg: 1 },
  { num: 88, subCat: 'pendants', file: 'gold_pendants_88.svg', title: 'Mayil Peacock Filigree 22K Gold Pendant', desc: 'A gold pendant with a delicate peacock silhouette and fine filigree.', type: 'pendant_peacock_filigree', bg: 2 },
  { num: 89, subCat: 'pendants', file: 'gold_pendants_89.svg', title: 'Contemporary Polished Geometric Gold Pendant', desc: 'A modern geometric gold pendant with a clean, polished surface.', type: 'pendant_modern_geom', bg: 3 },
  { num: 90, subCat: 'pendants', file: 'gold_pendants_90.svg', title: 'Auspicious Beaded Border Gold Medallion Pendant', desc: 'A traditional gold medallion pendant with a beaded border and engraved centre.', type: 'pendant_beaded_medallion', bg: 4 }
];

function generateArtwork(item) {
  switch (item.type) {
    case 'ring_solitaire':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldAntique)" stroke-width="26"/>
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldHighlight)" stroke-width="20"/>
          <g transform="translate(0, -60)">
            <polygon points="-35,0 -20,-45 20,-45 35,0" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="2"/>
            <polygon points="-25,0 -15,-40 15,-40 25,0" fill="url(#goldHighlight)"/>
            <polygon points="0,-95 38,-65 24,-45 -24,-45 -38,-65" fill="url(#diamond)" stroke="#FFFFFF" stroke-width="2"/>
            <polygon points="0,-95 18,-65 -18,-65" fill="#FFFFFF" opacity="0.8"/>
            <polygon points="18,-65 38,-65 24,-45 0,-45" fill="#CBE0F8" opacity="0.9"/>
            <polygon points="-18,-65 -38,-65 -24,-45 0,-45" fill="#A5C8EE" opacity="0.9"/>
          </g>
        </g>
      `;

    case 'ring_princess':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#gold22k)" stroke-width="26"/>
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldHighlight)" stroke-width="20"/>
          <g transform="translate(0, -60)">
            <rect x="-42" y="-95" width="84" height="84" rx="4" fill="url(#diamond)" stroke="#FFFFFF" stroke-width="2" transform="rotate(45, 0, -53)"/>
            <polygon points="-38,-53 0,-91 38,-53 0,-15" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="-38" cy="-53" r="6" fill="url(#goldSphere)"/>
            <circle cx="38" cy="-53" r="6" fill="url(#goldSphere)"/>
            <circle cx="0" cy="-91" r="6" fill="url(#goldSphere)"/>
            <circle cx="0" cy="-15" r="6" fill="url(#goldSphere)"/>
          </g>
        </g>
      `;

    case 'ring_pave':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#gold22k)" stroke-width="28"/>
          ${Array.from({length: 16}).map((_, i) => {
            const angle = (i / 15) * Math.PI - Math.PI/2;
            const x = 140 * Math.sin(angle);
            const y = 60 * Math.cos(angle) - 60;
            return `<circle cx="${x}" cy="${y}" r="4.5" fill="url(#diamond)"/>`;
          }).join('')}
          <g transform="translate(0, -60)">
            <circle cx="0" cy="-45" r="38" fill="url(#diamond)" stroke="#FFFFFF" stroke-width="2"/>
            <polygon points="0,-75 22,-52 0,-30 -22,-52" fill="#FFFFFF" opacity="0.85"/>
          </g>
        </g>
      `;

    case 'ring_vintage':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldAntique)" stroke-width="30"/>
          <g transform="translate(0, -60)">
            <ellipse cx="0" cy="-55" rx="42" ry="54" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3"/>
            <ellipse cx="0" cy="-55" rx="30" ry="42" fill="url(#diamond)"/>
            ${Array.from({length: 12}).map((_, i) => `
              <circle cx="${38*Math.cos(i*2*Math.PI/12)}" cy="${-55 + 48*Math.sin(i*2*Math.PI/12)}" r="4" fill="url(#goldSphere)"/>
            `).join('')}
          </g>
        </g>
      `;

    case 'ring_bezel':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldHighlight)" stroke-width="22"/>
          <g transform="translate(0, -60)">
            <circle cx="0" cy="-45" r="42" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="2"/>
            <circle cx="0" cy="-45" r="32" fill="url(#diamond)" stroke="#FFFFFF" stroke-width="2"/>
            <ellipse cx="-10" cy="-55" rx="12" ry="7" fill="#FFFFFF" opacity="0.8" transform="rotate(-30, -10, -55)"/>
          </g>
        </g>
      `;

    case 'ring_floral':
    case 'ring_gem_accent':
    case 'ring_open_leaf':
    case 'ring_curved_band':
    case 'ring_flower_engraved':
      return `
        <g transform="translate(400, 440)">
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#gold22k)" stroke-width="20"/>
          <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="url(#goldHighlight)" stroke-width="14"/>
          <g transform="translate(0, -60)">
            ${item.type === 'ring_floral' ? `
              <circle cx="0" cy="-15" r="28" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
              ${[0, 60, 120, 180, 240, 300].map(deg => `
                <circle cx="${22*Math.cos(deg*Math.PI/180)}" cy="${-15 + 22*Math.sin(deg*Math.PI/180)}" r="8" fill="url(#goldSphere)"/>
              `).join('')}
              <circle cx="0" cy="-15" r="8" fill="url(#gemRuby)"/>
            ` : item.type === 'ring_gem_accent' ? `
              <circle cx="0" cy="-18" r="16" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
              <circle cx="0" cy="-18" r="10" fill="url(#gemRuby)"/>
            ` : item.type === 'ring_open_leaf' ? `
              <path d="M-40,0 C-30,-30 0,-40 0,-15 C0,10 -30,15 -40,0" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
              <path d="M40,0 C30,-30 0,-40 0,-15 C0,10 30,15 40,0" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
            ` : item.type === 'ring_curved_band' ? `
              <path d="M-80,-10 Q0,-45 80,-10 Q0,-15 -80,-10" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
            ` : `
              <polygon points="0,-40 28,-15 18,20 -18,20 -28,-15" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
              <circle cx="0" cy="-4" r="8" fill="url(#goldSphere)"/>
            `}
          </g>
        </g>
      `;

    case 'cuff_wide_floral':
    case 'cuff_slim_modern':
    case 'cuff_temple_beaded':
    case 'cuff_leaf_texture':
    case 'cuff_hinged_floral':
      return `
        <g transform="translate(400, 400)">
          <ellipse cx="0" cy="0" rx="170" ry="110" fill="none" stroke="url(#goldAntique)" stroke-width="${item.type==='cuff_wide_floral'||item.type==='cuff_temple_beaded'?60:38}"/>
          <ellipse cx="0" cy="0" rx="170" ry="110" fill="none" stroke="url(#gold22k)" stroke-width="${item.type==='cuff_wide_floral'||item.type==='cuff_temple_beaded'?50:30}"/>
          ${item.type==='cuff_temple_beaded' ? `
            <circle cx="0" cy="-110" r="35" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="3"/>
            <circle cx="0" cy="-110" r="18" fill="url(#gemRuby)"/>
          ` : item.type==='cuff_wide_floral' ? `
            ${[-120, -60, 0, 60, 120].map(x => `
              <circle cx="${x}" cy="${-110 + (Math.abs(x)>60?15:0)}" r="16" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="1.5"/>
              <circle cx="${x}" cy="${-110 + (Math.abs(x)>60?15:0)}" r="8" fill="url(#gemRuby)"/>
            `).join('')}
          ` : `
            <ellipse cx="0" cy="0" rx="170" ry="110" fill="none" stroke="url(#goldHighlight)" stroke-width="10" stroke-dasharray="120, 200"/>
          `}
        </g>
      `;

    case 'brac_chain_floral':
    case 'brac_chain_alt_links':
    case 'brac_chain_circle_motif':
    case 'brac_chain_beads':
    case 'brac_chain_minimal':
      return `
        <g transform="translate(400, 400)">
          <ellipse cx="0" cy="0" rx="180" ry="90" fill="none" stroke="url(#goldAntique)" stroke-width="14"/>
          ${Array.from({length: 32}).map((_, i) => {
            const angle = (i / 32) * 2 * Math.PI;
            return `<circle cx="${180*Math.sin(angle)}" cy="${90*Math.cos(angle)}" r="6.5" fill="url(#goldSphere)"/>`;
          }).join('')}
          <g transform="translate(0, 90)">
            <circle cx="0" cy="0" r="28" fill="url(#goldHighlight)" stroke="#5C3B04" stroke-width="2"/>
            <circle cx="0" cy="0" r="14" fill="${item.type==='brac_chain_floral'?'url(#gemRuby)':'url(#gemEmerald)'}"/>
          </g>
        </g>
      `;

    case 'bangle_pair_slim':
    case 'bangle_textured_repeating':
    case 'bangle_spaced_floral':
    case 'bangle_beaded_border':
    case 'bangle_wide_panel':
      return `
        <g transform="translate(400, 400)">
          ${item.type==='bangle_pair_slim' ? `
            <ellipse cx="-20" cy="-25" rx="160" ry="95" fill="none" stroke="url(#gold22k)" stroke-width="22"/>
            <ellipse cx="-20" cy="-25" rx="160" ry="95" fill="none" stroke="url(#goldHighlight)" stroke-width="12"/>
            <ellipse cx="20" cy="25" rx="160" ry="95" fill="none" stroke="url(#goldAntique)" stroke-width="22"/>
            <ellipse cx="20" cy="25" rx="160" ry="95" fill="none" stroke="url(#goldHighlight)" stroke-width="12"/>
          ` : `
            <ellipse cx="0" cy="0" rx="170" ry="105" fill="none" stroke="url(#goldAntique)" stroke-width="${item.type==='bangle_wide_panel'?52:32}"/>
            <ellipse cx="0" cy="0" rx="170" ry="105" fill="none" stroke="url(#gold22k)" stroke-width="${item.type==='bangle_wide_panel'?42:24}"/>
          `}
        </g>
      `;

    case 'neck_short_floral':
    case 'neck_short_temple':
    case 'neck_short_geom':
    case 'neck_short_kemp':
    case 'neck_short_layered':
    case 'neck_long_engraved':
    case 'neck_long_lakshmi':
    case 'neck_long_floral_drops':
    case 'neck_long_peacock':
    case 'neck_long_medallion':
      const isLong = item.type.includes('long');
      return `
        <g transform="translate(400, ${isLong ? 120 : 160})">
          <path d="M-190,0 C-190,${isLong?360:240} 190,${isLong?360:240} 190,0" fill="none" stroke="url(#goldAntique)" stroke-width="16"/>
          <path d="M-190,0 C-190,${isLong?360:240} 190,${isLong?360:240} 190,0" fill="none" stroke="url(#gold22k)" stroke-width="10"/>
          ${Array.from({length: isLong?25:17}).map((_, i) => {
            const angle = (i / (isLong?24:16)) * Math.PI;
            return `<circle cx="${-190*Math.cos(angle)}" cy="${(isLong?360:240)*Math.sin(angle)}" r="9" fill="url(#goldHighlight)"/>`;
          }).join('')}
          <g transform="translate(0, ${isLong?370:250})">
            <path d="M0,-30 C-60,0 -70,70 0,130 C70,70 60,0 0,-30 Z" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3"/>
            <circle cx="0" cy="45" r="24" fill="url(#gemRuby)"/>
            ${[-40, -20, 0, 20, 40].map((dx, i) => `
              <circle cx="${dx}" cy="${145 + (i===2?15:0)}" r="7.5" fill="url(#pearl)"/>
            `).join('')}
          </g>
        </g>
      `;

    case 'nose_floral_ruby':
    case 'nose_clear_stone':
    case 'nose_leaf':
    case 'nose_round_beaded':
    case 'nose_flower_dangle':
      return `
        <g transform="translate(400, 400)">
          <line x1="0" y1="0" x2="110" y2="90" stroke="url(#goldAntique)" stroke-width="14" stroke-linecap="round"/>
          <circle cx="110" cy="90" r="18" fill="url(#goldSphere)"/>
          <circle cx="0" cy="0" r="75" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="3"/>
          <circle cx="0" cy="0" r="38" fill="url(#gemRuby)"/>
        </g>
      `;

    case 'chain_cable':
    case 'chain_rope':
    case 'chain_curb':
    case 'chain_box':
    case 'chain_decorative_link':
      return `
        <g transform="translate(400, 380)">
          <path d="M-180,-140 C-180,240 180,240 180,-140" fill="none" stroke="url(#goldAntique)" stroke-width="26"/>
          <path d="M-180,-140 C-180,240 180,240 180,-140" fill="none" stroke="url(#goldHighlight)" stroke-width="16" stroke-dasharray="14,6"/>
        </g>
      `;

    case 'pendant_floral_ruby':
    case 'pendant_round_temple':
    case 'pendant_peacock_filigree':
    case 'pendant_modern_geom':
    case 'pendant_beaded_medallion':
      return `
        <g transform="translate(400, 160)">
          <path d="M-160,-60 C-60,80 60,80 160,-60" fill="none" stroke="url(#goldHighlight)" stroke-width="4"/>
          <g transform="translate(0, 220)">
            <circle cx="0" cy="0" r="110" fill="url(#goldAntique)" stroke="#5C3B04" stroke-width="3.5"/>
            <circle cx="0" cy="0" r="92" fill="url(#gold22k)"/>
            <circle cx="0" cy="0" r="32" fill="url(#gemRuby)"/>
            <circle cx="0" cy="155" r="12" fill="url(#pearl)"/>
          </g>
        </g>
      `;

    default:
      return `
        <g transform="translate(400, 400)">
          <circle cx="0" cy="0" r="120" fill="url(#gold22k)" stroke="#5C3B04" stroke-width="3"/>
          <circle cx="0" cy="0" r="45" fill="url(#gemRuby)"/>
        </g>
      `;
  }
}

REMAINING_SPECS.forEach(item => {
  generators.push({
    num: item.num,
    subCat: item.subCat,
    file: item.file,
    title: item.title,
    desc: item.desc,
    svg: wrapSvg(item.bg, '', generateArtwork(item))
  });
});

console.log(`Generating all ${generators.length} Gold Product SVGs...`);
generators.forEach(gen => {
  const filePath = path.join(outputDir, gen.file);
  fs.writeFileSync(filePath, gen.svg, 'utf8');
});
console.log('SUCCESS: All 90 Gold Product SVGs generated into public/images/products/gold/ !');
