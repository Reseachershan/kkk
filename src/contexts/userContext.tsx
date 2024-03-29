import React, {createContext, FC, ReactNode, useState} from 'react';

export type userType = {
  uid: string;
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  requireFinishRegister?: boolean;
  hideProfile?: boolean;
  temperatureUnit: 'F' | 'C';
  systemUnit: 'imp' | 'met';
  enabledLocation: boolean;
  enabledNotifications: boolean;
  lenguage: 'en' | 'es';
  profileImage?: string;
  klimbLevel: 'klimber' | 'explorer' | 'master' | 'elite' | 'ultra';
  totalKlimbs: number;
  totalKlimbsAll: number;
};

type userContextType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string | null;
  token: string | null;
  loadingUser: boolean;
};
const defaultValues: userContextType = {
  user: null,
  setUser: e => {},
  setToken: e => {},
  setUserId: e => {},
  setLoadingUser: e => {},
  uid: null,
  token: null,
  loadingUser: true,
};
const UserContext = createContext(defaultValues);

type Props = {
  children: ReactNode;
};
const UserProvider: FC<Props> = ({children}) => {
  const [user, setUser] = useState<userType | null>(defaultValues.user);
  const [uid, setUserId] = useState<string | null>(defaultValues.uid);
  const [token, setToken] = useState<string | null>(defaultValues.token);
  const [loadingUser, setLoadingUser] = useState(true);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setToken,
        setUserId,
        uid,
        token,
        loadingUser,
        setLoadingUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserProvider, UserContext};
