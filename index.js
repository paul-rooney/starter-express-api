const express = require('express')
const app = express()

const authToken = process.env.authToken;

app.all('/', (req, res) => {
    console.log("Just got a request!", authToken)
    res.send('Yo!', authToken)
})
app.listen(process.env.PORT || 3000)