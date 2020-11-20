const express = require('express');
const app = express();
const multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
var str;

app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/detectimage', upload.single('picture'), (req, res) => {
    if(req.file) {
        var detectphoto = req.file.buffer.toString('base64');
        detectphoto = Buffer.from(detectphoto.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        client.textDetection(detectphoto).then( result =>{
            str=result[0].textAnnotations[0].description;
            console.log(str);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(str);
        });
    }else {
        res.writeHead(500,{'Content-Type':'text/plain'});
        res.end('invalid request');
    }
});

app.listen(3000);