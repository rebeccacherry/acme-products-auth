const Sequelize = require('sequelize');
const { STRING, BOOLEAN } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_products_search_db');
const jwt = require('jsonwebtoken');


const Product = conn.define('product', {
  name: {
    type: STRING
  },
  inStock: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

const User = conn.define('user', {
  username: {
    type: STRING,
    unique: true
  },
  password: {
    type: STRING
  },
});

User.prototype.generateToken = function(){
  return {token: jwt.sign({ id: this.id}, process.env.JWT)} // this = an instance of the User (one user)
}
module.exports = {
  Product,
  User,
  conn
};
