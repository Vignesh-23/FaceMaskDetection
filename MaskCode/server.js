const express = require('express');
const app = express();
const multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });

const projectId = 'firm-mariner-284210';
const location = 'us-central1';
const modelId = 'ICN755463444328611840';
const filePath = 'E:\\PS\\vicky.jpg';

const {PredictionServiceClient} = require('@google-cloud/automl').v1;
const fs = require('fs');

const client = new PredictionServiceClient({keyFilename: "./firm-mariner-284210-0a71aa7f3ad6.json"});

app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/putImage', upload.single('picture'), (req, res) => {
  console.log('post method');
  if(req.file) {
      var content = req.file.buffer.toString('base64');
      content = Buffer.from(content.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      console.log(content);
      predict(content).then(result=>{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(result);
      }).catch(err=>{
        res.writeHead(500,{'Content-Type':'text/plain'});
        res.end('Error Occoured!'+err);
      });
      
  }else {
      res.writeHead(500,{'Content-Type':'text/plain'});
      res.end('invalid request');
  }
});



//const content = fs.readFileSync(filePath);

async function predict(content) 
{
  const request = {
    name: client.modelPath(projectId, location, modelId),
    payload: {
      image: {
        imageBytes: content,
      },
    },
  };
  

 try {
  var [response] = await client.predict(request);
 } 
 catch (error) {
 console.log(error);  
 throw error;
 }
 
 //var image = window.document.createElement('img');
 //image.src = 'data:image/jpeg;base64,' + buf.toString('base64');
 /*
 <script>
 var src = document.getElementById("image");
 src.appendChild(${img});
 </script>
 */

  //console.log(response);
  
  const annotationPayload = response.payload[0];
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detection Result</title>
        <link rel="stylesheet" href="response.css">
    </head>
    <body class="bg">
            <div class = "output">
              <b>The image is Predicted to be of class: ${annotationPayload.displayName} 
              </br>
              and class score was predicted to be: ${annotationPayload.classification.score}</b>
            </div>
            <a href='D:\\Sem5\\Cloud\\CaseStudy\\MaskCode\\index.html'>Test another image</a>
            
    </body>
    </html>
    
    <style>
    .bg {
      background-image: url("https://media.allure.com/photos/5e5fcdb369ab2d0009f20e55/16:9/w_2560%2Cc_limit/mask.jpg");
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 160%;
  }
  
  .output{
  
      font-size: 1.5em;
      font-family: cursive;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 40vh;
  
  }
  </style>
 `;
}

app.listen(8000);