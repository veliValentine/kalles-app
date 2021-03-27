const environment = process.env.NODE_ENV;

const isProductionEnvironment = environment === 'production';
const isDevelopmentEnvironment = environment === 'development';
const isTestEnvironment = environment === 'test';

module.exports = {
  isProductionEnvironment,
  isDevelopmentEnvironment,
  isTestEnvironment,
};
