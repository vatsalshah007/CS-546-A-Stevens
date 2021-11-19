const palindromeRoutes = require('./palindrome')

const constructorMethod = (app) => {
    app.use('/', palindromeRoutes);

    app.use('*', (req, res) => {
      res.status(404).render(`palindrome/errors`, {code:404, description: 'Page Not found' });
    });
    
  };
  
  module.exports = constructorMethod;