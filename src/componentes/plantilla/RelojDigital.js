import { useState, useEffect } from "react";

const RelojDigital = () => {
  const [time, setTime] = useState(new Date());
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const observer = new MutationObserver(() => {
      setSidebarAbierto(!document.body.classList.contains("sidebar-collapse"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Formateo de la fecha: convierte el resultado a minúsculas y pone en mayúscula solo la primera letra.
  const formatDate = (date) => {
    const formatted = date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className={`reloj-container text-white text-center ${sidebarAbierto ? "d-block" : "d-none"}`}
      style={{ maxWidth: "250px", margin: "0 auto" }}
    >
      <div
        className="hora"
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          fontFamily: "'Orbitron', monospace",
          letterSpacing: "2px",
        }}
      >
        {formatTime(time)}
      </div>
      <div
        className="fecha fw-bold mb-2"
        style={{
          fontSize: "0.8rem",
          letterSpacing: "1px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {formatDate(time)}
      </div>
    </div>
  );
};

export default RelojDigital;
