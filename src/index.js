const express = require('express');
require('./db/mongoose')


const userrouter = require('./routers/user');
const productrouter = require('./routers/product');
const producttyperouter = require('./routers/productType');
const commentrouter = require('./routers/comment');

const app = express();

const port = process.env.PORT || 3000


app.use(express.json());
app.use(userrouter);
app.use(productrouter);
app.use(producttyperouter);
app.use(commentrouter);



app.listen(port,() => {
    console.log('server is up on port ',port)
})

