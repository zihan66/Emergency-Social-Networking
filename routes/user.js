const express = require('express');
const mongoose = require('mongoose')
const { userSchema } = require('./db')
const resevedUsernameList = require('./reservedUsernameList')
const jwt = require('jsonwebtoken');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public')); // set static assets

// establish database connection
mongoose.connect('mongodb://localhost:27017/citizen')
// current user
const User = mongoose.model('User', userSchema);

// post user login page, given that the user already exists
app.post('/login', async function(req, res) {
    const user = req.body;
    console.log('req: POST /login', user);
    try {
        if (!user.username || !user.password) {
            res.status(200).send({ status: 'error', message: 'username or password is empty' });
            return;
        }
        if (user.username.length < 4) {
            res.status(200).send({ status: 'error', message: 'username too short, should be at least 4 characters long.' });
            return;
        }
        if (resevedUsernameList.includes(user.username)) {
            res.status(200).send({ status: 'error', message: 'username is reserved, please choose another one.' });
            return;
        }
        user.username = user.username.toLowerCase();
        const result = await User.findOne(user);
        if (result) {
            jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    res.status(200).send({ status: 'error', message: 'internal error' });
                    return;
                }
                res.status(200).send({ status: 'success', token: token });
            });
        } else {
            res.status(200).send({ status: 'error', message: 'username or password is wrong' });
        }
    } catch (e) {
        res.status(200).send({ status: 'error', message: e.message });
    }
})

// post user register page, given that the user is new
app.post('/register', async function(req, res) {
    const user = req.body;
    console.log('req: POST /register', user);
    try {
        if (!user.username || !user.password) {
            res.status(200).send({ status: 'error', message: 'username or password is empty' });
            return;
        }
        if (user.username.length < 4) {
            res.status(200).send({ status: 'error', message: 'username too short, should be at least 4 characters long.' });
            return;
        }
        if (resevedUsernameList.includes(user.username)) {
            res.status(200).send({ status: 'error', message: 'username is reserved, please choose another one.' });
            return;
        }
        if (user.password.length < 4) {
            res.status(200).send({ status: 'error', message: 'password too short, should be at least 4 characters long.' });
            return;
        }
        user.username = user.username.toLowerCase();
        const one = await User.find({ username: user.username });
        if (one.length > 0) {
            res.status(500).send({ status: 'error', message: 'username already exists' });
            return
        }
        const result = await User.create(user);
        res.status(200).send({ user: result });
    } catch (e) {
        res.status(500).send({ error: 'error' });
    }
})

app.get('/check', function(req, res) {
    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => {
        if (err) {
            res.status(200).send({ status: 'error', message: 'token is invalid' });
            return;
        }
        const expire = decoded.exp - Math.floor(Date.now() / 1000);
        if (expire < 0) {
            res.status(200).send({ status: 'error', message: 'token is expired' });
            return;
        }
        const user = User.findOne({ username: decoded.username });
        if (user) {
            res.status(200).send({ status: 'success', username: decoded.username });
        } else {
            res.status(200).send({ status: 'error', message: 'token is invalid' });
        }
    });
})

// listen port
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Listen at http://%s:%s", host, port)
})


