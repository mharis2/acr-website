import React from 'react';
import { useState, useEffect } from 'react';
import './HomePage.css';
import ServiceCard from '../components/ServiceCard';
import Navbar from '../components/Navbar';
import heroImage from '../assets/house.png'; // Replace 'your-image-name.jpg' with the name of your image
import AboutSection from '../components/AboutSection';
import PortfolioSection from './PortfolioSection'
import TestimonialsSection from './TestimonialSection';
import QuoteRequestPage from './QuoteRequestPage';

const HomePage = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // Fetch services from backend
        const baseURL = process.env.REACT_APP_BASE_URL;
        fetch(`${baseURL}/services`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.json();
            })
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching services:', error));
    }, []);


    return (
        <div className="homepage">

            {/* Navbar */}
            <Navbar />

{/* Hero Section */}
<section id="home" className="hero-section">
    <div className="hero-text">
        <h1>Creating the blueprint for your success</h1>
        <p>Expert construction & renovation solutions</p>
        <a href="#contact" className="request-quote-button">Get started</a>
    </div>
    <div className="hero-image">
        <img src={heroImage} alt="Construction" />
    </div>
</section>
            <div className="section-divider"></div>
            <section id="services" className="services-section">
            {/* Services Section */}
            <div className="services-section">
            <h2>Transforming spaces with expert construction services</h2>
                <div className="services-grid">
                    {services.map(service => (
                        <ServiceCard
                            key={service.id}
                            icon={<img src={`${process.env.REACT_APP_BASE_URL}/images/${service.image}`} alt={service.name} />}
                            title={service.name}
                            description={service.description}
                        />
                    ))}
                </div>
            </div>
            </section>
            
            <div className="section-divider"></div>
            {/* About Us Section */}
            <section id="about" className="about-section">
                <AboutSection />
            </section>
            <div className="section-divider"></div>
   {/* Portfolio Section */}
<section id="portfolio" className="portfolio-section">
    <h2>Exquisite craftmanship in every project</h2> {/* Change this line with your chosen header */}
    <PortfolioSection />
</section>
            <div className="section-divider"></div>


            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <TestimonialsSection />
                {/* Testimonials content here */}
            </section>
            <div className="section-divider"></div>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <QuoteRequestPage />
                {/* Contact form here */}
            </section>

        </div>
    );
};

export default HomePage;
