require('dotenv').config(); //This must be the first one to initialize to prevent dependency errors

const express = require('express');
const rootrouter = require('./routers/root');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

app.use(cors({ origin: 'http://localhost:3000', credentials:true }));
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', rootrouter);


mongoose.connect(process.env.DB_CONNSTR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(_ => console.log('Connected to MockerDB'))
    .catch(e => console.log('Failed to connect to MockerDB: ', e));

const server = app.listen(5000).on('listening', () => { console.log('Listening to port 5000') });

//For port in used issue with nodemon
process.once('SIGHUP', function () {
    server.close(function () {
      process.kill(process.pid, 'SIGHUP')
    })
  });

module.exports = { app };