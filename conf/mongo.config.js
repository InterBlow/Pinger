const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const state = {
  _db: null,
};

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      process.env.MONGODBCONNECTIONSTRING,
      { useNewUrlParser: true },
      function (err, client) {
        state._db = client.db(process.env.dbName);
        return callback(err);
      }
    );
  },

  getDb: function () {
    return state._db;
  },
};
