import React, { useEffect, useState } from "react";

const ModoOscuro = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode") === "true";
        setDarkMode(saved);
        document.body.classList.toggle("dark-mode", saved);
    }, []);

    const handleToggle = (e) => {
        e.preventDefault(); // Para evitar el salto del href="#"
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.body.classList.toggle("dark-mode", newMode);
        localStorage.setItem("darkMode", newMode);
    };

    return (
        <a
            href="#"
            className="nav-link"
            role="button"
            onClick={handleToggle}
            title="Modo oscuro"
        >
            <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </a>
    );
};

export default ModoOscuro;
