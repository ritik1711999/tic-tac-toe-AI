import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e?.target || {};
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);

    // Mock authentication - replace with your backend integration
    console.log("Login attempt:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Add your authentication logic here
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login initiated`);
    // Add your social authentication logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Icon
              name="Grid3x3"
              size={40}
              color="var(--color-primary)"
              strokeWidth={2.5}
            />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to continue your TicTacToe journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData?.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData?.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className="submit-button"
          >
            Sign In
          </Button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("Google")}
            className="social-button"
          >
            <Icon name="Chrome" size={20} />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("GitHub")}
            className="social-button"
          >
            <Icon name="Github" size={20} />
            GitHub
          </Button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
