const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

module.exports = router.post('/', async (req, res, next) => {
  //needs admin authorized middleware
  const newProduct = new Product(req.body);
  try{
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);

  }catch(e){
    next(e);
  }
});
router.get('/', async(req, res, next) => {
  //no auth middleware needed
  try{
    const productList = await Product.find().limit(10);
    res.status(200).json(productList);
  }catch(e){
    next(e);
  }
})
  .get('/:id', async (req, res, next) => {
    // no auth middleware needed
    try{
      const { id } = req.params;
      const singleProduct = await Product.findById(id);

      res.status(200).json(singleProduct);
    }catch(e){
      next(e);
    }
  })
  .put('/:id', async (req, res, next) => {
    //needs admin authorization middleware
    try{
      const { id } = req.params;
      const editedProduct = await Product.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });
      res.status(200).json(editedProduct);
    }catch(e){
      next(e);
    }
  })
  .delete('/:id', async (req, res, next) => {
    //needs admin authorization middleware
    try{
      const { id } = req.params;
      await Product.findByIdAndDelete(id);

      res.status(200).send();
    }catch(e){
      next(e);
    }
  });
