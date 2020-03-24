const mongoose = require('mongoose');
const debug = require('debug')('shop-mongoose:DB');

const errorLogger = debug.extend('error');

function connect() {
  const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .catch((err) => {
      return errorLogger(err);
    });

  mongoose.connection.on('error', (err) => {
    errorLogger(err);
  });

  mongoose.connection.on('connected', (err, res) => {
    if (err) {
      errorLogger(err);
    }
    if (res) {
      debug(res);
    }
    debug('The DB was connected successfully');
  });

  mongoose.connection.on('close', (err, res) => {
    if (err) {
      errorLogger(err);
    }
    if (res) {
      debug(res);
    }
    debug('The DB was disconnected successfully');
  });

  return mongoose;
}

module.exports = connect;
