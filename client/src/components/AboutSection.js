import React from 'react';
import './AboutSection.css';
import aboutImage from '../assets/house2.png'; // Replace with your about image

const AboutSection = () => {
    return (
        <section id="about" className="about-section">
            <h2>Foundation of craftsmanship in construction</h2>
            <div className="about-card">
                <div className="about-image">
                    <img src={aboutImage} alt="About ACR Construction" />
                </div>
                <div className="about-text">
                    <p>Founded in 2020 and based in Edmonton, ACR Construction and Renovation is steered by Mohamed Sobhi, a seasoned contractor with over a decade of experience in the construction industry.</p>
                    <p>At ACR, we specialize in an array of construction services catering to both small and large-scale residential projects. Our expertise encompasses interior renovations as well as comprehensive exterior work.</p>
                    <p>Our cornerstone is forging robust, enduring relationships with our clientele by delivering unmatched services. This commitment to excellence is evident through our extensive positive testimonials, a loyal client base, and a thriving referral network.</p>
                </div>
            </div>
        </section>
    );
};


export default AboutSection;
