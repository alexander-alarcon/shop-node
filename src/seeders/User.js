require('dotenv').config();
const debug = require('debug')('shop-sequelize:DB');
const mongoose = require('mongoose');
const faker = require('faker');

const User = require('../models/User');

const errorLogger = debug.extend('error');

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

async function seedUsers() {
  const users = [];

  for (let index = 0; index < 20; index += 1) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
    });
  }

  try {
    await User.insertMany(users);
    debug('users Inserted Succesfully');
  } catch (error) {
    errorLogger(error);
  } finally {
    await mongoose.connection.close();
  }
}

seedUsers();
