"use client";
import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { clearToken, setTokenToLocalStorage } from "@/helper/tokenStorage";
import { useUserProfile } from "@/hooks/account";
import { IAccountResponse } from "@/interface/response/account";
import cookies from "js-cookie";

type UserContextType = {
  user: null | Record<string, any>;
  profile: IAccountResponse | null;
  loginUser: (userInfo: any, token: string) => void;
  logoutUser: () => void;
  fetchUserProfile: () => Promise<void>;
  isLoadingProfile: boolean;
  isAuthenticated: boolean;
  updateUserProfile?: (data: any) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const {
    data: profileData,
    refetch: refetchProfile,
    isLoading: isProfileLoading,
  } = useUserProfile();
  const [user, setUser] = useState<null | Record<string, any>>(null);
  const [profile, setProfile] = useState<IAccountResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const lastProfileDataStringRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const setCookie = useCallback((name: string, value: string, days = 30) => {
    if (typeof window === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }, []);

  const deleteCookie = useCallback((name: string) => {
    if (typeof window === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }, []);

  const loginUser = useCallback((userInfo: any, token: string) => {
    setUser(userInfo);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", JSON.stringify({ token }));
    }
    cookies.set("accessToken", token, { expires: 7 });
    setTokenToLocalStorage(token);
    fetchUserProfile();
  }, []);

  const updateUserProfile = useCallback(
    (data: any) => {
      if (profile && profile.data && profile.data.user) {
        const updatedProfile = {
          ...profile,
          data: {
            ...profile.data,
            user: {
              ...profile.data.user,
              ...data,
            },
          },
        };
        setProfile(updatedProfile);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        }
      }
    },
    [profile]
  );

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      await refetchProfile();
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [refetchProfile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    }
  }, []);

  useEffect(() => {
    const currentProfileDataString = profileData
      ? JSON.stringify(profileData)
      : null;
    if (currentProfileDataString !== lastProfileDataStringRef.current) {
      if (profileData) {
        setProfile(profileData);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", currentProfileDataString!);
        }
      } else {
        setProfile(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
        }
      }
      lastProfileDataStringRef.current = currentProfileDataString;
    }
  }, [profileData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  const logoutUser = useCallback(() => {
    clearToken();
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
    }
    cookies.remove("accessToken");
    navigate("/auth/login");
  }, [navigate]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loginUser,
      logoutUser,
      fetchUserProfile,
      isLoadingProfile: isProfileLoading || isLoadingProfile,
      isAuthenticated: !!user || !!profile,
      updateUserProfile,
    }),
    [
      user,
      profile,
      loginUser,
      logoutUser,
      fetchUserProfile,
      isProfileLoading,
      isLoadingProfile,
      updateUserProfile,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
