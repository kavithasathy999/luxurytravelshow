import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function Sponsors() {
  const [eventSponsors, setEventSponsors] = useState([]);
  const [associateSponsors, setAssociateSponsors] = useState([]);
  const [ourSponsors, setOurSponsors] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const apiBase = process.env.REACT_APP_API_BASE_URL || "";
    const fetchSafeData = async (endpoint, setter) => {
      try {
        const res = await axios.get(`${apiBase}${endpoint}`);
        const data = res.data.sponsors || [];
        const validated = await Promise.all(
          data.map((sp) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous"; 
              img.src = sp.imageUrl;
              img.onload = () => resolve(sp);
              img.onerror = () => resolve(null);
            });
          })
        );
        setter(validated.filter(Boolean));
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchSafeData("/api/sponsors/event", setEventSponsors);
    fetchSafeData("/api/sponsors/associate", setAssociateSponsors);
    fetchSafeData("/api/sponsors/our", setOurSponsors);
  }, []);

  const sliderSettings = {
    modules: [Autoplay, Pagination],
    spaceBetween: 30,
    slidesPerView: 1,
    autoplay: { delay: 3000 },
    pagination:  false ,
  };

  return (
    <div className="sponsors-wrapper mt-4 px-3">
      <style>{`
        .sponsors-wrapper { margin-left: 1.5rem; }
        .sp-grid { display: flex; flex-wrap: wrap; gap: 80px; justify-content: center; }
        .sp-img { width: 150px; object-fit: contain; display: block; }

        .mobile-slider-container { display: none; }
        @media (max-width: 667px) {
          .sponsors-wrapper { margin-left: 0 !important; }
          .sp-grid { display: none !important; }
          
          .mobile-slider-container { 
            display: block; 
            width: 100%;
            max-width: 375px; 
            margin: 0 auto;
            padding-bottom: 20px;
          }

          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .sp-img-mobile { 
            width: 50%; 
            max-width: 260px; 
            height: auto; 
            object-fit: contain;
          }

          h2 { font-size: 1.5rem !important; margin-bottom: 10px !important; }
        }
      `}</style>

      {eventSponsors.length > 0 && (
        <section style={{marginBottom: "50px"}}>
          <h2 className="text-center mb-2">Event Title Sponsors</h2>
          {/* Mobile Slider View */}
          <div className="mobile-slider-container">
            <Swiper {...sliderSettings}>
              {eventSponsors.map(sp => (
                <SwiperSlide key={sp.id}>
                  <img src={sp.imageUrl} className="sp-img-mobile" alt="Sponsor" crossOrigin="anonymous" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="sp-grid">
            {eventSponsors.map(sp => <img key={sp.id} src={sp.imageUrl} className="sp-img" alt="Sponsor" crossOrigin="anonymous" />)}
          </div>
        </section>
      )}

      {associateSponsors.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center mb-2 oursponsors">Event Co-Sponsors</h2>
          <div className="mobile-slider-container">
            <Swiper {...sliderSettings}>
              {associateSponsors.map(sp => (
                <SwiperSlide key={sp.id}>
                  <img src={sp.imageUrl} className="sp-img-mobile" alt="Sponsor" crossOrigin="anonymous" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="sp-grid our-gap">
            {associateSponsors.map(sp => <img key={sp.id} src={sp.imageUrl} className="sp-img" alt="Sponsor" crossOrigin="anonymous" />)}
          </div>
        </section>
      )}

      {ourSponsors.length > 0 && (
        <section style={{marginBottom: "50px"}}>
          <h2 className="text-center mb-2">Supported By</h2>
          <div className="mobile-slider-container">
            <Swiper {...sliderSettings}>
              {ourSponsors.map(sp => (
                <SwiperSlide key={sp.id}>
                  <img src={sp.imageUrl} className="sp-img-mobile" alt="Sponsor" crossOrigin="anonymous" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="sp-grid">
            {ourSponsors.map(sp => <img key={sp.id} src={sp.imageUrl} className="sp-img" alt="Sponsor" crossOrigin="anonymous" />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default Sponsors;

