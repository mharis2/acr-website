import React, { useState } from 'react';
import axios from 'axios';
import './CareerForm.css';

const CareerForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        resume: null,
        about: ''
    });
    const [message, setMessage] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            await axios.post(`${process.env.REACT_APP_BASE_URL}/career`, data);
            setMessage({ type: 'success', text: 'Your application has been sent!' });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                resume: null,
                about: ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong, please try again.' });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    return (
<div className="career-form">
<h2>Interested in working with us?</h2>
<h3>Fill out the form below and we'll get back to you as soon as we can</h3>
    {message && <div className={`message ${message.type}`}>{message.text}</div>}
    <form onSubmit={handleSubmit}>
        <div className="input-group">
            <div className="input-field">
                <label>First Name<span>*</span></label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="input-field">
                <label>Last Name<span>*</span></label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
            </div>
        </div>
        <div className="input-group">
            <div className="input-field">
                <label>Email<span>*</span></label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="input-field">
                <label>Phone Number<span>*</span></label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                />
            </div>
        </div>
        <div className="full-width-input-group">
            <label>Resume<span>*</span></label>
            <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                required
            />
            <label>Tell us a bit about your professional background</label>
            <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
            />
        </div>
        <button type="submit">Submit</button>
    </form>
</div>

    );
};

export default CareerForm;
