const express = require('express')
const path = require('path')
const { Product, User } = require('../db');
const jwt = require('jsonwebtoken');

const app = express.Router();


app.post('/', async(req, res, next)=> {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username,
        password
      }
    });
    if(!user){
      res.status(401).send({ error: 'not authorized' });
    }
    else {
      res.send(user.generateToken());
    }
  }
  catch(ex){
    next(ex); 
  }
});

app.post('/register', async(req, res, next)=> {
  try{
    res.send(await User.register(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/:token', async(req, res, next)=> {
  try{
    const token = jwt.verify(req.params.token, process.env.JWT);
    const user = await User.findByPk(token.id);
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err)
  res.status(500).send({ error: err })
})

module.exports = app;
