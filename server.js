const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config');
mongoose.connect('mongodb://bit:bit@ds227110.mlab.com:27110/ratings');

const app = express();
var routes = require('./routes/api');

require('./middlewares/checkjwt');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));

const port = process.env.PORT || 8080;
app.use(cors());
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.redirect('/');
});﻿
app.listen(port,() =>{
	console.log("server started " + config.port);
});
