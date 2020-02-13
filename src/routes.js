const favoritesRepository = require("./favoritesRepository");

module.exports = (fastify, opts, next) => {
  fastify.post("/:userId/:assetId", async (req, res) => {
    const userId = req.params.userId;
    const assetId = req.params.assetId;

    const store = await favoritesRepository.store(userId, assetId);
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(store);
  });

  fastify.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.code(404).send();
    }
    let favorites = [];
    favorites = await favoritesRepository.get(userId);
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(favorites);
  });

  fastify.delete("/:userId/:assetId", async (req, res) => {
    const userId = req.params.userId;
    const assetId = req.params.assetId;
    const deleted = await favoritesRepository.del(userId, assetId);
    if (!userId || !assetId || !deleted) {
      return res.code(404).send();
    }
    res
      .header("Cache-Control", "public, no-cache")
      .code(200)
      .send(deleted);
  });

  next();
};
