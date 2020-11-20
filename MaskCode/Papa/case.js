
const location = 'us-central1';
const modelId = 'TCN5383193536428507136';
const language = require('@google-cloud/automl');
const express = require('express')
const app = express()
const projectId = 'praxis-study-294413'
const keyFilename = 'E:\\doc--\\cloud_case\\praxis-study-294413-19501e280eec.json'
app.use(express.urlencoded({ extended: true }))
const client = new language.PredictionServiceClient({ projectId, keyFilename });
async function predict(text) {
  const request = {
    name: client.modelPath(projectId, location, modelId),
    payload: {
      textSnippet: {
        content: text,
        mimeType: 'text/plain', 
      },
    },
  };

  const [response] = await client.predict(request);
  console.log(response);
  for (const annotationPayload of response.payload) {
    console.log(`Predicted class name: ${annotationPayload.displayName}`);
    console.log(
      `Predicted class score: ${annotationPayload.classification.score}`
    );
  }
  if(response.payload.length===0)
  {
    return 'cannot preddict';
  }
  else{
    return response.payload[0].displayName+'-'+response.payload[0].classification.score;
  }
}

app.post('/predict', function (req, res) {
    let text = req.param('text')
    console.log(text);
    predict(text).then(result => {
        res.status(200).end('<h1>Category: '+result+'</h1>')
    }).catch(err => {
        res.status(500).end('error:' + err)
    })
})

app.listen(3000)



