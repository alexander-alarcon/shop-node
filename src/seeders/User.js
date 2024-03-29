require('dotenv').config();
const debug = require('debug')('shop-mongoose:DB');
const mongoose = require('mongoose');
const faker = require('faker');

const connect = require('../utils/database');
const User = require('../models/User');

const errorLogger = debug.extend('error');

connect();

async function seedUsers() {
  const users = [];

  for (let index = 0; index < 20; index += 1) {
    users.push({
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
