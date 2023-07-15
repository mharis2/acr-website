const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');

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
    storage: multer.diskStorage({
        destination: '/tmp/',
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
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
            subject: 'ACR Career Application',
            html: `
                <h1 style="font-family: Arial, sans-serif; color: #333;">New ACR Career Application</h1>
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
                            <td style="border: 1px solid #ddd; padding: 8px;">${req.body.firstName}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <td style="border: 1px solid #ddd; padding: 8px;">Last Name</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${req.body.lastName}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${req.body.email}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <td style="border: 1px solid #ddd; padding: 8px;">Phone Number</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${req.body.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">About</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${req.body.about}</td>
                        </tr>
                    </tbody>
                </table>
            `,
            attachments: [{
                filename: req.file.originalname,
                content: fileBuffer,
            }],
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
        const blob = bucket.file(req.file.filename);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            console.error('Error uploading file to Google Cloud Storage:', err);
            return res.status(500).json({message: 'Error uploading file.'});
        });

        blobStream.on('finish', async () => {
            // The file upload is complete
            console.log('File upload to Google Cloud Storage complete.');

            // Download file from GCS to local
            const filePath = '/tmp/' + req.file.filename;
            await storage.bucket(bucket.name).file(blob.name).download({ destination: filePath });

            // Read file into buffer for attachment
            const fileBuffer = fs.readFileSync(filePath);

            // Now you can send the email with the attached file
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
                subject: `ACR Career Application - ${req.body.firstName} ${req.body.lastName}`,
                html: `
                    <h1 style="font-family: Arial, sans-serif; color: #333;">New ACR Career Application</h1>
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
                                <td style="border: 1px solid #ddd; padding: 8px;">${req.body.firstName}</td>
                            </tr>
                            <tr style="background-color: #f2f2f2;">
                                <td style="border: 1px solid #ddd; padding: 8px;">Last Name</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${req.body.lastName}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${req.body.email}</td>
                            </tr>
                            <tr style="background-color: #f2f2f2;">
                                <td style="border: 1px solid #ddd; padding: 8px;">Phone Number</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${req.body.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">About</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${req.body.about}</td>
                            </tr>
                        </tbody>
                    </table>
                `,
                attachments: [{
                    filename: req.file.originalname,
                    content: fileBuffer,
                }],
                priority: 'high',
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({message: 'Error sending email'});
                } else {
                    console.log('Email sent: ' + info.response);

                    // Delete file from local after email has been sent
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Failed to delete local file:', err);
                        } else {
                            console.log('Local file deleted');
                        }
                    });

                    res.json({message: 'Email sent successfully'});
                }
            });
        });

        fs.createReadStream('/tmp/' + req.file.filename).pipe(blobStream);
    } catch (err) {
        console.error('Error handling career form submission:', err);
        res.status(500).json({message: 'Error processing form.'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});