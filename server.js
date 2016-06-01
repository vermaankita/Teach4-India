var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var fs = require('fs');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'teachindia_db'
});
connection.connect();




app.use(express.static(path.join(__dirname , './')));


 

app.get('/registration_process', function (req, res) {

   // Prepare output in JSON format
   
       var sid = req.query.schoolid;
       var fellow_name = req.query.fellowname;
       var password = req.query.password;
       var program_manager = req.query.pmanager;	   
   
   
   var post = {password:password, schoolId: sid, fellowName: fellow_name, programManager: program_manager};
connection.query('insert into fellowinfo set ?', post, function(err, rows,  fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

res.statusCode = 302; 
    res.setHeader("Location", "/LoginPage.html");
    res.end();
  
})


app.get('/login_process', function (req, res) {

   // Prepare output in JSON format
   
       var fid = req.query.fellowid;
       var password = req.query.password;
	   
	   global.fellowId = fid;
       
   
var queryString = 'select * from fellowinfo where fellowId = ' +fid + ' and password = '+ password;
 
   
connection.query(queryString,  function(err, rows, results) {
  if (err) 
  {
  throw err;
  console.log('Error while performing Query.');
  }
  else
  {
   
    console.log('Reesult : ' + rows.length);
	if(rows.length > 0)
	{
	  res.statusCode = 302; 
    res.setHeader("Location", "/FellowPage.html");
    res.end();
	}
	else
	{
	 res.statusCode = 302; 
    res.setHeader("Location", "/LoginPage.html");
    res.end();
	}

  }
  
 
});

  
})

app.get('/student_process', function (req, res) {

   // Prepare output in JSON format
   
       var fid = global.fellowId;
       var sname = req.query.studentName;
       var standard = req.query.standard;
       var age = req.query.age;
       var gender = req.query.gender;	
       var attendance = req.query.attendance;
       var pti = req.query.pti;	   
   
   
   var post = {fellowId : fid, studentName : sname, standard : standard, age : age, gender : gender, attendance : attendance, parentInteraction : pti};
connection.query('insert into studentinfo set ?', post, function(err, rows,  fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

res.statusCode = 302; 
    res.setHeader("Location", "/StudentDetails.html");
    res.end();
  
})

app.get('/data_display', function (req, res) {
console.log('huhuhuhuhuh');
   // Prepare output in JSON format
   
var queryString = 'select * from studentinfo';
var data = ""; 
   
connection.query(queryString,  function(err, rows, results) {

   for(var i in rows)
   {
     data = rows[i];
	 
	 var app = http.createServer(function(req,res){

res.statusCode = 302; 
    res.setHeader("Location", "/test.html");
    res.end();
	
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
});
   }
 
});   
   

   
   
 
  
 
});
       
   
   


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port


  console.log("Example app listening at http://%s:%s", host, port)

})