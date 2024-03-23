const express = require('express');
const Category = require('../models/category');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: 'Category was not found!' });
        }

        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });

    category = await category.save();

    if (!category)
        return res.status(404).send('The category cannot be created!');

    res.status(200).send(category);
});

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).send('The category cannot be updated!');
        }

        res.status(200).send(category);
    } catch (err) {
        res.status(400).json({ success: false, message: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (deletedCategory) {
            return res.status(200).json(deletedCategory);
        } else {
            return res
                .status(404)
                .json({ success: false, message: 'Category was not found!' });
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
});

module.exports = router;
