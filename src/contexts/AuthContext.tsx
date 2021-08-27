import { createContext, ReactNode, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, auth, onAuthStateChanged } from '../services/firebase';

type UserType = {
  id: string,
  name: string,
  avatar: string,
};

type AuthContextType = {
  user: UserType | undefined;
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode
};

export const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleResult);
    return () => {
      unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    handleResult(result.user);
  }

  const handleResult = (result: any) => {
    if (result) {
      const { displayName, photoURL, uid } = result;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
