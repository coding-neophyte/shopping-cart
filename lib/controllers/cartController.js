const express = require('express');
const authenicate = require('../middleware/authenicate');
const cartAuth = require('../middleware/cartAuth');
const router = express.Router();
const Cart = require('../models/Cart');

module.exports = router.post('/', authenicate, async (req, res, next) => {
  try{
    const userCart = new Cart(req.body);

    const savedCart = await userCart.save();

    res.status(200).json(savedCart);
  }catch(e){
    next(e);
  }
})
  .put('/:id', [authenicate, cartAuth], async (req, res, next) => {
    try{
      const { id } = req.params;

      const updatedCart = await Cart.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });

      res.status(200).json(updatedCart);
    }catch(e){
      next(e);
    }
  })
  .delete('/:id', [authenicate, cartAuth], async (req, res, next) => {
    try{
      const { id } = req.params;
      await Cart.findByIdAndDelete(id);

      res.status(200).json('Cart Deleted');
    }catch(e){
      next(e);
    }
  })
  .get('/:id', [authenicate, cartAuth], async  (req, res, next) => {
    try{
      // const { id } = req.params;
      const cart = await Cart.findOne({
        userId: req.user._doc._id
      });
      res.status(200).json(cart);
    }catch(e){
      next(e);
    }
  })
  .get('/', authenicate, async (req, res, next) => {
    //needs auth/admin middleware
    try{
      const allCarts = await Cart.find();
      res.status(200).json(allCarts);
    }catch(e){
      next(e);
    }
  });
