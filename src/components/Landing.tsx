import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          animation: 'fadeIn 1s ease-in',
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}>
            JobNimbus Dashboard
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            marginBottom: '3rem',
            opacity: 0.95,
          }}>
            Plataforma de Inteligencia de Negocios
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            color: '#667eea',
            fontSize: '2rem',
            marginBottom: '1rem',
          }}>
            Toma Decisiones Inteligentes con Datos en Tiempo Real
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}>
            Nuestra plataforma centraliza toda la información de tus oficinas de Stamford y Guilford,
            brindándote análisis avanzados, métricas de rendimiento y reportes financieros en un solo lugar.
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            margin: '2rem 0',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              transition: 'transform 0.3s ease',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Analytics Avanzados
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                Visualiza tendencias y patrones en tus datos de negocio
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Reportes Financieros
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                Ingresos, márgenes y proyecciones en tiempo real
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Gestión de Equipos
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                Monitorea productividad y rendimiento del personal
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
              <h3 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                KPIs en Vivo
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                Métricas clave actualizadas automáticamente
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => navigate('/app')}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              Ingresar al Dashboard
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginTop: '2rem',
          opacity: 0.8,
          fontSize: '0.9rem',
        }}>
          <p>&copy; 2025 JobNimbus Dashboard. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
