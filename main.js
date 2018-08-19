var http=require("http");
var express=require("express");
var bodyParser=require("body-parser");
var mysql=require("mysql");

var app=express();
var server=http.createServer(app);

app.use(express.static(__dirname+"/views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

var pool=mysql.createPool({
	host:"localhost",
	user:"root",
	password:"",
	database:"cocat"
});

app.post("/map/regist", function(request, response){
	console.log(request.body);
	var lat=request.body.lat;
	var lng=request.body.lng;
	var msg=request.body.msg;
	var icon=request.body.icon;

	pool.getConnection(function(error, con){
		con.beginTransaction(function(err){
			
			var sql="insert into area(lat, lng, msg, icon) values(?,?,?,?)";

			con.query(sql,[lat, lng,msg, icon], function(e1, result){
				if(e1){
					console.log(e1);
				}else{
					console.log(result);
					response.writeHead(200,{"Content-Type":"text/json"});
					response.end("{\"msg\":\"등록완료\"}");

					con.commit(function(e){
						if(e)console.log("커밋 실패",e);
						console.log("트랜잭션 완료");					
					});
				}
				con.release();
			});

		});
	});
});


//지역 목록보기 
app.get("/map/list", function(request, response){
	pool.getConnection(function(error, con){
		if(error){
			console.log(error);
		}else{
			var sql="select * from area order by area_id asc";
			con.query(sql, function(err, result, fields){
				if(err){
					console.log(err);
				}else{
					console.log(result);
					response.render("map/map", {
						rows:result
					});
				}
			});
		}
	});	
});

server.listen(7777, function(){
	console.log("웹서버가 7777포트에서 가동중입니다...");
});