const express = require('express');
const Product = require('../models/product');
const Category = require('../models/category');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // Correct endpoint based on the region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(
                null,
                `${Date.now().toString()}-${file.originalname.split(' ').join('-')}`
            );
        },
    }),
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(
            file.originalname.split('.').pop().toLowerCase()
        );

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Error: File type not supported!');
    },
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
});

router.get('/', async (req, res) => {
    try {
        let filterBy = {};

        if (req.query.categories) {
            filterBy.category = { $in: req.query.categories.split(',') };
        }

        if (req.query.products) {
            filterBy.name = {
                $regex: new RegExp(req.query.products.split(','), 'i'),
            };
        }

        let products = await Product.find(filterBy).populate('category');

        if (!products.length)
            return res.status(500).send('There are no products!');

        if (req.query.pageSize && req.query.currPage) {
            const pageSize = +req.query.pageSize;
            const currPage = +req.query.currPage - 1;

            products = await Product.find(filterBy)
                .populate('category')
                .limit(pageSize)
                .skip(currPage * pageSize);
        }

        const pageCount = Math.ceil(
            (await Product.countDocuments(filterBy)) / req.query.pageSize
        );

        res.json({ products, pageCount: pageCount || 0 });
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

router.post('/', upload.single('image'), async (req, res) => {
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

    const imageUrl = req.file.location;
    console.log('imageUrl', imageUrl);

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${imageUrl}`,
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

router.put('/:id', upload.single('image'), async (req, res) => {
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
            imagePath = file.location;
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
    upload.array('images', 7),
    async (req, res) => {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).send('No images in the request!');
            }

            const imagesPaths = files.map((file) => file.location);

            // Update a product with images urls
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

router.get('/get/statistics', async (req, res) => {
    try {
        const products = await Product.find().populate('category');

        if (!products.length) return 'There are no products';

        const productsMap = {};

        products.forEach((product) => {
            if (!productsMap[product.category.name.toLowerCase()]) {
                productsMap[product.category.name.toLowerCase()] = {
                    count: 0,
                    categoryColor: product.category.color,
                };
            }

            productsMap[product.category.name.toLowerCase()].count += 1;
        });

        res.status(200).json(productsMap);
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
});

module.exports = router;
