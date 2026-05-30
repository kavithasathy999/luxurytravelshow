import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function BannerFour() {
  const [data, setData] = useState({
    slides: [],
    eventInfo: {}
  });
  const navigate=useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/banner`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (window.location.hash === "#hero") {
      const heroSection = document.getElementById("hero");

      if (heroSection) {
        setTimeout(() => {
          heroSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="position-relative" id="hero" style={{ fontFamily: "Montserrat, sans-serif", overflow: "visible" }}>
      {data.slides.length > 0 && (
        <Swiper
          style={{ 
            width: "100vw", 
            height: "100vh", 
            margin: "0", 
            padding: "0" 
          }}
          key={data.slides.length}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 3500 }}
          loop={true}
          speed={3000}
        >
          {data.slides.map((img) => (
            <SwiperSlide key={img.id}>
              <div
                className="hero-inner"
                style={{
                  backgroundImage: `url(${img.image})`,
                  backgroundSize: "cover", 
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "100vw", 
                  height: "100vh", 
                  position: "relative", 
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",    
                    fontSize: "32px",                           
                    fontWeight: "400",
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  Welcome To Our
                </h3>
                <h1
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "75px",
                    fontWeight: "700",
                    color: "#fff",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                    marginBottom: "15px"
                  }}
                >
                  {data.eventInfo?.title || ""}
                </h1>
                <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                  <button className="bannerpage-btn primary" onClick={() => navigate('/registrationForm')} style={{fontWeight:"700"}}>
                    Exhibitor Registration
                  </button>
                  <button className='visitor-btn primary' onClick={() => navigate('/forvisitors')} style={{fontWeight:"700"}}>
                    Visitor Registration
                  </button>
                </div>
                <HeroCard event={data.eventInfo} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

const HeroCard = ({ event }) => {
  return (
    <div className="hero-card-custom">
      <span className="hero-inline-item">
        <i className="fa-solid fa-location-dot"></i>
        {event.location}
      </span>
      <span className="hero-inline-item">
        <i className="fa-solid fa-calendar"></i>
        {event.date}
      </span>
      <span className="hero-inline-item">
        <i className="fa-solid fa-clock"></i>
        {event.time}
      </span>
    </div>
  );
};

export default BannerFour;