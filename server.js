require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const paypal = require('@paypal/checkout-server-sdk');


const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PayPal Environment Configuration
let environment = new paypal.core.SandboxEnvironment('ASCeaS9qiFx4TJIjOVRttUrY30HPzSZf14WkLAOV4-onwLfpQ_fk87PAmNGVwDql_sFjzJLNidTVpbjQ',
    'EFdEMYTbD9fqY-JT7Zw8XmfOmMCon0UA40P5VmThuhndDMSHUj43CDLYSLgnu74a5PIqpKM9vQHOVEbz');
let client = new paypal.core.PayPalHttpClient(environment);

// Payment Processing Route
app.post('/create-order', async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '1.00' // Replace with the actual price
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.json({ orderId: order.result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile('script-coverage.html', { root: __dirname + '/public/pages' });
});

app.get('/script-coverage', (req, res) => {
    res.sendFile('script-coverage.html', { root: __dirname + '/public/pages' });
});

app.get('/about-me', (req, res) => {
    res.sendFile('about-me.html', { root: __dirname + '/public/pages' });
});

app.get('/contact-me', (req, res) => {
    res.sendFile('contact-me.html', { root: __dirname + '/public/pages' });
});

app.get('/script-coverage-payment', (req, res) => {
    res.sendFile('script-coverage-payment.html', { root: __dirname + '/public/pages' });
});

// Email Sending Route
app.post('/send-email', async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    let mailOptions = {
        from: '"Pill Films Contact Form" <your-email@gmail.com>',
        to: process.env.GMAIL_USER,
        subject: `New Contact from ${req.body.firstName} ${req.body.lastName}: ${req.body.subject}`,
        text: req.body.message,
        html: `<p>You have a new contact request from:</p>
               <p>Name: ${req.body.firstName} ${req.body.lastName}</p>
               <p>Email: ${req.body.email}</p>
               <p>Subject: ${req.body.subject}</p>
               <p>Message:</p>
               <p>${req.body.message}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Message sent:', info.messageId);
        res.status(200).send('Email successfully sent');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
