import React, { createContext, SetStateAction, useContext, useEffect, useState  } from "react";
import { auth } from "./Firebase";
import { onAuthStateChanged, User, } from "firebase/auth";

type AuthContextType = {
  currentUser: User | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

type Props = {
  children: JSX.Element | JSX.Element[]
}

const defaultContext = {
  currentUser: null
}
export const AuthContext = createContext<Partial<AuthContextType>>(defaultContext);
export const useAuth = () => useContext(AuthContext);


const AuthProvider: React.FC<Props> = ({ children }: Props) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);


  return (
    <AuthContext.Provider
    value={{currentUser, setCurrentUser}}>
      <div>
        {children}
      </div>
    </AuthContext.Provider>
  )
}

export function useAuthValue(){
  return useContext(AuthContext)
}

export default AuthProvider;
