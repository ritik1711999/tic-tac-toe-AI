import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useAuth";
import "../styles/ui/Header.css";

interface HeaderProps {
  onNavigationAttempt?: (path: string) => void;
}

const Header = ({ onNavigationAttempt }: HeaderProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const logout = useLogout();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    // { label: "Play", path: "/play-game/new", icon: "Gamepad2" },
    { label: "History", path: "/history", icon: "History" },
  ];

  const isActivePath = (path: string) => location?.pathname === path;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="header-logo"
          >
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

          {isAuthenticated && (
            <nav className="header-nav">
              {navigationItems?.map((item) => {
                if (onNavigationAttempt) {
                  return (
                    <button
                      key={item?.path}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigationAttempt(item?.path);
                      }}
                      className={`nav-link ${
                        isActivePath(item?.path) ? "active" : ""
                      }`}
                    >
                      <Icon name={item?.icon} size={20} strokeWidth={2} />
                      <span>{item?.label}</span>
                    </button>
                  );
                }
                return (
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
                );
              })}
            </nav>
          )}

          <div className="nav-header-actions">
            {isAuthenticated ? (
              <>
                <div className="profile-menu">
                  <button
                    className="profile-button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    aria-label="Toggle profile menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.email}
                        className="profile-avatar"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-info">
                        <p className="profile-email">{user?.email}</p>
                        {user?.name && (
                          <p className="profile-name">{user?.name}</p>
                        )}
                      </div>
                      <hr className="profile-divider" />
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="logout-button"
                      >
                        <Icon name="LogOut" size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button">
                  <Icon name="LogIn" size={18} strokeWidth={2} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="auth-button">
                  <Icon name="UserPlus" size={18} strokeWidth={2} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
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
            {isAuthenticated && (
              <>
                {navigationItems?.map((item) => {
                  if (onNavigationAttempt) {
                    return (
                      <button
                        key={item?.path}
                        onClick={() => {
                          onNavigationAttempt(item?.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`mobile-nav-link ${
                          isActivePath(item?.path) ? "active" : ""
                        }`}
                      >
                        <Icon name={item?.icon} size={24} strokeWidth={2} />
                        <span>{item?.label}</span>
                      </button>
                    );
                  }
                  return (
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
                  );
                })}
                <div className="mobile-divider" />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-nav-link"
                >
                  <Icon name="LogOut" size={24} strokeWidth={2} />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
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
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
