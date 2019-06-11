const environmentJson = require('./config.json');
let env = {};

// Determine proper environment
switch (environmentJson.NODE_ENV && environmentJson.NODE_ENV.toLowerCase()) {
  case 'production':
  case 'prod':
    env = environmentJson.production;
    break;
  case 'development':
  case 'dev':
    env = environmentJson.development;
    break;
  case 'test':
    env = environmentJson.test;
    break;
  default:
    console.warn('Invalid NODE_ENV, falling back to development.');
    env = environmentJson.development;
    break;
}

console.log(process.env)
// Other config
let syncOptions = { force: false };
// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true;
}

module.exports = {
  env,
  syncOptions
};
