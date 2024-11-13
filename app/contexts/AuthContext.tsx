import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  department?: string;
  campus?: string;
  course?: string;
  semester?: string;
  role: "TEACHER" | "STUDENT";
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInUser: () => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signInUser: () => {},
  signOutUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(
            `/api/user?email=${session.user.email}`
          );
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [session]);

  const signInUser = () => {
    signIn();
  };

  const signOutUser = () => {
    signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
