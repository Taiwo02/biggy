const jwt = require('jsonwebtoken');

module.exports = {
  Auth: (req, res, next) => {

      var token = req.cookies.auth;
      if (token) {
        jwt.verify(token, 'hello', function(err, token_data) {
          if (err) {
             return res.status(403).send('Error');
          } else {
            req.user_data = token_data;
            next();
          }
        });
    
      } else {
        return res.status(403).send('No token');
      }
  }
};