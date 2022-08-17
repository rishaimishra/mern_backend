const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);



//Routes
const productRoutes = require('./routers/products');
const userRoutes = require('./routers/users');
const orderRoutes = require('./routers/orders');
const categoryRoutes = require('./routers/categorys');
 


const api = process.env.API_URL;



app.use(`${api}/products`, productRoutes)
app.use(`${api}/users`, userRoutes)
app.use(`${api}/orders`, orderRoutes)
app.use(`${api}/categorys`, categoryRoutes)



mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    dbName: 'shop-database'
})
.then(()=>{
    console.log('Database connection is ready...');
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})