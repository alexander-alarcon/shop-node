require('dotenv').config();
const debug = require('debug')('shop-sequelize:DB');
const mongoose = require('mongoose');
const faker = require('faker');

const connect = require('../utils/database');
const Product = require('../models/Product');
const User = require('../models/User');

const errorLogger = debug.extend('error');

connect();

async function seedProducts() {
  const products = [];
  const userId = await (await User.findOne({})).id;
  for (let index = 0; index < 20; index += 1) {
    products.push({
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraphs(
        Math.floor(Math.random() * (5 - 2 + 1)) + 2,
      ),
      imageUrl: 'https://via.placeholder.com/150',
      userId,
    });
  }

  try {
    await Product.insertMany(products);
    debug('Products Inserted Succesfully');
  } catch (error) {
    errorLogger(error);
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
