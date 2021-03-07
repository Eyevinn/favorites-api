const fastify = require("fastify")({
  ignoreTrailingSlash: true
});
fastify.register(require("fastify-cors"));

const fastifyRateLimit = require("fastify-rate-limit");
fastify.register(fastifyRateLimit, {
  max: 25,
  timeWindow: "1 minute"
});

fastify.register(require("./routes"), {
  prefix: "/favorites"
});

module.exports = fastify;
