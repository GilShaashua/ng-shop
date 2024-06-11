const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');
const path = require('path');

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
app.use(
    '/public/uploads',
    express.static(path.join(__dirname, '/public/uploads'))
);

app.use(errorHandler);

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

runServer();

async function runServer() {
    const PORT = process.env.PORT || 3000;

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'e-commerce',
        });
        console.log('Database connection is ready!');
        app.listen(PORT, () => {
            if (!process.env.NODE_ENV) {
                console.log(`Server is running at http://localhost:${PORT}`);
            } else {
                console.log(
                    `Server is running at https://ng-shop-mexf.onrender.com:${PORT}`
                );
            }
        });
    } catch (err) {
        console.error('Database connection is failed!');
    }
}
