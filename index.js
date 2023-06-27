const express = require('express')
const app = express()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

app.all('/', (req, res) => {
    console.log("Just got a request!", authToken, accountSid)
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)