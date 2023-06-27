const express = require("express");
const app = express();
const cron = require("node-cron");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(express.json());

// app.all("/", (req, res) => {
//     console.log("Just got a request!");
//     // res.send("Yo!");

//     client.messages
//         .create({ body: "Hey Paul!", from: "+447476564117", to: "+447716610830" })
//         .then((message) => console.log(message.sid))
//         .done();
// });

function sendSMS(message, to) {
    client.messages
        .create({ body: message, from: "+447476564117", to })
        .then((message) => console.log(`Message send to ${to}: ${message.sid}`))
        .catch((error) => console.error(`Failed to end message to ${to}: ${error}`));
}

function scheduleSMS(scheduledTime, message, to) {
    cron.schedule(scheduledTime, () => {
        sendSMS(message, to);
    });
}

app.post("/scheduleSMS", (req, res) => {
    const { scheduledTime, message, to } = req.body;

    console.log(scheduledTime, message, to);
    // scheduleSMS(scheduledTime, message, to);
    sendSMS(message, to);

    res.status(200).send("SMS scheduled successfully");
});

app.listen(process.env.PORT || 3000);
