import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supportedLanguages } from '../ui-translations';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  const getStyles = () => {
    const isMobile = window.innerWidth < 768;
    return {
      container: {
        position: 'relative',
      },
      button: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: isMobile ? '8px 12px' : '10px 16px',
        background: 'rgba(255, 215, 0, 0.08)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '30px',
        color: '#FFD700',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '13px',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      },
      flag: {
        fontSize: isMobile ? '16px' : '18px',
      },
      arrow: {
        fontSize: '10px',
        transition: 'transform 0.2s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      },
      dropdown: {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        background: 'rgba(10, 10, 10, 0.98)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '14px',
        padding: '8px',
        minWidth: isMobile ? '180px' : '200px',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: 1001,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.2s ease',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      },
      option: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: isMobile ? '10px 12px' : '12px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: isMobile ? '13px' : '14px',
        color: 'white',
        fontWeight: '600',
      },
      optionActive: {
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))',
        border: '1px solid rgba(255, 215, 0, 0.4)',
      },
      optionFlag: {
        fontSize: isMobile ? '18px' : '20px',
      },
      optionName: {
        flex: 1,
      },
      optionCheck: {
        color: '#FFD700',
        fontSize: '14px',
        fontWeight: '900',
      },
    };
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      {/* 🆕 HIDE SCROLLBAR - Cross-browser compatible */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .language-dropdown::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .language-dropdown {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={styles.flag}>{currentLang.flag}</span>
          <span>{currentLang.name}</span>
          <span style={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className="language-dropdown" style={styles.dropdown}>
            {supportedLanguages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  style={{
                    ...styles.option,
                    ...(isActive ? styles.optionActive : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={styles.optionFlag}>{lang.flag}</span>
                  <span style={styles.optionName}>{lang.name}</span>
                  {isActive && <span style={styles.optionCheck}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;