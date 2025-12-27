import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Dashboard", path: "/game-dashboard", icon: "LayoutDashboard" },
    { label: "Play", path: "/game-board", icon: "Gamepad2" },
    { label: "Analysis", path: "/game-analysis", icon: "LineChart" },
    { label: "History", path: "/game-history", icon: "History" },
  ];

  const isActivePath = (path: string) => location?.pathname === path;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/game-dashboard" className="header-logo">
            <div className="logo-icon">
              <Icon
                name="Grid3x3"
                size={28}
                color="var(--color-popover-foreground)"
                strokeWidth={2.5}
              />
            </div>
            <span className="logo-text">TicTacToe Master</span>
          </Link>

          <nav className="header-nav">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`nav-link ${
                  isActivePath(item?.path) ? "active" : ""
                }`}
              >
                <Icon name={item?.icon} size={20} strokeWidth={2} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/login" className="auth-button">
              <Icon name="LogIn" size={18} strokeWidth={2} />
              <span>Sign In</span>
            </Link>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={mobileMenuOpen ? "X" : "Menu"}
              size={24}
              strokeWidth={2}
            />
          </button>
        </div>
      </header>
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav className="mobile-menu" onClick={(e) => e?.stopPropagation()}>
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`mobile-nav-link ${
                  isActivePath(item?.path) ? "active" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={24} strokeWidth={2} />
                <span>{item?.label}</span>
              </Link>
            ))}
            <div className="mobile-divider" />
            <Link
              to="/login"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name="LogIn" size={24} strokeWidth={2} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name="UserPlus" size={24} strokeWidth={2} />
              <span>Sign Up</span>
            </Link>
          </nav>
        </div>
      )}
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--color-card);
          border-bottom: 1px solid var(--color-border);
          z-index: 100;
        }

        .header-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--color-foreground);
          transition: opacity var(--transition-fast);
        }

        .header-logo:hover {
          opacity: 0.8;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          background-opacity: 0.1;
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast);
        }

        .header-logo:hover .logo-icon {
          transform: scale(1.05);
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-foreground);
        }

        .header-actions {
          display: none;
        }

        @media (min-width: 768px) {
          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }

        .auth-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--color-primary-foreground);
          background: var(--color-primary);
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .auth-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .header-nav {
          display: none;
          gap: 8px;
        }

        @media (min-width: 768px) {
          .header-nav {
            display: flex;
          }
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--color-muted-foreground);
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background: var(--color-muted);
          color: var(--color-foreground);
        }

        .nav-link.active {
          background: var(--color-primary);
          color: var(--color-primary-foreground);
        }

        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: var(--color-foreground);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .mobile-menu-toggle:hover {
          background: var(--color-muted);
        }

        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 99;
          animation: fadeIn var(--transition-fast);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-menu {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          max-width: 80vw;
          height: 100%;
          background: var(--color-card);
          padding: 24px;
          box-shadow: var(--shadow-lg);
          animation: slideIn var(--transition-base);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--color-foreground);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .mobile-nav-link:hover {
          background: var(--color-muted);
        }

        .mobile-nav-link.active {
          background: var(--color-primary);
          color: var(--color-primary-foreground);
        }

        .mobile-divider {
          height: 1px;
          background: var(--color-border);
          margin: 16px 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .header-logo,
          .nav-link,
          .mobile-menu-toggle,
          .mobile-menu-overlay,
          .mobile-menu,
          .mobile-nav-link {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
