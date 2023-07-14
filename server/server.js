const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');

// Load environment variables
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './.env.production' });
} else {
    dotenv.config({ path: './.env.development' });
}

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Initialize Google Cloud Storage client
const storage = new Storage();
const bucket = storage.bucket('acr_media_bucket');

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

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
// similar to the above do one for /career using first name, lgast name, email, phone number, resume, and about


app.post('/career', upload.single('resume'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({message: 'No file uploaded.'});
    }

    try {
        // Create a new blob in the bucket and upload the file data
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            console.error('Error uploading file to Google Cloud Storage:', err);
            return res.status(500).json({message: 'Error uploading file.'});
        });

        blobStream.on('finish', async () => {
            // The file upload is complete
            console.log('File upload to Google Cloud Storage complete.');

            // Now you can send the email with the link to the uploaded file
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            // The rest of your email sending code goes here, you can include publicUrl
            // in the email to provide a link to the uploaded file.

            // Here's an example:
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
                subject: 'ACR Career Application',
                html: `
                    <h1>New ACR Career Application</h1>
                    <p>Applicant Details:</p>
                    <p>First Name: ${req.body.firstName}</p>
                    <p>Last Name: ${req.body.lastName}</p>
                    <p>Email: ${req.body.email}</p>
                    <p>Phone: ${req.body.phone}</p>
                    <p>About: ${req.body.about}</p>
                    <p>Resume: <a href="${publicUrl}">Download</a></p>
                `,
                priority: 'high',
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({message: 'Error sending email'});
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({message: 'Email sent successfully'});
                }
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        console.error('Error handling career form submission:', err);
        res.status(500).json({message: 'Error processing form.'});
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
