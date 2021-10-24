const express = require('express');
const app = express();
const configRoutes = require('./routes');

configRoutes(app);

app.listen(3000, () => {
  console.log("Server is Online!");
  console.log('All routes will be running on http://localhost:3000');
});