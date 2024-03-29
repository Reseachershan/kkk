import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, AppStateStatus} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

import useUser from './src/hooks/useUser';
import {logOut, obServeUser} from './src/services/auth';
import {NoAuthRoutes, WithAutRoutes} from './routes';
import {observerWorkoutInProgress} from './src/services/workout';
import useWorkOut from './src/hooks/useWorkOut';

const Stack = createStackNavigator();
const App = () => {
  const userContext = useUser();
  const {setTokenValue, setUserData, removeUserData, isAuth} = userContext;
  const {startLoading, stopLoading, user} = userContext;
  const {setCurrentWorkOut} = useWorkOut();
  const removeUser = useCallback(
    async (userGet?: any) => {
      userGet?.();
      await AsyncStorage.removeItem('@USER_DATA');
      removeUserData();
      logOut();
      stopLoading();
    },
    [removeUserData, stopLoading],
  );
  // useEffect(() => {
  //   logOut();
  // }, []);

  useEffect(() => {
    let off: any;
    let userGet: any;
    let offUser: any;
    let online: any;
    startLoading();
    const handleStatusUser = (state: AppStateStatus) => {
      if (state !== 'active') {
        return;
      }
      online?.();
      // online = handleUserStatus();
    };
    const unsuscribe = auth().onAuthStateChanged(async user => {
      userGet?.();
      off && clearTimeout(off);
      if (!user) {
        return removeUser();
      }
      const token = await user.getIdToken();
      offUser = AppState.addEventListener('change', handleStatusUser);
      // online = handleUserStatus();
      userGet = obServeUser(user.uid, async user => {
        off && clearTimeout(off);
        off = setTimeout(async () => {
          if (!user.user) {
            return removeUser(userGet);
          }
          const storeData = {
            uid: user.uid,
            user: user.user,
          };
          await AsyncStorage.setItem('@USER_DATA', JSON.stringify(storeData));
          setUserData(user.user);
          stopLoading();
          // setIsLogged(true);
        }, 300);
      });

      setTokenValue(token);
    });
    return () => {
      unsuscribe?.();
      off && clearTimeout(off);
      userGet?.();
      offUser?.remove();
      online?.();
    };
  }, [removeUser, setTokenValue, setUserData, startLoading, stopLoading]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    if (!isAuth) {
      return;
    }
    const off = observerWorkoutInProgress(user?.uid, workout => {
      console.log('workout', workout);
      setCurrentWorkOut(workout);
    });

    return () => {
      off?.();
    };
  }, [isAuth, user?.uid, setCurrentWorkOut]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {NoAuthRoutes.map(item => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={item.options}
          />
        ))}

        {!!isAuth &&
          WithAutRoutes.map(item => (
            <Stack.Screen
              key={item.name}
              name={item.name}
              component={item.component}
              options={item.options}
            />
          ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
