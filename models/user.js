import * as bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  User.generateHash = password => bcrypt.hashSync(
    password, bcrypt.genSaltSync(8), null,
  );

  return User;
};
