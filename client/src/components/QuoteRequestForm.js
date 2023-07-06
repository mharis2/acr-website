import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuoteRequestForm.css';

const QuoteRequestForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        service: '',
        description: ''
    });
    const [services, setServices] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/services`);
                setServices(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find the selected service title
            const selectedService = services.find(service => service.id === formData.service);

            // Append service title to formData
            const newFormData = {
                ...formData,
                service: selectedService ? selectedService.name : 'Other',
            };

            await axios.post(`${process.env.REACT_APP_BASE_URL}/contact`, newFormData);
            setMessage({ type: 'success', text: 'Your message has been sent!' });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                service: '',
                description: ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong, please try again.' });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };
    

    return (
<div className="quote-form">
    <h2>Request a quote today</h2>
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
            <label>Service<span>*</span></label>
            <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
            >
                <option value="">Select a Service</option>
                {services.map(service => (
                    <option key={service.id} value={service.id}>
                        {service.name}
                    </option>
                ))}
                <option value="other">Other</option>
            </select>
            <label>Please share any details</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
            />
        </div>
        <button type="submit">Send message</button>
    </form>
</div>

    );
};

export default QuoteRequestForm;
