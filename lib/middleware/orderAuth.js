const Order = require('../models/Order');

module.exports = async (req, res, next) => {
  try{
    if(req.method === 'GET'){
      const userOrder = await Order.findById(req.params);
      if(userOrder.userId !== req.user._doc._id){
        throw new Error('Cannot view order');
      }
    }
    next();
  }catch(e){
    e.status = 403;
    next(e);
  }
};
