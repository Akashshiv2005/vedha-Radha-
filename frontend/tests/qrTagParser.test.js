import { parseJewelleryTagQR } from '../src/services/qrTagParserService.js';

const testCases = [
  {
    name: "User Screenshot Payload (Dollar-delimited with leading/trailing $$)",
    payload: "$26FPB04F11$FIXED PRICE BRACELET$1$0.000$0.000$0.000$0$0$3100$5.100$$B+250$$GIFT ARTICLES$$4193"
  },
  {
    name: "Dollar-delimited alternate trailing ($44193)",
    payload: "$26FPB04F11$FIXED PRICE BRACELET$1$0.000$0.000$0.000$0$0$3100$5.100$$B+250$$GIFT ARTICLES$44193"
  },
  {
    name: "Dollar-delimited without leading $",
    payload: "26FPB04F11$FIXED PRICE BRACELET$1$0.000$0.000$0.000$0$0$3100$5.100$$B+250$$GIFT ARTICLES$44193"
  },
  {
    name: "Previous reference tag (Pipe-delimited)",
    payload: "26FPC25G23|VRTM|6140|15.350|B + 160|925"
  },
  {
    name: "Key-Value tag",
    payload: "CODE:26FPB04F11;DESC:BRACELET;RATE:3100;WT:5.100;AC:B+250"
  },
  {
    name: "JSON format tag",
    payload: '{"code":"26FPB04F11","name":"FIXED PRICE BRACELET","rate":3100,"weight":5.1,"category":"GIFT ARTICLES"}'
  },
  {
    name: "URL format tag",
    payload: "https://vedharadha.com/product/26FPB04F11?rate=3100&wt=5.100"
  },
  {
    name: "Plain SKU string",
    payload: "26FPB04F11"
  }
];

let failed = 0;
for (const tc of testCases) {
  console.log(`\n========================================`);
  console.log(`TEST: ${tc.name}`);
  console.log(`INPUT: ${tc.payload}`);
  const res = parseJewelleryTagQR(tc.payload);

  if (!res.success) {
    console.error(`FAILED: returned success = false`);
    failed++;
    continue;
  }

  const d = res.data;
  console.log(`-> format:           ${d.format}`);
  console.log(`-> product_code:     "${d.product_code}"`);
  console.log(`-> description:      "${d.description}"`);
  console.log(`-> gross_weight:     "${d.gross_weight}"`);
  console.log(`-> rate:             ${d.rate}`);
  console.log(`-> additional_charge:"${d.additional_charge}"`);
  console.log(`-> category:         "${d.category}"`);
  console.log(`-> brand:            "${d.brand}"`);
  console.log(`-> purity:           "${d.purity}"`);

  // Assertions
  if (d.product_code !== '26FPB04F11' && d.product_code !== '26FPC25G23') {
    console.error(`ERROR: Product code "${d.product_code}" does not match expected!`);
    failed++;
  }
  if (tc.payload.includes('$26FPB04F11')) {
    if (d.product_code !== '26FPB04F11') {
      console.error(`ERROR: Failed to extract 26FPB04F11 from dollar tag!`);
      failed++;
    }
    if (d.description !== 'FIXED PRICE BRACELET') {
      console.error(`ERROR: Failed to extract description 'FIXED PRICE BRACELET'!`);
      failed++;
    }
    if (d.gross_weight !== '5.100 g') {
      console.error(`ERROR: Gross weight "${d.gross_weight}" !== "5.100 g"!`);
      failed++;
    }
    if (d.rate !== 3100) {
      console.error(`ERROR: Rate ${d.rate} !== 3100!`);
      failed++;
    }
    if (d.additional_charge !== 'B+250') {
      console.error(`ERROR: Additional charge "${d.additional_charge}" !== "B+250"!`);
      failed++;
    }
    if (d.purity !== null) {
      console.error(`ERROR: Purity should be null (not invented), got "${d.purity}"!`);
      failed++;
    }
    if (d.brand !== null) {
      console.error(`ERROR: Brand should be null (not invented), got "${d.brand}"!`);
      failed++;
    }
  }
}

console.log(`\n========================================`);
if (failed === 0) {
  console.log(`ALL TESTS PASSED PERFECTLY (8/8)!`);
} else {
  console.error(`TESTS FAILED: ${failed} errors.`);
  process.exit(1);
}
