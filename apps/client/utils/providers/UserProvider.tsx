"use client";

import { User } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserDetails } from "../user.utils";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserInfo: (update: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const updateUserInfo = (update: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...update } : null));
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        try {
          const userDetails = await getUserDetails();
          if (userDetails) {
            setUser(userDetails);
          }
        } catch (err) {
          console.error("error:", err);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
