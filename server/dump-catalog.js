require("./loadEnv");
const fs = require("fs");
const path = require("path");
const { getCatalogPayload } = require("./catalog");

(async () => {
  const payload = await getCatalogPayload();
  const out = path.join(__dirname, "..", ".live-catalog.json");
  fs.writeFileSync(out, JSON.stringify(payload));
  console.log(JSON.stringify(payload.meta, null, 2));
  console.log("wrote", out, "products", payload.products.length);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
