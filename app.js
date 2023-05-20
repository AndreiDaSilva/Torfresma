const express = require('express');
const app = express();

const rotaUser = require('./routes/user');
const rotaPost = require('./routes/posts');

app.use('/user', rotaUser);
app.use('/post', rotaPost);

module.exports = app;