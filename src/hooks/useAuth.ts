import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api/client";
import { useAuthStore, type User } from "../store/authStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
}

// Login with email and password
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      const user: User = {
        _id: data._id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
      };
      setAuth(user, data.token);
      navigate("/dashboard");
    },
  });
};

// Register with email and password
export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/register",
        userData
      );
      return data;
    },
    onSuccess: (data) => {
      const user: User = {
        _id: data._id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
      };
      setAuth(user, data.token);
      navigate("/dashboard");
    },
  });
};

// Login/Register with Google
export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (code: string) => {
      //   const { data } = await apiClient.post<AuthResponse>("/auth/google", {
      //     idToken,
      //   });
      const { data } = await apiClient.post<AuthResponse>("/auth/google", {
        code,
      });
      return data;
    },
    onSuccess: (data) => {
      const user: User = {
        _id: data._id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
      };
      setAuth(user, data.token);
      navigate("/dashboard");
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    queryClient.clear();
    navigate("/login");
  };
};
