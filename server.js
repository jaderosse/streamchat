var express = require('express');
var fs = require('fs');
var path = require('path');
var pug = require('pug');
var http = require('http');
var url = require('url');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/vid', function(req, res){
	var range = req.headers.range;
	var stat = fs.statSync('sample_video.mp4', function(err, stats){
		if(err){
			console.log('error', err);
			if(err.code === 'ENOENT'){
				res.status(404);
			}
		}
	});
	var fileSize = stat.size;
	if(!range){
		console.log('no range');
		var head = {
			"Content-Length": fileSize,
			"Content-Type": "video/mp4"
		}
		res.writeHead(200, head);
		fs.createReadStream('sample_video.mp4').pipe(res);
	} else {
		console.log('else like there is range');
		var positions = range.replace(/bytes=/, "").split("-");
		var file = fs.createReadStream('sample_video.mp4', {start, end});
		var start = parseInt(positions[0], 10);
		var end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
		var chunkSize = (end-start)+1;
		var head = {
			"Content-Range": "bytes " + start + "-" + end + "/" + fileSize,
			"Accept-Ranges": "bytes",
	        "Content-Length": chunkSize,
	        "Content-Type": "video/mp4"
	    }
	    res.writeHead(206, head);
	    file.pipe(res);
	}
});

app.listen(3000);