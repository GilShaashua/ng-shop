const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Category = require('../models/category');

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res
                .status(500)
                .json({ message: 'The user with the given ID was not found!' });
        }

        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const usersCount = await User.countDocuments();

        res.status(200).send({ usersCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.post('/register', async (req, res) => {
    const user = new User(
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    );

    try {
        const createdUser = await user.save();
        res.status(201).json(createdUser);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false,
        });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET;

    if (!user) {
        return res.status(400).send('The user was not found!');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            secret,
            {
                expiresIn: '1d',
            }
        );

        res.status(200).send({ user: user.email, token });
    } else {
        res.status(400).send('Password is wrong!');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await Product.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            return res.status(200).json({
                success: true,
                message: 'The user has been removed!',
            });
        } else {
            return res
                .status(404)
                .json({ success: false, message: 'User was not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
});

router.put('/:id', async (req, res) => {
    let newPassword;

    try {
        const existUser = await User.findById(req.params.id);

        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = existUser.passwordHash;
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },
            { new: true }
        );

        if (!user) {
            return res.status(500).send('The user was not found!');
        }

        res.status(200).send(user);
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
});

module.exports = router;
