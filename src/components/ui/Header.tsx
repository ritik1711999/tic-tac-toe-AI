import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import "../styles/ui/Header.css";

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

          <div className="nav-header-actions">
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
    </>
  );
};

export default Header;
