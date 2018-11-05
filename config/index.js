module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './db.development.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
};
