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
    type: STRING,
    unique: true
  },
});

User.prototype.generateToken = function(){
  return {token: jwt.sign({ id: this.id}, process.env.JWT)} // this = an instance of the User (one user)
}

User.register = async function(credentials){
  const user = await this.create(credentials);
  return user.generateToken();
}

User.findByToken = async function(token){
  const { id } = jwt.verify(token, process.env.JWT); // payload has the id
  const user = await this.findByPk(id)
  if(!user){
    const error = Error('bad token');
    error.status = 401;
    throw error;
  }
  return user
}


User.authenticate = async function(credentials){
  const { username, password} = credentials;
  const user = await this.findOne({
    where: {
      username,
      password
    }
  });
  if(!user){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  return user.generateToken();
}



module.exports = {
  Product,
  User,
  conn
};
