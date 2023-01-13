const Cart = require('../models/Cart');

module.exports = async (req, res, next) => {
  try{
    if(req.method === 'DELETE' || req.method === 'PUT' || req.method === 'GET'){
      const cart = await Cart.findById(req.params.id);
      if(cart.userId !== req.user._doc._id){
        throw new Error('Cannot complete action');
      }
    }
    next();

  }catch(e){
    e.status = 403;
    next(e);
  }
};
