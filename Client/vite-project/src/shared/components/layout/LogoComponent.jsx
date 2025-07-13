import React from 'react';
import logo from '../../../assets/logo.png';
import '../../../assets/styles/Logo.css';

export const LogoComponent = () => {
    return (
        <img 
            src={logo} 
            alt="ByteLock Logo" 
            className="logo-image"
        />
    )
} 