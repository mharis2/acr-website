// Navbar.js
import React, { useState } from 'react';
import './Navbar.css';


const Navbar = () => {
    const [open, setOpen] = useState(false);

    let menuClasses = ['hamburger-menu'];
    let navClasses = ['navbar-links'];
    if (open) {
        menuClasses.push('open');
        navClasses.push('open');
    }

    const handleMenuClick = () => {
        setOpen(!open);
    }

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            setOpen(false);
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <a href="#home" className="navbar-logo">ACR</a>
                <div className={menuClasses.join(" ")} onClick={handleMenuClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={navClasses.join(" ")}>
                    <li><a href="#home" onClick={handleLinkClick}>Home</a></li>
                    <li><a href="#about" onClick={handleLinkClick}>About</a></li>
                    <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
                    <li><a href="#portfolio" onClick={handleLinkClick}>Portfolio</a></li>
                    <li><a href="#testimonials" onClick={handleLinkClick}>Testimonials</a></li>
                    <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>
                    <li><a href="#career" onClick={handleLinkClick}>Careers</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
