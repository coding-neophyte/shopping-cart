const express = require('express');
const authenicate = require('../middleware/authenicate');

const router = express.Router();
const UserService = require('../services/UserService');


module.exports = router.post('/register', async (req, res, next) => {
  try{
    const newUser = await UserService.register({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    const { email, password } = req.body;
    const token = await UserService.signIn({ email, password });

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60 * 24
    });
    // const { password, ...others } = newUser._doc;
    res.status(201).json(newUser);
  }catch(e){
    res.status(500);
    next(e);
  }
})
  .post('/login', async (req, res, next) => {
    try{
      const { email, password } = req.body;
      const token = await UserService.signIn({ email, password });

      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'strict' : 'none'
      }).json({ message: 'Signed in Successfully' });

    }catch(e){
      e.status = 401;
      next(e);
    }
  })
  .get('/me', authenicate, async (req, res) => {
    res.json(req.user._doc);
  })
  .delete('/', async (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: process.env.SECURE_COOKIES === 'true' ? 'strict' : 'none'
    }).status(204)
      .send();
  });
