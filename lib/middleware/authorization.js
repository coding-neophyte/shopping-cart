module.exports = async (req, res, next) => {
  try{
    if(!req.user || req.user.email !== 'blemon20@gmail.com') throw new Error('You are not authorized to access this content');

    next();
  }catch(e){
    e.status = 403;
    next(e);
  }
};
