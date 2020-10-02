const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const Database = require('../database/db');

const requireAuth = (req, res, next) => {
  
  const token = req.cookies.jwt;

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, authConfig.secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        
        next();
      }
    });
  }
  else {
    res.redirect('/login');
  }
};

// check the current user
 const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const db = await Database;

  if (token) {
    jwt.verify(token, authConfig.secret, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        

        let user = await db.get(`SELECT * FROM users WHERE id="${decodedToken.id}";`);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
 };

module.exports = { requireAuth, checkUser };