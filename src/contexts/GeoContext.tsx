// import MapboxGL from '@rnmapbox/maps';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState, AppStateStatus, View} from 'react-native';
import {Position} from '@turf/turf';
import turf from '@turf/turf';

import useUser from '../hooks/useUser';
import moment from 'moment';
import {NumberProp} from 'react-native-svg';
// https://api.open-meteo.com/v1/forecast?latitude=21.2848&longitude=-157.6865&hourly=temperature_2m
export type geoInfo = {
  coords: Position | undefined;
  temperature: number;
  units: 'C' | 'F';
};
const defaultValues: geoInfo = {
  coords: undefined,
  temperature: 0,
  units: 'C',
};
const GeoContext = createContext(defaultValues);
// MapboxGL.setAccessToken(
//   'pk.eyJ1Ijoiam9lY2hvOTkiLCJhIjoiY2xiOW40dzZxMHduZzNycWM2NG5yaTk0YyJ9.fGYm0BpYuBg4P1M4ZAWjYg',
// );
type Props = {
  children: ReactNode;
};
const GeoProvider: FC<Props> = ({children}) => {
  const [geoInfo, setGeoInfo] = useState<geoInfo>(defaultValues);
  // const mapRef = useRef<MapboxGL.MapView | null>();
  const [userCords, setUserCords] = useState<Position | undefined>(undefined);
  const [weatherCords, setWeatherCords] = useState<Position | undefined>(
    undefined,
  );
  const lastWeatherCoords = useRef<Position | undefined>(undefined);
  const lastFetch = useRef<number | undefined>();
  const {user, isAuth} = useUser();
  const [showMap, setShowMap] = useState(false);
  const [temperature, setTemperature] = useState({
    temp: 0,
    units: 'C',
  });
  useEffect(() => {
    if (showMap) {
      return;
    }
    setUserCords(undefined);
  }, [showMap]);

  useEffect(() => {
    setGeoInfo(prev => ({
      ...prev,
      coords: userCords,
    }));
  }, [userCords]);
  useEffect(() => {
    if (!userCords) {
      return;
    }
    if (moment().diff(lastFetch.current || 0, 'minutes') < 15) {
      return;
    }
    const [prevL, prevLon] = lastWeatherCoords.current || [0, 0];
    const [l, lon] = userCords;
    if (prevL === l && prevLon === lon) {
      return;
    }
    let firstTime = false;
    if (!lastWeatherCoords.current) {
      lastWeatherCoords.current = [...userCords];
      firstTime = true;
    }
    if (!firstTime && turf) {
      const line = turf.lineString([lastWeatherCoords.current, userCords]);
      const distance = turf.length(line, {units: 'meters'});
      if (distance < 250) {
        return;
      }
    }
    lastWeatherCoords.current = [...userCords];
    setWeatherCords([...userCords]);
  }, [userCords]);
  useEffect(() => {
    if (!weatherCords) {
      return;
    }
    let isMount = true;
    const getWeather = async () => {
      lastFetch.current = Date.now();
      try {
        const [lon, l] = weatherCords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=21.2811257&longitude=-157.6904359&hourly=temperature_2m&current_weather=true`,
          {
            method: 'GET',
          },
        );
        const data = await res.json();
        if (!isMount) {
          return;
        }
        const {hourly_units, hourly, current_weather} = data;
        let units = hourly_units.temperature_2m || 'F';
        units = units.replace('°', '').toUpperCase();
        let temp = 0;
        const dateNow = new Date();
        const {temperature_2m, time} = hourly;
        // const {temperature1} = current_weather;
        // console.log({temperature1});
        time?.forEach((hour: any, i: NumberProp) => {
          const date = new Date(hour);
          if (moment(dateNow).isSameOrAfter(date)) {
            temp = temperature_2m[i];
          }
        });
        setTemperature({temp, units});
      } catch (error) {
        console.log(error);
      }
    };
    getWeather();
    return () => {
      isMount = false;
    };
  }, [weatherCords]);
  useEffect(() => {
    const {temp, units} = temperature;
    const userUnits = user?.temperatureUnit || 'C';
    if (units === userUnits) {
      setGeoInfo(prev => ({
        ...prev,
        temperature: temp,
        units: userUnits,
      }));
      return;
    }
    if (units === 'C') {
      const f = Number(Number((temp * 9) / 5 + 32).toFixed(1));
      setGeoInfo(prev => ({
        ...prev,
        temperature: f,
        units: userUnits,
      }));
      return;
    }
    const c = Number(Number(((temp - 32) * 5) / 9).toFixed(1));
    setGeoInfo(prev => ({
      ...prev,
      temperature: c,
      units: userUnits,
    }));
  }, [temperature, user?.temperatureUnit]);

  // const onUpdateLocation = useCallback((user: MapboxGL.Location) => {
  //   const userCords = [user.coords.longitude, user.coords.latitude];
  //   setUserCords(userCords);
  // }, []);
  useEffect(() => {
    if (!isAuth) {
      setShowMap(false);
      return;
    }
    const off = setTimeout(() => {
      setShowMap(true);
    }, 10);
    return () => {
      clearTimeout(off);
    };
  }, [isAuth]);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        return;
      }
      setUserCords(prev => {
        if (!prev) {
          return prev;
        }
        return [...prev];
      });
    };
    const off = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      off.remove();
    };
  }, []);

  return (
    <GeoContext.Provider value={geoInfo}>
      {showMap && (
        <View style={{position: 'absolute'}}>
          {/* <MapboxGL.MapView
            ref={c => {
              mapRef.current = c;
            }}
            style={{flex: 1, paddingBottom: 50}}
            zoomEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}>
            <MapboxGL.Camera
              followUserLocation
              followHeading={51.89639447995398}
              zoomLevel={15.525917246858677}
              centerCoordinate={userCords}
              pitch={0}
              heading={51.89639447995398}
              animationDuration={2000}
            /> */}
            {/* <MapboxGL.UserLocation onUpdate={onUpdateLocation} /> */}
          {/* </MapboxGL.MapView> */}
        </View>
      )}
      {children}
    </GeoContext.Provider>
  );
};

export {GeoProvider, GeoContext};
