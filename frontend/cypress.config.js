const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
        ...config.env
      }
      return config 
    },
  },
});
