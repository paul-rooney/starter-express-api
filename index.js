const express = require("express");
const app = express();
const cron = require("node-cron");
const twilio = require("twilio");
const querystring = require("querystring");
const { log } = require("console");

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

app.post("/scheduleSMS1", async (req, res) => {
    try {
        const messages = await (await fetch("https://stephenandkiana.wedding/guestlist/numbers.json")).json();

        if (!Array.isArray(messages)) {
            return res.status(400).send("Invalid messages format");
        }

        const sendPromises = messages.map(async (guest) => {
            const { name, number } = guest;
            const smsMessage =  `Hello ${name.split(" ")[1] === "&" ? `${name.split(" ")[0]} ${name.split(" ")[1]} ${name.split(" ")[2]}` : name.split(" ")[0]}! We are looking forward to seeing you in Reading next weekend: few drinks on Friday evening, wedding on Saturday, and a barbecue on Sunday hosted by Kiana’s parents. Only the Saturday event is obligatory.\n\nIf you would like to join us for the other events, could you please let us know by replying to this message at your earliest convenience so we can plan accordingly.\n\nStephen & Kiana.`;

            await sendSMS(smsMessage, number);

            return { name, number };
        });

        await Promise.all(sendPromises);

        res.status(200).send("SMS scheduled successfully");
    } catch (error) {
        console.error("Failed to process the request: ", error);
        res.status(500).send("Failed to process the request");
    }
});

app.post("/scheduleSMS2", async (req, res) => {
    try {
        const messages = await (await fetch("https://stephenandkiana.wedding/guestlist/numbers.json")).json();

        if (!Array.isArray(messages)) {
            return res.status(400).send("Invalid messages format");
        }

        const sendPromises = messages.map(async (guest) => {
            const { name, number } = guest;
            const smsMessage = "Can’t wait to see some of you this evening at The Market House. We have some space booked from 8pm, but feel free to come whenever suits. The bar has a few different food options for anyone who would like to grab something to eat while there.\n\nStephen & Kiana.";

            await sendSMS(smsMessage, number);

            return { name, number };
        });

        await Promise.all(sendPromises);

        res.status(200).send("SMS scheduled successfully");
    } catch (error) {
        console.error("Failed to process the request: ", error);
        res.status(500).send("Failed to process the request");
    }
});

app.post("/scheduleSMS3", async (req, res) => {
    try {
        const messages = await (await fetch("https://stephenandkiana.wedding/guestlist/numbers.json")).json();

        if (!Array.isArray(messages)) {
            return res.status(400).send("Invalid messages format");
        }

        const sendPromises = messages.map(async (guest) => {
            const { name, number } = guest;
            const smsMessage = `${name.split(" ")[1] === "&" ? `${name.split(" ")[0]} ${name.split(" ")[1]} ${name.split(" ")[2]}` : name.split(" ")[0]}, big day ahead… \n\nKey timings are:\n12:45pm - ceremony at Reading Town Hall, please arrive via the Clock Tower entrance;\n2pm - welcome drinks at Thames Lido (the Lido is 10 minutes walk from the Town Hall, but there is a taxi rank outside Town Hall if you don’t wish to walk);\n4pm - food served;\nMidnight - fin.\n\nCan’t wait to spend the day with you all!\nStephen & Kiana.`;

            await sendSMS(smsMessage, number);

            return { name, number };
        });

        await Promise.all(sendPromises);

        res.status(200).send("SMS scheduled successfully");
    } catch (error) {
        console.error("Failed to process the request: ", error);
        res.status(500).send("Failed to process the request");
    }
});

app.post("/scheduleSMS4", async (req, res) => {
    try {
        const messages = await (await fetch("https://stephenandkiana.wedding/guestlist/numbers.json")).json();

        if (!Array.isArray(messages)) {
            return res.status(400).send("Invalid messages format");
        }

        const sendPromises = messages.map(async (guest) => {
            const { name, number } = guest;
            const smsMessage = `Hi ${name.split(" ")[1] === "&" ? `${name.split(" ")[0]} ${name.split(" ")[1]} ${name.split(" ")[2]}` : name.split(" ")[0]}! No BBQ: Due to weather concerns Kiana’s parents will instead host a kebab lunch at the Persian Palace (2 Bridge St, RG8 8AA) on Sunday from 12pm.\n\nPlease let us know if you plan on attending.\n\nStephen & Kiana`

            await sendSMS(smsMessage, number);

            return { name, number };
        });

        await Promise.all(sendPromises);

        res.status(200).send("SMS scheduled successfully");
    } catch (error) {
        console.error("Failed to process the request: ", error);
        res.status(500).send("Failed to process the request");
    }
});

app.use(express.urlencoded());

app.post("/incoming", twilio.webhook({ validate: false }), async (req, res) => {
    try {
        const messageBody = req.body.Body;
        const fromNumber = req.body.From;

        console.log(`Received a message from ${fromNumber}: ${messageBody}`);

        await client.messages.create({ body: `${messageBody} \n\nfrom ${fromNumber}`, from: "+447476564117", to: "+447871645982" });

        console.log(`Sent a response to ${fromNumber}`);
        res.status(200).end();
    } catch (error) {
        console.error(`Failed to send a response: ${error}`);
        res.status(500).end();
    }
});

app.listen(process.env.PORT || 3000);
