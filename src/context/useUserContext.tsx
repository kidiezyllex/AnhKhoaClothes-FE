"use client";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { clearToken, setTokenToLocalStorage } from "@/helper/tokenStorage";
import { useUserProfile } from "@/hooks/account";
import { useAuth } from "@/hooks/useAuth";
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
    // Skip API refetch for hardcoded admin account
    if (user?.email === "adminallwear@gmail.com") {
      return;
    }
    try {
      setIsLoadingProfile(true);
      await refetchProfile();
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [refetchProfile, user?.email]);

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
        // Đồng bộ sang useAuth (Zustand)
        useAuth.getState().setUser(user as any);
      } else {
        localStorage.removeItem("user");
        useAuth.getState().setUser(null);
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

  // Tự động đồng bộ user state từ profileData
  useEffect(() => {
    if (profileData?.status === "success" && profileData.data?.user) {
      setUser(profileData.data.user);
    }
  }, [profileData]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loginUser,
      logoutUser,
      fetchUserProfile,
      isLoadingProfile: isProfileLoading || isLoadingProfile,
      isAuthenticated: !!user,
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
