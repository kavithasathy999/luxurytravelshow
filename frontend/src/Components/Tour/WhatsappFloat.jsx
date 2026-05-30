import React, { useEffect, useState } from "react";

function WhatsappFloat() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            setVisible(scroll > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const openWhatsapp = () => {
        window.open(
            "https://wa.me/916382968254?text=Hello%20I%20am%20interested%20in%20the%20Travel%20Event",
            "_blank"
        );
    };
    return (
        <div
            className={`whatsapp-float ${visible ? "show" : ""}`}
            onClick={openWhatsapp}
            style={{ cursor: "pointer" }}
        >
            <svg
                width="35"
                height="40"
                viewBox="0 0 32 32"
                fill="#25D366"
            >
                <path d="M16 .396C7.164.396 0 7.56 0 16.396c0 2.89.754 5.706 2.188 8.19L.055 32l7.643-2.004a15.89 15.89 0 0 0 8.302 2.287c8.836 0 16-7.164 16-16S24.836.396 16 .396zm0 29.207c-2.598 0-5.136-.698-7.349-2.021l-.526-.314-4.535 1.188 1.21-4.418-.343-.545A13.56 13.56 0 0 1 2.43 16.396c0-7.49 6.094-13.585 13.585-13.585S29.6 8.906 29.6 16.396 23.49 29.603 16 29.603zm7.408-10.133c-.404-.202-2.393-1.18-2.764-1.314-.37-.134-.64-.202-.91.202-.27.404-1.045 1.314-1.28 1.585-.236.27-.472.303-.876.101-.404-.202-1.707-.63-3.252-2.01-1.202-1.073-2.015-2.397-2.25-2.8-.236-.404-.025-.622.177-.823.182-.181.404-.472.606-.707.202-.236.27-.404.404-.673.134-.27.067-.505-.034-.707-.101-.202-.91-2.192-1.247-3.002-.328-.787-.662-.68-.91-.693-.236-.012-.505-.014-.774-.014-.27 0-.707.101-1.077.505-.37.404-1.415 1.382-1.415 3.368s1.448 3.903 1.65 4.173c.202.27 2.847 4.345 6.897 6.09.964.416 1.715.664 2.3.85.966.307 1.846.264 2.54.16.775-.116 2.393-.978 2.732-1.923.337-.944.337-1.753.236-1.923-.101-.168-.37-.27-.774-.472z"/>
            </svg>
        </div>
    );
}

export default WhatsappFloat;