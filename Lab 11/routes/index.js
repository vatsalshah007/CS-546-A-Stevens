const path = require('path');

const constructorMethod = (app) => {
    app.get('/', (req, res) =>{
        res.sendFile(path.resolve("public/pages/static.html"))
    });

    app.use('*', (req, res) => {
        res.status(404).sendFile(path.resolve("public/pages/error.html"));
    });
    
  };
  
  module.exports = constructorMethod;