const express = require('express');
const jwt = require('jsonwebtoken');
var UserSchema = require('../model/user');

var router = express.Router();

router.post('/login', function (req, res) {
    UserSchema.find({ username: req.body.username, password: req.body.password }, function (err, docs) {
        if (err) {
            res.json({ msg: 'error in finding user' })
        }
        else {
            if (docs.length == 1) {
                const token = jwt.sign({ sub: req.body.username }, process.env.SECRET || 'BHDWIRDLE',  { expiresIn: '7d' });
                res.status(200).json({ message: "Login success", loginSuccess: true, token })
            }
            else
                res.status(404).json({ message: "User not exists", loginSuccess: false });
        }
    })
})

module.exports = router;