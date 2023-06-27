const express = require("express");
const app = express();
const cron = require("node-cron");
const twilio = require("twilio");
const xml2js = require("xml2js");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(express.text({ type: "application/xml" }));

app.use((req, res, next) => {
    if (req.is("application/xml")) {
        xml2js
            .parseStringPromise(req.body)
            .then((parsedData) => {
                req.body = parsedData;
                next();
            })
            .catch((error) => {
                console.error("Failed to parse XML: ", error);
                res.status(400).end();
            });
    } else {
        next();
    }
});

app.use(express.json());

app.all("/", (req, res) => {
    console.log("Just got a request!");
    res.send("Yo!");
});

function sendSMS(message, to) {
    console.log("message", "=>", message, "to", "=>", to);
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
