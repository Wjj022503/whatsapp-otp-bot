const { Client } = require('whatsapp-web.js');
const { Puppeteer } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    puppeteer: {
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process", 
            "--disable-gpu"
        ],
        headless: true
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.initialize();

app.post('/send', async (req, res) => {
    const { phone, message } = req.body;

    try {
        await client.sendMessage(`${phone}@c.us`, message);
        res.send('✅ Message sent successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Failed to send message.');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('API server running');
});