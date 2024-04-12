const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');

const api = process.env.API_URL;

const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');

app.use(cors());
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

runServer();

async function runServer() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'e-commerce',
        });
        console.log('Database connection is ready!');
        app.listen(3000, () => {
            console.log('Server is running at http://localhost:3000');
        });
    } catch (err) {
        console.error('Database connection is failed!');
    }
}
