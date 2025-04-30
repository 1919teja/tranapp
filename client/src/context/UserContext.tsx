import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@shared/schema";

type UserType = "truck-owner" | "cargo-requester" | "farmer" | null;

type ContactInfo = {
  phone: string;
  name: string;
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;
  currentContact: ContactInfo | null;
  setCurrentContact: (contact: ContactInfo | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactInfo | null>(null);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      userType, 
      setUserType,
      contactModalOpen,
      setContactModalOpen,
      currentContact,
      setCurrentContact
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
