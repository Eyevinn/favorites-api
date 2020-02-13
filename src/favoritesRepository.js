const redisClient = require("./helpers/redisClient");

const KEY_PREFIX = "favorites";
const KEY_USER = userId => `*${KEY_PREFIX}:${userId}*`;
const generateKey = (...args) => args.join(":");
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

const store = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const key = generateKey(KEY_PREFIX, userId, assetId);
  const success = redisClient.setex(key, ONE_YEAR, 1);
  return success;
};

const get = async userId => {
  if (!userId) return false;
  const keys = await redisClient.keys(KEY_USER(userId));
  if (!keys) return [];

  const requestPromises = [];
  keys.forEach(key => {
    requestPromises.push(getInclExpiration(key));
  });
  const favoritesList = await Promise.all(requestPromises);
  if (!favoritesList) return [];

  favoritesList.sort((a, b) => b.expiration - a.expiration);
  return favoritesList;
};

const getInclExpiration = async key => {
  const expiration = await redisClient.ttl(key);
  const assetId = key.split(":").pop();
  const item = { assetId, expiration };
  return item;
};

const del = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const key = generateKey(KEY_PREFIX, userId, assetId);
  await redisClient.del(key);
  return true;
};

module.exports = {
  store,
  get,
  del
};
