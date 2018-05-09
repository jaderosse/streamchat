var express = require('express');
var fs = require('fs');
var path = require('path');
var pug = require('pug');
var app = express();

// var  = fs.createStreamSample(TearsOfSteel.mp4, {start, end});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/vid', function(req, res){
	var range = req.headers.range;
	var stat = fs.statSync('TearsOfSteel.mp4', function(err, stats){
		if(err){
			if(err.code === 'ENOENT'){
				res.status(404);
			}
		}
	});
	if(!range){
		res.status(416);
	}
	var fileSize = stat.size;
	var file = fs.createReadStream('TearsOfSteel.mp4', {start, end});
	var positions = range.replace(/bytes=/, "").split("-");
	var start = parsenInt(positions[0], 10);
	var end = positions[1] ? parsenInt(positions[1], 10) : fileSize - 1;
	var chunkSize = (end-start)+1;
	var head = {
		"Content-Range": "bytes " + start + "-" + end + "/" + total,
		"Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, head);
    file.pipe(res);
});

app.listen(3000);