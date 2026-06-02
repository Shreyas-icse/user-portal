import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaToilet,
  FaBolt,
  FaHardHat,
  FaPaintRoller,
  FaHammer,
  FaWrench,
  FaCar,
  FaCubes,
} from 'react-icons/fa';

const servicesData = [
  { id: 1, name: 'Plumber', description: 'Expert in fixing leaks, pipes, and water systems.', icon: <FaToilet /> },
  { id: 2, name: 'Electrician', description: 'Certified to handle electrical wiring and repairs.', icon: <FaBolt /> },
  { id: 3, name: 'Contractor', description: 'Oversees construction projects from start to finish.', icon: <FaHardHat /> },
  { id: 4, name: 'Painter', description: 'Provides interior and exterior painting services.', icon: <FaPaintRoller /> },
  { id: 5, name: 'Carpenter', description: 'Specializes in woodwork and furniture making.', icon: <FaHammer /> },
  { id: 6, name: 'Welder', description: 'Works with metal to build or repair structures.', icon: <FaWrench /> },
  { id: 7, name: 'Mechanic', description: 'Maintains and repairs vehicles and machinery.', icon: <FaCar /> },
  { id: 8, name: 'Mason', description: 'Builds structures with bricks, stones, and cement.', icon: <FaCubes /> },
];

const Services = () => {
  const navigate = useNavigate();

  const handleClick = (service) => {
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/workers');
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Our Services</h2>
      <div style={styles.grid}>
        {servicesData.map((service) => (
          <div
            key={service.id}
            style={{ ...styles.card, cursor: 'pointer' }}
            onClick={() => handleClick(service)}
          >
            <div style={styles.icon}>{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  section: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    padding: '50px 20px',
    textAlign: 'center',
    minHeight: '50vh',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '25px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #444',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.08)',
    transition: 'transform 0.2s',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    color: '#00d1ff',
  },
};

export default Services;
