const fs = require("fs");
const path = require("path");
const {
  parseCsv,
  parseSpecRow,
  enrichProductList,
  coverageSnapshot,
} = require("./specificationsLib");

function resolveSpecCsvPath() {
  if (process.env.PROJECTOR_SPEC_CSV) return process.env.PROJECTOR_SPEC_CSV;
  return path.join(__dirname, "..", "data", "projector-specifications.csv");
}

let csvFileCache = { key: "", loaded: null };

function loadSpecificationFile() {
  const file = resolveSpecCsvPath();
  let mtime = 0;
  try {
    mtime = fs.statSync(file).mtimeMs;
  } catch {
    mtime = 0;
  }
  const cacheKey = `${file}:${mtime}`;
  if (csvFileCache.loaded && csvFileCache.key === cacheKey) {
    return csvFileCache.loaded;
  }
  if (!fs.existsSync(file)) {
    const loaded = {
      file,
      text: "",
      rows: [],
      parseErrors: [{ reason: "missing_file", file }],
      csvRows: 0,
      cacheHit: false,
    };
    csvFileCache = { key: cacheKey, loaded };
    return loaded;
  }
  const text = fs.readFileSync(file, "utf8");
  const parsed = parseCsv(text);
  const loaded = {
    file,
    text,
    rows: parsed.rows,
    parseErrors: parsed.errors,
    csvRows: parsed.rows.length,
    cacheHit: false,
  };
  csvFileCache = { key: cacheKey, loaded };
  return loaded;
}

function enrichLiveCatalog(products) {
  const loaded = loadSpecificationFile();
  const before = coverageSnapshot(products);
  if (!loaded.rows.length) {
    return {
      products,
      before,
      after: before,
      matchReport: {
        csvRows: 0,
        matched: 0,
        unmatched: [],
        ambiguous: [],
        byMethod: {},
        liveProjectors: before.total,
        liveEnriched: 0,
        liveWithoutSpec: before.total,
        parseErrors: loaded.parseErrors,
        file: loaded.file,
      },
    };
  }
  const specRows = loaded.rows.map(parseSpecRow);
  const { products: enriched, report } = enrichProductList(products, loaded.rows);
  report.parseErrors = loaded.parseErrors;
  report.file = loaded.file;
  report.csvRowsRead = loaded.csvRows;
  const after = coverageSnapshot(enriched);
  return { products: enriched, before, after, matchReport: report, specRowCount: specRows.length };
}

module.exports = {
  resolveSpecCsvPath,
  loadSpecificationFile,
  enrichLiveCatalog,
  coverageSnapshot,
};
