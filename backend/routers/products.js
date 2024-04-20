const express = require('express');
const Product = require('../models/product');
const Category = require('../models/category');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type!');

        if (isValid) uploadError = null;

        cb(uploadError, 'public/uploads');
    },
    filename(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage });

router.get('/', async (req, res) => {
    try {
        let filterBy = {};

        if (req.query.categories) {
            filterBy = { category: req.query.categories.split(',') };
        }

        const products = await Product.find(filterBy).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category'
        );

        if (!product) {
            return res.status(500).send('Product doesnt exist!');
        }

        res.status(200).send(product);
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(400).send('Invalid category!');
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        });
    }

    if (!req.file) return res.status(400).send('No image in the request!');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    try {
        const createdProduct = await product.save();

        if (!createdProduct) {
            return res.status(500).send('The product cannot be created!');
        }

        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err,
        });
    }
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    let imagePath = null;

    try {
        const category = await Category.findById(req.body.category);

        if (!category) {
            return res.status(400).send('Invalid category!');
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(400).send('Invalid product!');

        const file = req.file;

        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagePath = `${basePath}${fileName}`;
        } else {
            imagePath = product.image;
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagePath,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        ).populate('category');

        if (!updatedProduct) {
            return res.status(500).send('The product was not found!');
        }
        res.status(200).send(updatedProduct);
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 7),
    async (req, res) => {
        try {
            let imagesPaths = [];

            const files = req.files;
            console.log('files', files);
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            if (files) {
                files.forEach((file) => {
                    imagesPaths.push(`${basePath}${file.filename}`);
                });
            } else {
                return res.status(500).send('No images in the request!');
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    images: imagesPaths,
                },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(500).send('The product cannot be updated!');
            }

            res.send(updatedProduct);
        } catch (err) {
            return res.status(500).json({ success: false, message: err });
        }
    }
);

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
            return res.status(200).json(deletedProduct);
        } else {
            return res
                .status(404)
                .json({ success: false, message: 'Product was not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const productsCount = await Product.countDocuments();

        if (!productsCount) {
            return res.status(500).send('There is no count!');
        }

        res.status(200).json({ productsCount });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error counting products',
        });
    }
});

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;

    try {
        const featuredProducts = await Product.find({ isFeatured: true }).limit(
            +count
        );

        if (!featuredProducts.length) {
            return res.status(500).send('There is no featured products!');
        }

        res.status(200).json(featuredProducts);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err,
        });
    }
});

module.exports = router;
