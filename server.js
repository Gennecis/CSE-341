const express = require('express');
const app = express();
const indexRoute = require('./routes/index');
const contactsRoute = require('./routes/contacts');
const initDb = require('./database/connect');

const port = process.env.PORT || 3000;


app.use('/', indexRoute);
app.use('/contacts', contactsRoute);

initDb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    }
});