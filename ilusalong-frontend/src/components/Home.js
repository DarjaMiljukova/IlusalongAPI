import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState(null);

    const services = [
        {
            id: 1,
            title: "Näohooldus",
            description: "Täiuslik hooldus su naha värskendamiseks ja taastamiseks.",
            image: "/images/face.jpg",
        },
        {
            id: 2,
            title: "Massaaž",
            description: "Sügav lõõgastus ja pingete leevendamine kogu kehale.",
            image: "/images/massage.jpg",
        },
        {
            id: 3,
            title: "Juuksehooldus",
            description: "Terved ja säravad juuksed professionaalse hoolitsusega.",
            image: "/images/hair.jpg",
        },
        {
            id: 4,
            title: "Maniküür",
            description: "Täiuslikud hooldatud küüned ja stiilne välimus.",
            image: "/images/nail.jpg",
        },
        {
            id: 5,
            title: "Pediküür",
            description: "Hooldatud ja siidised jalad igaks hooajaks.",
            image: "/images/nails.jpg",
        },
        {
            id: 6,
            title: "Meik",
            description: "Professionaalne jumestus igaks sündmuseks.",
            image: "/images/makeup.jpg",
        },
    ];

    const handleRegister = () => {
        const path = window.location.pathname;
        if (path.startsWith("/ru")) navigate("/ru/login");
        else if (path.startsWith("/eng")) navigate("/eng/login");
        else navigate("/login");
    };

    const openCard = (id) => {
        setActiveCard(id);
        document.body.style.overflow = "hidden"; // Блокируем скролл фона
    };

    const closeCard = () => {
        setActiveCard(null);
        document.body.style.overflow = "auto"; // Возвращаем скролл
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Tere tulemast Celestial Touch'i!</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`card ${activeCard === service.id ? "active" : ""}`}
                        onClick={() => openCard(service.id)}
                    >
                        <div className="card-front" style={{ backgroundImage: `url(${service.image})` }}>
                            <h2>{service.title}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {activeCard && (
                <div className="overlay" onClick={closeCard}>
                    <div className="card-detail" onClick={(e) => e.stopPropagation()}>
                        <h2>{services.find((s) => s.id === activeCard).title}</h2>
                        <p>{services.find((s) => s.id === activeCard).description}</p>
                        <button onClick={handleRegister}>Broneeri aeg</button>
                        <span className="close-button" onClick={closeCard}>×</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
