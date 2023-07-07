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

const textMessages = [
    {
        scheduledTime: "30 10 7 7 *",
        // scheduledTime: "0 12 7 7 *",
        content:
            "Hello! We are looking forward to seeing you all in Reading next weekend: few drinks on Friday evening, wedding on Saturday, and a barbecue on Sunday hosted by Kiana’s parents. Only the Saturday event is obligatory.\n\nIf you would like to join us for the other events, could you please let us know by replying to this message at your earliest convenience so we can plan accordingly.\n\nStephen & Kiana.",
    },
    {
        scheduledTime: "32 10 7 7 *",
        // scheduledTime: "0 12 14 7 *",
        content: "Can’t wait to see some of you this evening at The Market House. We have some space booked from 8pm, but feel free to come whenever suits. The bar has a few different food options for anyone who would like to grab something to eat while there.\n\nStephen & Kiana.",
    },
    {
        scheduledTime: "34 10 7 7 *",
        // scheduledTime: "0 9 15 7 *",
        content: "Big day ahead… \n\nKey timings are:\n12:45pm - ceremony at Reading Town Hall, please arrive via the Clock Tower entrance;\n2pm - welcome drinks at Thames Lido (the Lido is 10 minutes walk from the Town Hall, but there is a taxi rank outside Town Hall if you don’t wish to walk);\n4pm - food served;\nMidnight - fin.\n\nCan’t wait to spend the day with you all!\nStephen & Kiana.",
    },
    {
        scheduledTime: "36 10 7 7 *",
        // scheduledTime: "0 9 16 7 *",
        content:
            "Good morning! Thanks for coming yesterday and making the day so special. For those planning to come to the barbecue, you are welcome to drop in and out anytime from midday. The address is 42 St. Anne’s Road, Caversham, RG4 7PA. For those unable to join, thanks again for being there yesterday and safe travels home!\n\nStephen & Kiana.",
    },
];

app.post("/scheduleSMS1", async (req, res) => {
    try {
        const messages = await (await fetch("https://stephenandkiana.wedding/guestlist/numbers.json")).json();

        if (!Array.isArray(messages)) {
            return res.status(400).send("Invalid messages format");
        }
        
        const sendPromises = messages.map(async (guest) => {
            const { name, number } = guest;
            const smsMessage = "Hello " + name.split(" ")[0] + "! We are looking forward to seeing you in Reading next weekend: few drinks on Friday evening, wedding on Saturday, and a barbecue on Sunday hosted by Kiana’s parents. Only the Saturday event is obligatory.\n\nIf you would like to join us for the other events, could you please let us know by replying to this message at your earliest convenience so we can plan accordingly.\n\nStephen & Kiana.";

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
            const smsMessage = name.split(" ")[0] + ", big day ahead… \n\nKey timings are:\n12:45pm - ceremony at Reading Town Hall, please arrive via the Clock Tower entrance;\n2pm - welcome drinks at Thames Lido (the Lido is 10 minutes walk from the Town Hall, but there is a taxi rank outside Town Hall if you don’t wish to walk);\n4pm - food served;\nMidnight - fin.\n\nCan’t wait to spend the day with you all!\nStephen & Kiana.";

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
            const smsMessage = "Good morning " + name.split(" ")[0] + "! Thanks for coming yesterday and making the day so special. For those planning to come to the barbecue, you are welcome to drop in and out any time from midday. The address is 42 St. Anne’s Road, Caversham, RG4 7PA. For those unable to join, thanks again for being there yesterday and safe travels home!\n\nStephen & Kiana.";

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

app.post("/incoming", twilio.webhook({ validate: false }), async (req, res) => {
    try {
        const requestBody = querystring.parse(req.body);
        const messageBody = requestBody.Body;
        const fromNumber = requestBody.From;

        console.log(`Received a message from ${fromNumber}: ${messageBody}`);

        const responseMessage = "Thank you for your message!";

        await client.messages.create({ body: responseMessage, from: "+447476564117", to: "+447871645982" });

        console.log(`Sent a response to ${fromNumber}`);
        res.status(200).end();
    } catch (error) {
        console.error(`Failed to send a response: ${error}`);
        res.status(500).end();
    }
});

app.listen(process.env.PORT || 3000);
