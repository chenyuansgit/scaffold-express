const redis = require('redis');
const logger = require('../log/logger.js');

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env;

let options = {};
if (REDIS_PASSWORD) {
  options = { auth_pass: REDIS_PASSWORD };
}

const client = redis.createClient(REDIS_PORT, REDIS_HOST, options);

client.on('connect', () => {
  console.log(`✅ redis connection ${REDIS_PORT} ${REDIS_HOST}  ${JSON.stringify(options)} `);
});

client.on('error', (err) => {
  logger.sql(`redis error:${err}`);
});

exports.client = client;
