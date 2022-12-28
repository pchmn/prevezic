import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface SignInContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SignInContext = createContext<SignInContextProps>({} as SignInContextProps);

export function SignInContextProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);

  return <SignInContext.Provider value={{ loading, setLoading }}>{children}</SignInContext.Provider>;
}

export function useSignInContext() {
  const ctx = useContext(SignInContext);
  if (!ctx) {
    throw new Error('useSignInContext must be used inside SignInContextProvider');
  }
  return ctx;
}
