import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestimonialCard from '../components/TestimonialCard';
import './TestimonialSection.css';

const TestimonialSection = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/testimonials`);
                setTestimonials(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTestimonials();
    }, []);

    if (!testimonials.length) {
        return <div>Loading...</div>;
    }

    return (
        <section id="testimonials" className="testimonial-section">
            <h2 className="section-title">Hear from those whose spaces we've transformed</h2>
            <div className="testimonial-grid">
                {testimonials.map(testimonial => (
                    <TestimonialCard key={testimonial.id} name={testimonial.name} testimonial={testimonial.testimonial} />
                ))}
            </div>
        </section>
    );
};

export default TestimonialSection;
