//创建web服务器，托管静态资源到public目录，在public目录下创建user_reg.html
const express=require('express');
//引入用户路由器
const userRouter=require('./routes/user.js');
const productRouter=require('./routes/product.js');
//引入body-parser中间件模块
const bodyParser=require('body-parser');
var app=express();
app.listen(8080);

//使用body-parser中间件,将post请求的数据解析为对象
app.use(bodyParser.urlencoded({
	extended:false
}));
//托管静态资源到public目录
app.use(express.static('./public'));
//使用路由器，挂载到/user下
//使用路由器，挂载到/product下
app.use('/user',userRouter);
app.use('/product',productRouter);