const express = require('express');
const passport = require('passport');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt=require('jsonwebtoken');
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const user = req.user;

        const data = {
            user: {
                id: user.id
            }
        }
        const userToken = jwt.sign(data, JWT_SECRET);
        res.redirect(`http://localhost:3000/login/success?token=${userToken}`);

    }
);

module.exports = router;
