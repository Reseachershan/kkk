import React, {useCallback, useMemo, useRef} from 'react';
import {UserContext} from '../contexts/userContext';
import {getDocument} from '../services/firestore';

const useUser = () => {
  const userData = React.useContext(UserContext);
  const {loadingUser, user, uid, token} = userData;
  const {setUser, setToken, setUserId, setLoadingUser} = userData;
  const userRef = useRef(user);
  userRef.current = user;
  const userDbRef = useMemo(() => {
    if (!user?.uid) {
      return null;
    }
    return getDocument(`users/${user?.uid}`);
  }, [user?.uid]);

  const toggleProfileVisiblity = useCallback(async () => {
    await userDbRef?.update({hideProfile: !userRef.current?.hideProfile});
  }, [userDbRef]);
  const toggleTemperature = useCallback(async () => {
    await userDbRef?.update({
      temperatureUnit: userRef.current?.temperatureUnit === 'F' ? 'C' : 'F',
    });
  }, [userDbRef]);
  const toggleSystemUnit = useCallback(async () => {
    await userDbRef?.update({
      systemUnit: userRef.current?.systemUnit === 'imp' ? 'met' : 'imp',
    });
  }, [userDbRef]);
  const toggleEnabledLocation = useCallback(async () => {
    await userDbRef?.update({
      enabledLocation: !userRef.current?.enabledLocation,
    });
  }, [userDbRef]);
  const toggleEnabledNotifications = useCallback(async () => {
    await userDbRef?.update({
      enabledNotifications: !userRef.current?.enabledNotifications,
    });
  }, [userDbRef]);
  const setLanguage = useCallback(
    async (language: string = 'en') => {
      await userDbRef?.update({language});
    },
    [userDbRef],
  );
  const setUserData = useCallback(
    (user: any) => {
      setUser((prev: any) => ({...prev, ...user}));
      setUserId(user.uid);
    },
    [setUser, setUserId],
  );
  const setTokenValue = useCallback(
    (token: string) => {
      setToken(token || null);
    },
    [setToken],
  );
  const removeUserData = useCallback(() => {
    setUser(null);
    setToken(null);
    setUserId(null);
  }, [setUser, setToken, setUserId]);
  const startLoading = useCallback(() => {
    setLoadingUser(true);
  }, [setLoadingUser]);
  const stopLoading = useCallback(() => {
    setLoadingUser(false);
  }, [setLoadingUser]);

  const isAuth = useMemo(
    () => token && user && !user.requireFinishRegister,
    [token, user],
  );

  return {
    setUser,
    toggleProfileVisiblity,
    toggleTemperature,
    toggleSystemUnit,
    toggleEnabledLocation,
    toggleEnabledNotifications,
    setLanguage,
    setUserData,
    removeUserData,
    setTokenValue,
    startLoading,
    stopLoading,
    user,
    uid,
    token,
    isAuth,
    loadingUser,
  };
};

export default useUser;
