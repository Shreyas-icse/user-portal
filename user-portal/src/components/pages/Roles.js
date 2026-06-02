import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const jobRoles = [
  {
    title: 'Plumber',
    openings: 240,
    icon: '🔧',
  },
  {
    title: 'Electrician',
    openings: 180,
    icon: '⚡',
  },
  {
    title: 'Carpenter',
    openings: 150,
    icon: '🪵',
  },
  {
    title: 'Painter',
    openings: 132,
    icon: '🎨',
  },
  {
    title: 'Driver',
    openings: 225,
    icon: '🚗',
  },
  {
    title: 'Cleaner',
    openings: 98,
    icon: '🧹',
  },
  {
    title: 'Welder',
    openings: 110,
    icon: '🔥',
  },
  {
    title: 'Security Guard',
    openings: 145,
    icon: '🛡️',
  },
  // Duplicates for scroll effect
  {
    title: 'Plumber',
    openings: 240,
    icon: '🔧',
  },
  {
    title: 'Electrician',
    openings: 180,
    icon: '⚡',
  },
  {
    title: 'Carpenter',
    openings: 150,
    icon: '🪵',
  },
];

const TrendingRoles = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    let animationId;
    const scrollSpeed = 0.5;

    const animateScroll = () => {
      if (container) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
        animationId = requestAnimationFrame(animateScroll);
      }
    };

    animateScroll();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const styles = {
    container: {
      padding: '2rem 1rem',
      color: 'white',
      backgroundColor: '#1c1c1c',
    },
    heading: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem',
      color: 'white',
    },
    scrollWrapper: {
      display: 'flex',
      overflowX: 'auto',
      gap: '1rem',
      paddingBottom: '1rem',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollBehavior: 'smooth',
    },
    roleCard: {
      minWidth: '220px',
      flexShrink: 0,
      backgroundColor: '#2f2f2f',
      borderRadius: '12px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      transition: 'box-shadow 0.3s ease',
      color: 'white',
    },
    icon: {
      fontSize: '2rem',
      marginRight: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    roleDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 600,
      fontSize: '1rem',
      color: 'white',
    },
    openings: {
      fontSize: '0.875rem',
      color: '#ccc',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Trending Job Roles on Service Hire</h2>
      <div style={styles.scrollWrapper} ref={scrollRef}>
        {jobRoles.map((role, index) => (
          <div
            key={index}
            style={styles.roleCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = styles.roleCard.boxShadow;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.icon}>{role.icon}</span>
              <div style={styles.roleDetails}>
                <span style={styles.title}>{role.title}</span>
                <span style={styles.openings}>{role.openings} openings</span>
              </div>
            </div>
            <ChevronRight size={20} color="#999" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRoles;
