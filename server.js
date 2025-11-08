const express = require('express');
const app = express();
const indexRoute = require('./routes/index');

const port = process.env.PORT || 3000;


app.use('/', indexRoute);


app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
});