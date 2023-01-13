const User = require('../models/User');

module.exports = async (req, res, next) => {
  try{
    if(req.method === 'PUT'){
      const user = await User.findById(req.params.id);
      if(req.user._doc._id !== user.id){
        throw new Error('Not Authorized');
      }
    }

    if(req.method === 'DELETE'){
      const user = await User.findById(req.params.id);
      if(req.user._doc._id !== user.id){
        throw new Error('Not Authorized');
      }
    }

    if(req.method === 'POST'){
      const user = await User.findById(req.params.id);
      if(req.user._doc._id !== user.id){
        throw new Error('Not Authorized');
      }
    }

    if(req.method === 'GET'){
      const user = await User.findById(req.params.id);
      if(req.user._doc._id !== user.id){
        throw new Error('Not authorized to view this page');
      }
    }

    next();
  }catch(e){
    e.status = 403;
    next(e);
  }
};
