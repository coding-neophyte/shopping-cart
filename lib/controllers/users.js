const express = require('express');
const authenicate = require('../middleware/authenicate');
const userAuthorization = require('../middleware/userAuthorization');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

module.exports = router.put('/:id', [authenicate, userAuthorization], async (req, res, next) => {

  if(req.body.password){
    req.body.password = await bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS));
  }
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: req.body
    }, { new: true });
    const { password, ...others } = updatedUser._doc;
    res.json(others);
  }catch(error){
    next(error);
  }
})
  .delete('/:id', [authenicate, userAuthorization], async(req, res, next) => {
    try{
      const { id } = req.params;

      await User.findByIdAndDelete(id);
      res.status(200).json('User Deleted');
    }catch(e){
      next(e);
    }
  })
  .get('/:id', authenicate, async (req, res, next) => {
    //needs authorization middleware
    try{
      const { id } = req.params;

      const singleUser = await User.findById(id);
      const { password, ...others } = singleUser._doc;

      res.status(200).json(others);
    }catch(e){
      next(e);
    }
  })
  .get('/', authenicate, async (req, res, next) => {
    //needs auth middleware
    try{
      const userList = await User.find().limit(10);

      res.status(200).json(userList);

    }catch(e){
      next(e);
    }
  });
