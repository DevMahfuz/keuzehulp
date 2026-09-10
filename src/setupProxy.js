require("../server/loadEnv");
const { handleCatalogRequest } = require("../server/catalog");

/**
 * Webpack-dev-server middleware (npm start). Same-origin /api/products, no secrets in the bundle.
 */
module.exports = function setupProxy(app) {
  app.get("/api/products", (req, res) => {
    handleCatalogRequest(req, res);
  });
};
