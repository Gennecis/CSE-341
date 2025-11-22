const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }

  MongoClient.connect(process.env.CONNECTION_STRING)
    .then((client) => {
      _db = client.db(process.env.DB_NAME || 'projectManager');
      console.log('Database connected successfully!');
      callback(null, _db);
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
