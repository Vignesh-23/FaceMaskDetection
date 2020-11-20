const language = require('@google-cloud/language');
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
const projectId = 'thinking-return-284210'
const keyFilename = 'C:\\Users\\Dharun\\Desktop\\cloudcase\\thinking-return-284210-b22a024248b2.json'
const client = new language.LanguageServiceClient({ projectId, keyFilename });
async function predictor(text) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    const [result] = await client.analyzeSentiment({ document });
    console.log((result.documentSentiment.score + 1) * 50);
    return (result.documentSentiment.score + 1) * 50;

}
app.post('/predict', function (req, res) {
    let text = req.param('text')
    console.log(text);
    predictor(text).then(result => {
        res.status(200).end('<h1>Your rating: '+result.toFixed(2)+'%</h1>')
    }).catch(err => {
        res.status(500).end('error occured - ' + err)
    })
})


app.listen(3000, () => console.log('Listening to port 3000'))



