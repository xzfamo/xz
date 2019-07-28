const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由对象
var router=express.Router();
//添加路由
//1.商品列表
router.get('/list',function(req,res){
	//获取get请求数据
	var obj=req.query;
	console.log(obj);
	//验证数据是否为空
	var pno=obj.pno;
	var count=obj.count;
	if(!pno) pno=1;
	if(!count) count=5;
	//转为整形
	pno=parseInt(pno);
	count=parseInt(count);
	var start=(pno-1)*count;
	//执行SQL语句
	pool.query('SELECT * FROM xz_laptop Limit ?,?',[start,count],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//2.商品详情
router.get('/detail',function(req,res){
	//获取get请求数据
	var obj=req.query;
	//验证数据是否为空
	if(!obj.lid){	
			res.send({code:401,msg:'lid required'});
	};
	//把数值转为整形
	//obj=parseInt(obj);
	//执行SQL语句
	pool.query('SELECT * FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//3.商品删除
router.get('/delete',function(req,res){
	//获取get请求数据
	var obj=req.qurey;
	//验证数据是否为空
	if(!obj.lid){
		res.send({code:401,msg:'商品编号为空'});	
	};
	//执行SQL语句
	pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
});
//4.商品添加
router.post('/add',function(req,res){
	//获取post请求数据
	var obj=req.query;
	//验证数据是否为空
	var i=400;
	for(var key in obj){
		i++;
		//console.log(key,obj[key]);
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_laptop VALUES ?',[obj],function(err,result){
		if(err) throw err;
		res.send( {code:200,msg:'add suc'});
	});
});
//导出路由器对象
module.exports=router;