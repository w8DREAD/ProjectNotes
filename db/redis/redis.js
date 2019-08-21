const redis = require('redis');

const client = redis.createClient();
const {promisify} = require('util');

const hget = promisify(client.hget).bind(client);
const hset = promisify(client.hset).bind(client);
const hgetall = promisify(client.hgetall).bind(client);
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const expire = promisify(client.expire).bind(client);
const hincrby = promisify(client.hincrby).bind(client);

module.exports = {
  hget, hset, hgetall, get, set, expire, hincrby,
};
