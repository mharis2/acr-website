const express = require('express');
const path = require('path');

const fs = require('fs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');


// Load environment variables
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './.env.production' });
} else {
    dotenv.config({ path: './.env.development' });
}

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Fetch testimonials
app.get('/testimonials', (req, res) => {
    fs.readFile('./data/testimonials.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data));
    });
});

// Fetch portfolio items
app.get('/portfolio', (req, res) => {
    fs.readFile('./data/portfolio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data));
    });
});

// Fetch services
app.get('/services', (req, res) => {
    fs.readFile('./data/services.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data));
    });
});

// Handle contact form submission
// Handle contact form submission
app.post('/contact', express.json(), (req, res) => {
    const { firstName, lastName, phoneNumber, email, service, description } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use the email service you are using, e.g. 'gmail'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'ACR Quote Request',
        html: `
            <h1 style="font-family: Arial, sans-serif; color: #333;">New ACR Quote Request</h1>
            <table style="font-family: Arial, sans-serif; border-collapse: collapse; width: 100%;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Detail</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">First Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${firstName}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Last Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${lastName}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Phone Number</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Service</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${service}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Description</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${description}</td>
                    </tr>
                </tbody>
            </table>
        `,
        priority: 'high',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
});
// similar to the above do one for /career using first name, last name, email, phone number, resume, and about
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // uploads directory should exist

app.post('/career', upload.single('resume'), (req, res) => {
    const { firstName, lastName, phoneNumber, email, about } = req.body;

    const resumeFile = req.file; // This is your uploaded resume file

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'ACR Career Request',
        html: `
            <h1 style="font-family: Arial, sans-serif; color: #333;">New ACR Career Request</h1>
            <table style="font-family: Arial, sans-serif; border-collapse: collapse; width: 100%;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Detail</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">First Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${firstName}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Last Name</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${lastName}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Phone Number</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Resume</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">Attached</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <td style="border: 1px solid #ddd; padding: 8px;">About</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${about}</td>
                    </tr>
                </tbody>
            </table>
        `,
        attachments: [
            {
                filename: resumeFile.originalname,
                path: resumeFile.path,
            }
        ],
        priority: 'high',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
