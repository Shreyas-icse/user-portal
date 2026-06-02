import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer className="custom-footer">
        <div className="footer-container">
          {/* Brand */}
          <div>
            <h2 className="brand">Service Hire</h2>
            <p className="desc">
              Connecting skilled workers with those in need—quickly, reliably, and locally.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="heading">Services</h3>
            <ul>
              <li><a href="/services/plumbing">Plumbing</a></li>
              <li><a href="/services/electrical">Electrical</a></li>
              <li><a href="/services/cleaning">Cleaning</a></li>
              <li><a href="/services/carpentry">Carpentry</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading">Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/hire">Hire Now</a></li>
              <li><a href="/terms">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading">Contact Us</h3>
            <p>Email: support@servicehire.com</p>
            <p>Phone: +91 9347894403</p>
            <div className="social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2025 BlueJobs. All rights reserved.
        </div>
      </footer>

      {/* CSS styles */}
      <style jsx="true">{`
        .custom-footer {
          background-color: #111827;
          color: #d1d5db;
          padding: 2.5rem 1rem;
        }

        .footer-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: auto;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .desc {
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .heading {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fff;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          margin-bottom: 0.5rem;
        }

        a {
          text-decoration: none;
          color: #d1d5db;
        }

        a:hover {
          color: #3b82f6;
        }

        .social {
          display: flex;
          gap: 1rem;
          font-size: 1.25rem;
          margin-top: 1rem;
        }

        .footer-bottom {
          text-align: center;
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
};

export default Footer;
