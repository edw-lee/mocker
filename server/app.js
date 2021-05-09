require('dotenv').config(); //This must be the first one to initialize to prevent dependency errors

const express = require('express');
const rootrouter = require('./routers/root');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

app.use(cors({ origin: 'http://localhost:3000', credentials:true }));
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For production
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', rootrouter);

mongoose.connect(process.env.DB_CONNSTR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(_ => console.log('Connected to MockerDB'))
    .catch(e => console.log('Failed to connect to MockerDB: ', e));

const server = app.listen(process.env.PORT).on('listening', () => { console.log(`Listening to port ${process.env.PORT}`) });

//For port in used issue with nodemon
process.once('SIGHUP', function () {
    server.close(function () {
      process.kill(process.pid, 'SIGHUP')
    })
  });

module.exports = { app };