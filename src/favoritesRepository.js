const redisClient = require("./helpers/redisClient");

const KEY_ASSET = (userId, assetId) => `favorites:${userId}:${assetId}`;
const KEY_USER = userId => `*${userId}*`;
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

const store = async (userId, assetId) => {
  if (!userId || !assetId) return false;
  const success = redisClient.setex(KEY_ASSET(userId, assetId), ONE_YEAR, 1);
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
  await redisClient.del(KEY_ASSET(userId, assetId));
  return true;
};

module.exports = {
  store,
  get,
  del
};
