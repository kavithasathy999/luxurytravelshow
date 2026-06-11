import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../Gallery/Modal';

function FooterThree() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const openModal = (imageSrc, event) => {
        event.preventDefault(); 
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const navigate = useNavigate();
    return (
        <footer className="footer-wrapper bg-theme footer-layout4 shape-mockup-wrap">
            <div className="widget-area">
                <div className="container">                 
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-3">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="col-auto">
                                        <div className="header-logo">
                                            <a
                                            href="#hero"
                                            className="logo-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById("hero")?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                                });
                                            }}
                                            >
                                            <img src="/assets/img/normal/logo152.png" alt="Luxury Travel Show" />
                                            <p className="text-white" style={{fontFamily: "'Montserrat', sans-serif"}}><span style={{ fontFamily: "'Montserrat', sans-serif", color: "#FFD700" }}>Luxury</span> Travel Show</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div className='mt-30'>
                                        <p className="about-text" style={{fontFamily: "'Montserrat', sans-serif", fontSize: "16px"}}>
                                           Connecting global travel brands, opportunities through an interactive platform.
                                           Creating meaningful travel connections through interactive and inspiring experiences.
                                        </p>
                                    </div>
                                    <div className="th-social">
                                        <Link to="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-facebook-f" />
                                        </Link>
                                        <Link to="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-x" />
                                        </Link>
                                        <Link to="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-linkedin-in" />
                                        </Link>
                                        <Link to="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-youtube" />
                                        </Link>
                                        <Link to="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-whatsapp" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Quick Links</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">                                      
                                        <li>
                                            <a
                                            href="/registrationForm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/registrationForm");
                                            }}
                                            >
                                            Exhibitor Registration
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                            href="/forvisitors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/forvisitors");
                                            }}
                                            >
                                            Visitor Registration
                                            </a>
                                        </li>                                 
                                        <li>
                                            <a
                                            href="/registrationForm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate("/registrationForm");
                                            }}
                                            >
                                            Stall Map
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Address</h3>
                                <div className="th-widget-contact">
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/phone.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <a
                                                    to="tel:+919894013338"
                                                    className="info-box_link"
                                                    style={{ color: "inherit", textDecoration: "none" }}
                                                    onMouseOver={(e) => e.target.style.color = "inherit"}
                                                    onMouseOut={(e) => e.target.style.color = "inherit"}
                                                >
                                                    +91 9894013338
                                                </a>
                                            </p>
                                            <p>
                                                <a
                                                    to="tel:+919244449449"
                                                    className="info-box_link"
                                                    style={{ color: "inherit", textDecoration: "none" }}
                                                    onMouseOver={(e) => e.target.style.color = "inherit"}
                                                    onMouseOut={(e) => e.target.style.color = "inherit"}
                                                >
                                                    +91 9244449449
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/envelope.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <a
                                                    to="/mailto:events@taac.org.in"
                                                    className="info-box_link"
                                                    style={{ color: "inherit", textDecoration: "none" }}
                                                    onMouseOver={(e) => e.target.style.color = "inherit"}
                                                    onMouseOut={(e) => e.target.style.color = "inherit"}
                                                >
                                                    events@taac.org.in
                                                </a>
                                            </p>
                                            <p>
                                                <a
                                                    to="/mailto:mailinfo@lts.com"
                                                    className="info-box_link"
                                                    style={{ color: "inherit", textDecoration: "none" }}
                                                    onMouseOver={(e) => e.target.style.color = "inherit"}
                                                    onMouseOut={(e) => e.target.style.color = "inherit"}
                                                >
                                                    mailinfo@lts.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/location-dot.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>Merlis Hotel, <br />Coimbatore</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="row justify-content-center align-items-center text-center">
                        <div className="col-md-12">
                            <p className="copyright-text">
                            Copyright 2026{" "}
                            <a
                                href="#hero"
                                onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("hero")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });
                                }}
                            >
                                Luxury Travel Show
                            </a>
                            . All Rights Reserved. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="shape-mockup jump d-none d-xxl-block"
                style={{ top: '15%', left: '0%' }}
            >
                <img src="/assets/img/shape/footer4-shape.png" alt="shape" />
            </div>
            <div
                className="shape-mockup d-none d-xxl-block"
                style={{ top: '30%', right: '0%' }}
            >
                <img src="/assets/img/shape/footer4-shape2.png" alt="shape" />
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </footer>
    )
}

export default FooterThree
