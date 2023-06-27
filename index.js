const express = require("express");
const app = express();
const cron = require("node-cron");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(express.json());

app.all("/", (req, res) => {
    console.log("Just got a request!");
    // res.send("Yo!");

    // client.messages
    //     .create({ body: "Hey Paul!", from: "+447476564117", to: "+447716610830" })
    //     .then((message) => console.log(message.sid))
    //     .done();
    // sendSMS("Let's try this again...", "+447716610830")
});

function sendSMS(message, to) {
    client.messages
        .create({ body: message, from: "+447476564117", to })
        .then((message) => console.log(`Message sent to ${to}: ${message.sid}`))
        .catch((error) => console.error(`Failed to send message to ${to}: ${error}`));
}

function scheduleSMS(scheduledTime, message, to) {
    cron.schedule(scheduledTime, () => {
        sendSMS(message, to);
    });
}

// sendSMS("Here is your afternoon message!", "+447716610830");

app.post("/scheduleSMS", (req, res) => {
    const { scheduledTime, message, to } = req.body;

    console.log({ req, scheduledTime, message, to });
    // scheduleSMS(scheduledTime, message, to);
    sendSMS(message, to);

    res.status(200).send("SMS scheduled successfully");
});

app.post("/incoming", twilio.webhook({ validate: false }), (req, res) => {
    const messageBody = req.body.Body;
    const fromNumber = req.body.From;

    console.log(`Received a message from ${fromNumber}: ${messageBody}`);

    const responseMessage = "Thank you for your message!";

    client.messages
        .create({ body: responseMessage, from: "+447476564117", to: "+447716610830" })
        .then((message) => {
            console.log(`Sent a response to ${fromNumber}: ${message.sid}`);
            res.status(200).end();
        })
        .catch((error) => {
            console.error(`Failed to send a response to ${fromNumber}: ${error}`);
            res.status(500).end();
        });
});

app.listen(process.env.PORT || 3000);
