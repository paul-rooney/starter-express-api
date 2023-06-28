const express = require("express");
const app = express();
const cron = require("node-cron");
const twilio = require("twilio");
const querystring = require("querystring");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(express.json());

app.all("/", (req, res) => {
    console.log("Just got a request!");
    res.send("Yo!");
});

function sendSMS(message, to) {
    console.log("message", "=>", message, "to", "=>", to);
    return client.messages.create({ body: message, from: "+447476564117", to });
}

function scheduleSMS(scheduledTime, message, to) {
    cron.schedule(scheduledTime, () => {
        sendSMS(message, to);
    });
}

app.post("/scheduleSMS", async (req, res) => {
    try {
        const { scheduledTime, message, to } = req.body;
        console.log({ message, to });

        // scheduleSMS(scheduledTime, message, to);
        await sendSMS(message, to);

        res.status(200).send("SMS scheduled successfully");
    } catch (error) {
        console.error("Failed to process the request: ", error);
        res.status(500).send("Failed to process the request");
    }
});

app.post("/incoming", twilio.webhook({ validate: false }), async (req, res) => {
    try {
        const requestBody = querystring.parse(req.body);
        const messageBody = requestBody.Body;
        const fromNumber = requestBody.From;

        console.log(`Received a message from ${fromNumber}: ${messageBody}`);

        const responseMessage = "Thank you for your message!";

        await client.messages.create({ body: responseMessage, from: "+447476564117", to: "+447716610830" });

        console.log(`Sent a response to ${fromNumber}`);
        res.status(200).end();
    } catch (error) {
        console.error(`Failed to send a response: ${error}`);
        res.status(500).end();
    }
});

app.listen(process.env.PORT || 3000);
