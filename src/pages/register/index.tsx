import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useRegister, useGoogleAuth } from "../../hooks/useAuth";
import "./register.css";

type FormErrors = {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const registerMutation = useRegister();
  const googleAuthMutation = useGoogleAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuthMutation.mutate(codeResponse.code);
    },
    onError: () => {
      setErrors({ ...errors, email: "Google registration failed" });
    },
    flow: "auth-code",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e?.target || {};
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData?.password) {
      newErrors.password = "Password is required";
    } else if (formData?.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const getPasswordStrength = () => {
    const password = formData?.password || "";
    if (password?.length === 0) return { strength: 0, label: "", color: "" };
    if (password?.length < 6)
      return { strength: 25, label: "Weak", color: "#EF4444" };
    if (password?.length < 10)
      return { strength: 50, label: "Fair", color: "#F59E0B" };
    if (password?.length < 12)
      return { strength: 75, label: "Good", color: "#10B981" };
    return { strength: 100, label: "Strong", color: "#10B981" };
  };

  const passwordStrength = getPasswordStrength();

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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join TicTacToe Master and start playing
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
              error={errors?.email}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="password-field">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={handleChange}
              error={errors?.password}
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
            {formData?.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength?.strength}%`,
                      backgroundColor: passwordStrength?.color,
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: passwordStrength?.color }}
                >
                  {passwordStrength?.label}
                </span>
              </div>
            )}
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="password-field">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData?.confirmPassword}
              onChange={handleChange}
              error={errors?.confirmPassword}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="terms-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData?.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  className="terms-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="terms-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors?.agreeToTerms && (
              <p className="error-message">{errors?.agreeToTerms}</p>
            )}
          </div>

          {registerMutation.isPending && (
            <p className="loading-message">Creating account...</p>
          )}
          {registerMutation.isError && (
            <p className="error-message">
              {(registerMutation.error as any)?.response?.data?.message ||
                "Registration failed"}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            loading={registerMutation.isPending}
            className="submit-button"
          >
            Create Account
          </Button>
        </form>

        <div className="divider">
          <span>Or sign up with</span>
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

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
