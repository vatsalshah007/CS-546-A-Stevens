const marvelRoutes = require('./marvel')

const constructorMethod = (app) => {
    app.use('/', marvelRoutes);

    app.use('*', (req, res) => {
      res.status(404).render(`marvel/errors`, {code:404, description: 'Page Not found' });
    });
    
  };
  
  module.exports = constructorMethod;