const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const OrderItem = require('../models/order-item');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .populate('user')
            .sort({ dateOrdered: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .populate('user');

        if (!order) {
            return res.status(500).send('The order was not found!');
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/user-orders/:userId', async (req, res) => {
    try {
        const userOrders = await Order.find({ user: req.params.userId })
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .populate('user')
            .sort({ dateOrdered: -1 });

        if (!userOrders) {
            return res
                .status(500)
                .send(`There are no orders for ${req.params.userId}`);
        }

        res.send(userOrders);
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/total-sales', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);

        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated!');
        }

        if (totalSales.length) {
            res.send({ totalSales: totalSales[0].totalSales });
        } else {
            res.send({ totalSales: 0 });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments();

        res.send({ ordersCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.post('/', async (req, res) => {
    const orderItemsPrms = req.body.orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
        });

        const createdNewOrderItem = await newOrderItem.save();

        return createdNewOrderItem._id;
    });

    const orderItemsIds = await Promise.all(orderItemsPrms);

    // Calculate total price of order
    const totalPrices = await Promise.all(
        orderItemsIds.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate(
                'product',
                'price'
            );

            const orderItemPrice = orderItem.quantity * orderItem.product.price;

            return orderItemPrice;
        })
    );

    // Get sum of order items prices
    const totalPrice = totalPrices.reduce(
        (acc, totalPrice) => acc + totalPrice,
        0
    );

    const order = await new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice,
        user: req.body.user,
    }).populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
    });

    try {
        const createdOrder = await order.save();

        const populatedCreatedOrder = await createdOrder.populate('user');
        res.status(201).json(populatedCreatedOrder);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const orderToUpdate = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            { new: true }
        )
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .populate('user');

        if (!orderToUpdate) {
            return res.status(400).send('The order was not found!');
        }

        res.send(orderToUpdate);
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            })
            .populate('user');

        if (!deletedOrder) {
            return res.status(404).send('The order was not found!');
        } else {
            // Delete orderItems of the order
            for (const orderItem of deletedOrder.orderItems) {
                await OrderItem.findByIdAndDelete(orderItem._id);
            }

            res.send(deletedOrder);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

router.get('/get/statistics', async (req, res) => {
    try {
        const orders = await Order.find({
            dateOrdered: {
                $gte: new Date(`${req.query.dateOrdered}-01-01T00:00:00.000Z`),
                $lte: new Date(`${req.query.dateOrdered}-12-31T23:59:59.999Z`),
            },
        });
        console.log('orders', orders);

        const ordersMap = {};
        const years = [];

        if (orders) {
            orders.forEach((order) => {
                if (!ordersMap[order.dateOrdered.getMonth() + 1]) {
                    ordersMap[order.dateOrdered.getMonth() + 1] = 0;
                }

                ordersMap[order.dateOrdered.getMonth() + 1] += 1;

                if (!years.includes(order.dateOrdered.getFullYear() + '')) {
                    years.push(order.dateOrdered.getFullYear() + '');
                }
            });

            res.json({ ordersMap, years });
        } else {
            res.json('There are no orders!');
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

module.exports = router;
