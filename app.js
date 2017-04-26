var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var uuid = require('uuid');
var file_name="";
var request = require('request');
var json_body = "";
var u_id="";
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

var PythonShell = require('python-shell');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


//Trying Python script nltk
app.get('/shell', function(req, res){
  var options = {
  mode: 'text',
  pythonPath: 'python',
  pythonOptions: ['-u'],
  scriptPath: '',
  args: ['a woman riding a motorcycle on a city street']
};

PythonShell.run('find_verb.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});


  res.send("Done");
});


app.get('/download', function(req, res){
    console.log(req.query);
  var file = __dirname + '/uploads/'+req.query['img'];
  res.download(file); // Set disposition and send it.
});

app.get('/captionver', function(req, res){
    console.log("INSIDE CAPTION");


var options = {
    url: 'http://107.170.13.206:5000/caption/' + req.query['u_id']
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
var caption = JSON.parse(body)['caption'];
console.log(caption);
wordpos.getVerbs(caption, function(result){
    console.log(result);
res.send([result,caption]);
});

    }
}

request(options, callback);  
  
});

app.get('/captionnou', function(req, res){
    console.log("INSIDE CAPTION");


var options = {
    url: 'http://107.170.13.206:5000/caption/' + req.query['u_id']
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var caption = JSON.parse(body)['caption'];
console.log(caption);

wordpos.getNouns(caption, function(result){
    console.log(result);
res.send([result,caption]);
});

    }
}

request(options, callback);  
  
});


app.get('/captionadj', function(req, res){
    console.log("INSIDE CAPTION");


var options = {
    url: 'http://107.170.13.206:5000/caption/' + req.query['u_id']
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var caption = JSON.parse(body)['caption'];
console.log(caption);

wordpos.getAdjectives(caption, function(result){
    console.log(result);
res.send([result,caption]);
});

    }
}

request(options, callback);  
  
});

app.get('/calculate', function(req, res){
  // res.send("img is set to " + req.params.imgID);
  console.log("reached Caluclate");
  console.log(req.query);
  var file = __dirname + '/uploads/'+req.query['img'];
  // res.download(file); // Set disposition and send it.



var dataString = '{"url":"http://107.170.13.206:3000/uploads/'  +  req.query['img']  +  '"}';
console.log(dataString);
var urlString = 'http://107.170.13.206:3000/uploads/'+req.query['img'];
console.log(urlString);
var options = {
    url: 'http://107.170.13.206:5000/addURL',
    method: 'POST',
    json: JSON.parse(dataString)
};

function callback(error, response, body) {
  console.log("Inside callback");
  console.log(error);
    if (!error && response.statusCode == 200) {
        console.log(body);
       u_id = body['sha256sum'];
      console.log(u_id);
      res.render('second.html',{'param1Place':u_id,'img_name':req.query['img']});
    }
}

request(options, callback);

console.log("----------------");
console.log(u_id);
//res.render('second.html',{'param1Place':u_id});
});

// app.get('/calculate', function(req, res)){

// }

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  // console.log(uuid.v1());
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    file_name = file.name;
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end(file_name);
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
