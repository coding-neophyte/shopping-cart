const express = require('express');
const router = express.Router();
const authenicate = require('../middleware/authenicate');
const orderAuth = require('../middleware/orderAuth');
const Order = require('../models/Order');


module.exports = router.post('/', authenicate, async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);

    const savedOrder = await newOrder.save();

    res.status(200).json(savedOrder);
  }catch(e){
    next(e);
  }
})
  .put('/:id', authenicate, async (req, res, next) => {
    try{
      //should have authorization middleware
      const { id } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });

      res.status(200).json(updatedOrder);

    }catch(e){
      next(e);
    }
  })
  .get('/', authenicate, async (req, res, next) => {
    //should have admin/auth middleware
    try{
      const ordersList = await Order.find();
      res.status(200).json(ordersList);
    }catch(e){
      next(e);
    }
  })
  .get('/:id', [authenicate, orderAuth], async (req, res, next) => {
    try{
      const orders = await Order.find({
        userId: req.params.id
      });

      res.status(200).json(orders);
    }catch(e){
      next(e);
    }
  })
  .get('/income', authenicate, async (req, res, next) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try{
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: '$createdAt' },
            sales: '$amount',
          },

          $group: {
            _id: '$month',
            total: { $sum: '$sales' },

          },
        },
      ]);

      res.status(200).json(income);
    }catch(e){
      next(e);
    }
  })
  .delete('/:id', authenicate, async (req, res, next) => {
    // needs auth/admin middleware
    try{
      const { id } = req.params;
      await Order.findByIdAndDelete(id);

      res.status(200).json('Order Deleted');
    }catch(e){
      next(e);
    }
  });
