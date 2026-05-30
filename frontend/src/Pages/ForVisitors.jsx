import React, { useState, useEffect, useRef } from "react";
import HeaderFour from "../Components/Header/HeaderFour";
import FooterThree from "../Components/Footer/FooterThree";
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

function ForVisitors() {
  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    mobileNumber: "",
    designation: "",
    email: "",
    visitorType: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address1: "",
    address2: ""
  });
  const [loadingAction] = useState(false);

  const countryOptions = Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: c.name
  }));

  const stateOptions = selectedCountry ? State.getStatesOfCountry(selectedCountry).map(s => ({
        value: s.isoCode,
        label: s.name
      }))
    : [];

  const cityOptions = selectedState ? City.getCitiesOfState(selectedCountry, selectedState.value).map(c => ({
        value: c.name,
        label: c.name
      }))
    : [];

  const [settings, setSettings] = useState({
    event_title: "",
    venue: "",
    event_time: "",
  });

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "10px",
      borderColor: "#e0e0e0",
      boxShadow: "none",
      minHeight: "58px",
      height: "58px",          
      padding: "0 6px",        
      backgroundColor: "#f9f9f9",
      "&:hover": { borderColor: "#593983" }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px"         
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "52px"           
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#593983"
        : state.isFocused
        ? "#f3e0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333"
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === "firstName" || name === "lastName") {
      filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    }
    if (name === "companyName") {
      filteredValue = value.replace(/[^A-Za-z\s.&-]/g, "");
    }
    if (!formData.designation.trim()) {
      setErrors.designation = "Designation is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.designation)) {
      setErrors.designation = "Only alphabets are allowed";
    }
    if (!formData.visitorType) {
      setErrors.visitorType = "Visitor type is required";
    }
    if (!formData.country.trim()) {
      setErrors.country = "Country is required";
    }
    if (!formData.state.trim()) {
      setErrors.state = "State is required";
    }
    if (!formData.city.trim()) {
      setErrors.city = "City is required";
    }
    if (!formData.visitorType) {
      setErrors.visitorType = "Visitor type is required";
    }
    setFormData({
      ...formData,
      [name]: filteredValue
    });
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (file) {
        formDataToSend.append("file", file);
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/visitors/register`, {
          method: "POST",
          body: formDataToSend,
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Visitor Registered Successfully!");
          setFormData({
            firstName: "",
            lastName: "",
            companyName: "",
            mobileNumber: "91",
            designation: "",
            email: "",
            visitorType: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            address1: "",
            address2: "",
          });
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          } 
          setSelectedCountry(null);
          setSelectedState(null);
          setSelectedCity(null);
          setErrors({});
        } else {
          toast.error(data.error || "Registration failed");
        }
      } catch (error) {
        console.error("Connection Error:", error);
        toast.error("Could not connect to server");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/curated/list`)
      .then(res => res.json())
      .then(data => setDestinations(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setErrors({}); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    let isDown = false;
    let startX;
    let scrollLeft;
    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      slider.style.cursor = "grabbing"; 
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };
    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
      slider.style.cursor = "grab"; 
    };
    let animationFrame;

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      slider.scrollLeft = scrollLeft - walk;
    });
  };
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  const scrollRef = useRef(null);
  const scrollLeftHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: "smooth"
      });
    }
  };

  const scrollRightHandler = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth"
      });
    }
  };
  const formRef = useRef(null);

  const validate = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const companyRegex = /^[A-Za-z0-9\s.&-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Only alphabets allowed";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Only alphabets allowed";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (!companyRegex.test(formData.companyName)) {
      newErrors.companyName = "Invalid company name";
    }
    if (!isValidPhone(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter valid mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.visitorType) {
      newErrors.visitorType = "Visitor type is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    }
    if (!formData.address1.trim()) {
      newErrors.address1 = "Address Line 1 is required";
    }
    if (!file) {
      newErrors.file = "File is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const isValidPhone = (phone) => {
    if (!phone) return false;
    try {
      const cleaned = phone.replace(/\s/g, "");
      const phoneNumber = parsePhoneNumberFromString(cleaned);
      return phoneNumber ? phoneNumber.isValid() : false;
    } catch {
      return false;
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/visitor-settings`);
      if (res.data && res.data.event_title) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Setup required: Please fill in event details.");
    }
  };

  return (
    <section>
      <HeaderFour />
      <ToastContainer position="top-right" autoClose={1500} />
      <section className="our-visitors-section py-2" style={{marginTop: "100px"}}>
        <div className="container">
          <div className="row align-items-center g-5">
            {/* LEFT IMAGE */}
            <div className="col-lg-6">
              <div className="visitor-image-wrapper">
                <img
                  src="/assets/img/visitors/day-office-travel-agency.jpg"
                  alt="Travel Event Visitors"
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </div>
            {/* RIGHT CONTENT */}
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3 visitors-title">
                Our Visitors
              </h2>
              <p className="text-dark visitors-text">
                Our Travel Event attracts a diverse and influential audience from across the globe, bringing together travel enthusiasts, industry leaders, investors, and decision-makers under one roof.
              </p>
              <p className="text-dark visitors-text">
                From tourism boards and luxury resort representatives to adventure seekers and corporate buyers, our visitors are actively exploring new destinations, partnerships, and opportunities in the evolving travel landscape.
              </p>
              <p className="text-dark visitors-text">
                This dynamic mix of attendees creates a powerful networking environment, making the event a premier platform for discovering global travel trends, building meaningful connections, and unlocking business growth.
              </p>
              <div className="mt-4 d-flex justify-content-center justify-content-lg-start">
                <span className="visitor-badge">
                    Global Audience • Premium Networking • Business Growth
                </span>
            </div>
            </div>
          </div>
        </div>
      </section>
      <div
          className="container visitors-profile"
          style={{ marginTop: "50px", marginBottom: "50px" }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
              Visitors Profile
            </h2>
          <p className="text-muted fw-semibold">Industry Innovators & Visionaries driving exclusive luxury travel</p>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="profile-card h-100 gold-border">
              <div className="profile-header">
                <div className="icon-box"><i className="fas fa-compass"></i></div>
                <h3>TRAVEL DESIGNERS</h3>
              </div>
              <ul className="profile-list">
                <li><strong>Bespoke Travel Curators:</strong> Unique experiences for discerning private clients.</li>
                <li><strong>Ultra-Luxury Itinerary Planners:</strong> Discovering novel destinations and services.</li>
                <li><strong>Destination Management:</strong> Connecting with global suppliers for high-end execution.</li>
                <li><strong>Special Interest Curators:</strong> Private safaris and heritage tours.</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="profile-card h-100 blue-border">
              <div className="profile-header">
                <div className="icon-box"><i className="fas fa-concierge-bell"></i></div>
                <h3>HOSPITALITY LEADERS</h3>
              </div>
              <ul className="profile-list">
                <li><strong>Premium Brand Executives:</strong> Strategic partners for expansion and collaboration.</li>
                <li><strong>Boutique Hotel Owners:</strong> Discovering novel trends to elevate unique properties.</li>
                <li><strong>Asset Management Directors:</strong> Identifying investment and partnership opportunities.</li>
                <li><strong>Cruise & Private Aviation:</strong> Exploring synergies with land-based luxury.</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="profile-card h-100 diamond-border">
              <div className="profile-header">
                <div className="icon-box"><i className="fas fa-gem"></i></div>
                <h3>PREMIUM ADVISORS</h3>
              </div>
              <ul className="profile-list">
                <li><strong>Elite Travel Concierges:</strong> Accessing ground handling and VIP services.</li>
                <li><strong>Lifestyle Management:</strong> Sourcing a diverse portfolio of luxury services.</li>
                <li><strong>Wellness Facilitators:</strong> Exclusive wellness concepts and retreat locations.</li>
                <li><strong>Private Client Managers:</strong> High-touch execution for premium clients.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* ================= VISITORS REGISTRATION FORM ================= */}
      <section className="registration-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="registration-card p-4 p-md-5" ref={formRef}>
                <h2 
                  className="text-center mb-5 fw-bold" 
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    color: "#593983", 
                    fontSize: "2.2rem",
                    letterSpacing: "-1px"
                  }}
                >
                  Visitor Registration
                </h2>              
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label-custom">First Name <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          className="form-control-custom" 
                          placeholder="e.g. John"
                          onChange={handleInputChange}
                        />
                      {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-custom">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          className="form-control-custom" 
                          placeholder="e.g. Doe"
                          onChange={handleInputChange}
                        />
                      {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-custom">Company Name <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                      <input 
                        type="text" 
                        name="companyName" 
                        value={formData.companyName}
                        className="form-control-custom" 
                        placeholder="Enter Organization"
                        onChange={handleInputChange}
                      />
                      {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-custom">Mobile Number <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                        <PhoneInput
                          country={"in"}
                          value={formData.mobileNumber}
                          onChange={(value, data) => {
                          const dialCode = data.dialCode;
                          let numericValue = value.replace(/\D/g, "");
                          let numberOnly = numericValue.startsWith(dialCode)
                            ? numericValue.slice(dialCode.length)
                            : numericValue;
                          const formattedNumber = `+${dialCode} ${numberOnly}`;
                          setFormData({ 
                            ...formData, 
                            mobileNumber: formattedNumber 
                          });
                          setErrors({ ...errors, mobileNumber: "" });
                        }}
                        prefix="+"
                        enableSearch={false}
                        countryCodeEditable={false}   
                        disableDropdown={false}       
                        inputClass="form-control-custom"
                        containerClass="w-100"
                        inputStyle={{
                          width: "100%",
                          height: "52px",
                          borderRadius: "10px",
                          backgroundColor: "#f9f9f9",
                          border: "1px solid #e0e0e0"
                        }}
                        buttonStyle={{
                          border: "none",
                          background: "transparent"
                        }}
                      />
                      {errors.mobileNumber && (
                        <small className="text-danger">{errors.mobileNumber}</small>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Designation <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        className="form-control-custom"
                        placeholder="e.g. Manager"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setFormData({
                              ...formData,
                              designation: value
                            });
                            setErrors({
                              ...errors,
                              designation: ""
                            });
                          } else {
                            setErrors({
                              ...errors,
                              designation: "Only alphabets are allowed"
                            });
                          }
                        }}
                      />
                      {errors.designation && (
                        <small className="text-danger">{errors.designation}</small>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Mail Id <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        className="form-control-custom" 
                        placeholder="john@example.com"
                        onChange={handleInputChange}
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Address Line 1 <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                      <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        className="form-control-custom"
                        placeholder="Street / Area"
                        onChange={handleInputChange}
                      />
                      {errors.address1 && <small className="text-danger">{errors.address1}</small>}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Address Line 2 (optional)</label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        className="form-control-custom"
                        placeholder="Apartment, Suite, etc."
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-dark">
                        Country <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span>
                      </label>
                      <Select
                        options={countryOptions}
                        placeholder="Select Country"
                        value={
                          selectedCountry
                            ? countryOptions.find(opt => opt.value === selectedCountry)
                            : null
                        }
                        onChange={(opt) => {
                          setSelectedCountry(opt.value);
                          setSelectedState("");
                          setSelectedCity("");
                          setFormData({
                            ...formData,
                            country: opt.label,
                            state: "",
                            city: ""
                          });
                        }}
                        isDisabled={loadingAction}
                        styles={customSelectStyles}
                      />
                      {errors.country && <small className="text-danger">{errors.country}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-dark">
                        State <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span>
                      </label>
                      <Select
                        options={stateOptions}
                        placeholder="Select State"
                        value={selectedState}
                        onChange={(opt) => {
                          if (!opt) {
                            setSelectedState(null);
                            setSelectedCity(null);
                            setFormData({
                              ...formData,
                              state: "",
                              city: ""
                            });
                            return;
                          }
                          setSelectedState(opt);
                          setSelectedCity(null);
                          setFormData({
                            ...formData,
                            state: opt.label,
                            city: ""
                          });
                        }}
                        styles={customSelectStyles}
                      />
                      {errors.state && <small className="text-danger">{errors.state}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-dark">
                        City
                      </label>
                      <Select
                        options={cityOptions}
                        placeholder="Select City"
                        value={selectedCity}
                        onChange={(opt) => {
                          if (!opt) {
                            setSelectedCity(null);
                            setFormData({
                              ...formData,
                              city: ""
                            });
                            return;
                          }
                          setSelectedCity(opt);
                          setFormData({
                            ...formData,
                            city: opt.label
                          });
                        }}
                        styles={customSelectStyles}
                      />
                      {errors.city && <small className="text-danger">{errors.city}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-custom">Pincode <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span></label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        className="form-control-custom"
                        placeholder="Enter Pincode"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); 
                          setFormData({
                            ...formData,
                            pincode: value,
                          });
                        }}
                      />
                      {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-uppercase text-dark">
                        Visitor Type <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span>
                      </label>
                      <Select
                        name="visitorType"
                        options={[
                          { value: "Regular Visitor", label: "Regular" },
                          { value: "Hoster Visitor", label: "Hoster" },
                        ]}
                        placeholder="Select Type"
                        className="w-100"
                        value={
                          formData.visitorType
                            ? [
                                { value: "Regular Visitor", label: "Regular" },
                              ].find(opt => opt.value === formData.visitorType)
                            : null
                        }
                        onChange={(opt) => {
                          setFormData({
                            ...formData,
                            visitorType: opt.value
                          });
                        }}
                        isDisabled={loadingAction}
                        styles={customSelectStyles} 
                      />
                    {errors.visitorType && <small className="text-danger">{errors.visitorType}</small>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-uppercase text-dark">
                      Upload Business Card <span className="text-danger" style={{ fontSize: "1rem", fontWeight: "600", lineHeight: "1" }}>*</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="form-control-custom"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
                          if (!allowedTypes.includes(selectedFile.type)) {
                            toast.error("Only PNG, JPG, JPEG or PDF allowed");
                            return;
                          }
                          setFile(selectedFile);
                          setErrors({ ...errors, file: "" });
                        }
                      }}
                    />
                    {errors.file && <small className="text-danger">{errors.file}</small>}
                  </div>

                    <div className="col-12 mt-5">
                      <button 
                        type="submit" 
                        className="btn w-100 register-btn-impressive" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span role="status" aria-hidden="true"></span>
                            Please wait...
                          </>
                        ) : (
                          "Register Now"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= ATTRACTIONS ================= */}
      <section className="curated-section py-5">
        <div className="container">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold curated-title">Attractions</h2>
              <p className="text-dark mb-0 curated-subtitle">
                Glimpses into the world's most prestigious escapes
              </p>
            </div>
            <div className="d-flex gap-2">
            <button
              onClick={scrollLeftHandler}
              style={{
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#593983",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#593983";
                e.currentTarget.style.color = "#fff";  
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#593983";            
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={scrollRightHandler}
              style={{
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#593983",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#593983";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#593983";
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          </div>
          <div
            className="d-flex overflow-auto gap-4 pb-2 curated-scroll"
            ref={scrollRef}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              cursor: 'grab',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {Array.isArray(destinations) && destinations.map((item, index) => (
              <div 
                className="curated-card" 
                key={`${item.id}-${index}`} 
                style={{ flex: '0 0 auto' }}
              >
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${item.filename}`}
                  alt={item.title}
                  draggable="false" 
                  style={{ pointerEvents: 'none' }} 
                />
                <div className="overlay"></div>
                <div className="card-text">
                  <h6>{item.title}</h6>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FooterThree />
    </section>
  );
}

export default ForVisitors;