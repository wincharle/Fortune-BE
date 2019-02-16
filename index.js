var path = require('path');
var express = require('express');
var config = require('./config');
var db = require('./mongodb/db');
var chalk = require('chalk');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var formidable = require('express-formidable');
var logger = require('./util/logger');
var config = require('./config');


var app = express();


// 路由相关
var userRouter = require('./routers/user-router');
var userManageRouter = require('./routers/user-manage-router');
var categoryRouter = require('./routers/category-router');
var productManageRouter = require('./routers/product-manage-router');
var productRouter = require('./routers/product-router');
var cartRouter = require('./routers/cart-router');
var shippingRouter = require('./routers/shipping-router');
var orderRouter = require('./routers/order-router');
var orderManageRouter = require('./routers/order-manage-router');
// 设置头文件
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    next();
})

// cookie
app.use(cookieParser());

// 设置session
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge,
        httpOnly: true
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use(formidable({
    uploadDir: path.join(__dirname, 'upload'),
    keepExtensions: true,
    multiples: true
}))


app.use('/user', userRouter);
app.use('/manage/user', userManageRouter)
app.use('/manage/category', categoryRouter);
app.use('/manage/product', productManageRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/shipping', shippingRouter);
app.use('/order', orderRouter);
app.use('/manage/order', orderManageRouter);

app.use('/static', express.static('./public'));

if (config.debug) {
    app.use(function(err, req, res, next){
        console.error(chalk.bold.red(err.stack));
        res.status(500).send('something broke!');
    });
  } else {
    app.use(function (err, req, res, next) {
      logger.error(err);
    });
  }
app.listen(config.port, () => {
    console.log(chalk.green('成功监听端口' + config.port));
});