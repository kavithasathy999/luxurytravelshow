import React,{useEffect}  from 'react';
import { useLocation } from 'react-router-dom';
import HeaderFour from '../Components/Header/HeaderFour'
import BannerFour from '../Components/Banner/BannerFour'
import WhyParticipate from "../Components/Brand/WhyParticipate";
import WhoShouldExhibit from '../Components/Guide/WhoShouldExhibit'
import ExpoDetails from '../Components/Guide/ExpoDetails';
// import StallInformation from '../Components/Guide/StallInformation';
// import ContactOne from '../Components/Contact/ContactOne';
import FooterThree from '../Components/Footer/FooterThree'
import ScrollToTop from '../Components/ScrollToTop'
// import AboutOne from '../Components/About/AboutOne'
import Sponsors from '../Components/Category/Sponsors';
import WhatsappFloat from '../Components/Tour/WhatsappFloat';
import VoucherFloat from '../Components/Tour/VoucherFloat';

function HomeFour() {
    const location = useLocation();
    useEffect(() => {
    if (location.hash) {
        // Wait for the DOM to render
        setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        }, 100); 
    }
    }, [location]);

    return (
        <div>
            <HeaderFour />
            <BannerFour />
            {/* <AboutOne /> */}
            <Sponsors />
            <WhyParticipate />
            <WhoShouldExhibit />
            <ExpoDetails />
            {/* <StallInformation /> */}
            <FooterThree />
            <ScrollToTop />
            <WhatsappFloat />
            <VoucherFloat />
        </div>
    )
}

export default HomeFour
