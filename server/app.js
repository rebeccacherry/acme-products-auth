const express = require('express')
const path = require('path')
const { Product, User } = require('./db');
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json());

// static middleware
app.use('/dist', express.static(path.join(__dirname, '../dist')))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}); 

app.get('/api/products', async(req, res, next)=> {
  try{
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.use('/api/auth', require('./routes/auth'));

app.post('/api/auth/register', async(req, res, next)=> {
  try{
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.send({ token: jwt.sign({ id: user.id }, process.env.JWT) });
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth/:token', async(req, res, next)=> {
  try{
    const token = jwt.verify(req.params.token, process.env.JWT);
    const user = await User.findByPk(token.id);
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});

module.exports = app;

