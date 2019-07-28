const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//获取post请求数据
	var obj=req.body
	console.log(obj);
	//验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		//阻止往后执行
		return;
	}else
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		//阻止往后执行
		return;
	}else
	if(!obj.email){
		res.send({code:403,msg:'email required'});
		//阻止往后执行
		return;
	}else
	if(!obj.phone){
		res.send({code:404,msg:'phone required'});
		//阻止往后执行
		return;
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
	if(err) throw err;
	console.log(result);
	//如果注册成功
	//{ code：200,msg:'register suc'}
	if(result.affectedRows>0){
		res.send({ code:200,msg:'register suc'});
	  }
	});
	//res.send('注册成功');	
});
//2.用户登录
router.post('/login',function(req,res){
	//2.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//2.2验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}else
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	//2.3执行SQL语句
	//查找用户和密码同时满足的数据
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err) throw err;
		//console.log(result);
		if(result.length>0){
			res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
		}
	});
	//res.send('登陆成功');
});
router.get('/detail',function(req,res){
	//3.1获取get请求数据
	var obj=req.query;
	//console.log(obj);
	//3.2验证数据是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uname required'});
		return;
	}
	//3.3执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		//console.log(result);
		//判断是否检索到用户，如果检索到，把该用户的对象检索到浏览器，否则响应检索不到
		if(result.length>0){
			res.send( result[0] );
		}else{
			res.send({code:301,msg:'can not found'});
		}
	});
	//res.send('检索成功');
});
router.get('/update',function(req,res){
	//4.1获取get请求数据
	var obj=req.query;
	//4.2验证数据是否为空
	//遍历对象，获取每个属性值
	var i=400;
	for(var key in obj){
		i++;
		//console.log(key,obj[key]);
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}	
	//4.3执行SQL语句
	pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
		if(err) throw err;
		//console.log(result);
		//判断是否修改成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'update suc'});
		}else{
			res.send({code:301,msg:'update err'});
		}
	});
	 //res.send('修改用户');
});

router.get('/list',function(req,res){
	//5.1获取get请求数据
	var obj=req.query;
	//5.2验证页码为空，默认值是1;,如果大小为空，默认值是3
	var pno=obj.pno;
	var size=obj.size;
	if(!pno) pno=1;
	if(!size) size=3;
	console.log(pno,size);
	//5.3把数值转整型
	pno=parseInt(pno);
	size=parseInt(size);
	//5.4计算开始查询的值
	var start=(pno-1)*size;
	//5.5执行SQL语句
	pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
router.get('/delete',function(req,res){
	//6.1获取get请求数据
	var obj=req.query;
	//6.2验证数据是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
	};
	//6.3把数值转整型
	//obj=parseInt(obj);
	//6.4执行SQL语句
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
		res.send({code:200,msg:'delete suc'});	
		}else{
		res.send({code:301,msg:'delete err'});	
		}
	});
});
//导出路由器对象
module.exports=router;




