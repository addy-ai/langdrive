// Export the utility functions for external use
require('dotenv').config(); // Load environment variables from .env file

const serverUtils = require('./src/server_utils');

module.exports = {
    setupGoogleStrategy: serverUtils.setupGoogleStrategy,
    handleGoogleCallback: serverUtils.handleGoogleCallback,
    createFileInFolder: serverUtils.createFileInFolder,
    getFolderId: serverUtils.getFolderId
  };