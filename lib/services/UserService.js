const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = class UserService{
  static async register({ username, email, password }){
    const registeredUser = await User.findOne({ email });

    if(registeredUser) throw new Error('Email already Exists');

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    return savedUser;
  }

  static async signIn({ email, password = '' }){
    try{
      const existingUser = await User.findOne({ email });

      if(!existingUser) throw new Error('Invalid Email');
      console.log(existingUser.email, existingUser.password);
      if(!bcrypt.compareSync(password, existingUser.password)) throw new Error('Invalid Password');

      const token = jwt.sign({ ...existingUser }, process.env.JWT_SECRET);

      return token;
    }catch(e){
      e.status = 401;
      throw e;
    }
  }
};
