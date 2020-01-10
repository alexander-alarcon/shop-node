require('dotenv').config();
const debug = require('debug')('shop-sequelize:DB');
const mongoose = require('mongoose');
const faker = require('faker');

const Product = require('../models/Product');

const errorLogger = debug.extend('error');

const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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

async function seedProducts() {
  const products = [];

  for (let index = 0; index < 20; index += 1) {
    products.push({
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.lorem.paragraphs(
        Math.floor(Math.random() * (5 - 2 + 1)) + 2,
      ),
      imageUrl: 'https://via.placeholder.com/150',
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
