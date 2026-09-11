import PublicAvailabilityCalendar from "./PublicAvailabilityCalendar";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Salón Roma, inicio">
          <span className="brand-mark">SR</span>
          <span>SALÓN ROMA</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#espacio">El salón</a>
          <a href="#servicios">Servicios</a>
          <a href="#fechas">Fechas</a>
        </nav>
        <a className="header-cta" href="#fechas">Consultar fecha</a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-overlay" />
        <div className="hero-ornament" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Celebraciones que permanecen</p>
          <h1>El escenario perfecto para tu historia.</h1>
          <p className="hero-copy">
            Un espacio elegante y versátil para bodas, XV años y momentos que merecen ser inolvidables.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#fechas">Ver fechas disponibles</a>
            <a className="text-link" href="#espacio">Conocer el salón <span>→</span></a>
          </div>
          <div className="hero-proof" aria-label="Características del salón">
            <span>Eventos personalizados</span>
            <span>Atención por cita</span>
          </div>
        </div>
        <div className="hero-detail">
          <span>Tampico, Tamaulipas</span>
          <span>Hasta 300 invitados</span>
        </div>
      </section>

      <section className="intro section" id="espacio">
        <div>
          <p className="eyebrow">Salón Roma</p>
          <h2>Diseñado para celebrar sin preocupaciones.</h2>
        </div>
        <p>
          Desde la primera visita hasta el último baile, nuestro equipo cuida cada detalle para que disfrutes tu evento con tranquilidad, estilo y calidez.
        </p>
      </section>

      <section className="services section" id="servicios">
        <article className="service-card">
          <span>01</span>
          <h3>Espacio versátil</h3>
          <p>Montajes personalizados para eventos íntimos o grandes celebraciones.</p>
        </article>
        <article className="service-card">
          <span>02</span>
          <h3>Atención cercana</h3>
          <p>Acompañamiento para organizar tiempos, proveedores y detalles importantes.</p>
        </article>
        <article className="service-card">
          <span>03</span>
          <h3>Ubicación accesible</h3>
          <p>Un punto cómodo para tus invitados, con estacionamiento y fácil llegada.</p>
        </article>
      </section>

      <section className="dates-section" id="fechas">
        <div className="dates-intro section">
          <p className="eyebrow">Disponibilidad</p>
          <h2>Encuentra la fecha perfecta</h2>
          <p>Selecciona un día disponible y escríbenos para conocer paquetes, horarios y opciones para tu evento.</p>
        </div>
        <div className="calendar-wrap section">
          <PublicAvailabilityCalendar />
        </div>
      </section>

      <section className="closing section">
        <p className="eyebrow">Tu celebración comienza aquí</p>
        <h2>Hagamos realidad el evento que imaginas.</h2>
        <a className="primary-button dark" href="#fechas">Consultar disponibilidad</a>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">SR</span><span>SALÓN ROMA</span></div>
        <p>Una demostración de calendario para eventos creada por RomaLabs.</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </main>
  );
}
