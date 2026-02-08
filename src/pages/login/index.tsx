import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useLogin, useGoogleAuth } from "../../hooks/useAuth";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuthMutation.mutate(codeResponse.code);
    },
    onError: () => {
      setErrors({ google: "Google login failed" });
    },
    flow: "auth-code",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e?.target || {};
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Image src="/T.png" alt="TicTacToe Master Logo" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to continue your TicTacToe journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData?.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

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
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
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

          {loginMutation.isPending && (
            <LoadingSpinner
              size="small"
              message="Signing in..."
              variant="inline"
            />
          )}
          {loginMutation.isError && (
            <p className="error-message">
              {(loginMutation.error as any)?.response?.data?.message ||
                "Login failed"}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loginMutation.isPending}
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
            onClick={() => googleLogin()}
            loading={googleAuthMutation.isPending}
            className="social-button"
          >
            <Icon name="Chrome" size={20} />
            Google
          </Button>
        </div>

        {errors.google && <p className="error-message">{errors.google}</p>}

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
