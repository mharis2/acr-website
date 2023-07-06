import React from 'react';
import './TestimonialCard.css'; // You can create this file to apply styles to your card

const TestimonialCard = ({ name, testimonial }) => {
    return (
        <div className="testimonial-card">
            <p className="testimonial-text">"{testimonial}"</p>
            <hr className="testimonial-divider" />
            <h4 className="testimonial-name">{name}</h4>
        </div>
    );
};

export default TestimonialCard;
