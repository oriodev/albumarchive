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

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a Providers");
  }
  return context;
};
