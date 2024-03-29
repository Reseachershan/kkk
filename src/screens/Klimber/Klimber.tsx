import React, { useEffect, useMemo, useRef, useState } from 'react';
// import MapboxGL from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Icon from '../../components/Icon/Icon';
import WorkTypeInfoModal from '../../components/WorkTypeInfoModal';
import useWorkOut from '../../hooks/useWorkOut';
import useTracking from '../../hooks/useTracker';
import { trayectoriaType } from '../../types/workout';
import ActionPopup from '../../components/Modals/ActionPopup';
// import turf from '@turf/turf';
import MapView, { Marker, Polygon } from 'react-native-maps';
import {
  defaultRegionKoko, endKlimbCoorsKoko, endRouteCoordsKoko, externalAreaCoordsKoko, startKlimbCoordsKoko, startRouteCoordsKoko, trayectoriasKoko,
  defaultRegionLocal, endKlimbCoorsLocal, endRouteCoordsLocal, externalAreaCoordsLocal, startKlimbCoordsLocal, startRouteCoordsLocal, trayectoriasLocal,
  endKlimbCoorsKokoShort, endRouteCoordsKokoShort, trayectoriasKokoShort
} from './data';
import Geolocation from '@react-native-community/geolocation';
const turf = require('@turf/turf');
// MapboxGL.setAccessToken(
//   'pk.eyJ1Ijoiam9lY2hvOTkiLCJhIjoiY2xiOW40dzZxMHduZzNycWM2NG5yaTk0YyJ9.fGYm0BpYuBg4P1M4ZAWjYg',
// );
const debug = false;

const styles2 = {
  userCoordsRoute: {
    fillColor: 'green',
    fillOpacity: 0.08,
  },
  noCompletedSteep: {
    fillColor: 'red',
    fillOpacity: 0.2,
  },
  completedSteep: {
    fillColor: 'green',
    fillOpacity: 0.3,
  },
};

export const Klimber = () => {
  const navigation = useNavigation<any>();
  const [showStats, setShowStats] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [insideExternalZone, setInsideExternalZone] = useState(false);
  const [insideNextSteep, setInsideNextSteep] = useState(false);
  const [userCords, setUserCords] = useState<any | undefined>(undefined);
  const configWorkOut = useWorkOut();
  const { currentWorkout, workOut, stopRuning, toggleRunning, startRuning, updateTrayectory, updateDistanceTotal, updateDistanceLeft, setIsInEnd, setIsInStart } = configWorkOut;
  const { trayectoria = [] } = workOut;
  const { isInEnd, isInStart, isRunning, distanceLeft, distanceTotal, workOutType, startTime, elapsedTime } = currentWorkout || {};
  const [showAboutLevels, setShowAboutLevels] = useState(false);
  const [showForceStartModal, setShowForceStartModal] = useState(false);
  const [showForceFinishModal, setShowForceFinishModal] = useState(false);
  const [defaultRegion, setDefaultRegion] = useState(defaultRegionKoko);
  const [startKlimbCoords, setStartKlimbCoords] = useState(startKlimbCoordsKoko);
  const [endKlimbCoors, setEndKlimbCoors] = useState(endKlimbCoorsKoko);
  const [externalAreaCoords, setExternalAreaCoords] = useState(externalAreaCoordsKoko);
  const [startRouteCoords, setStartRouteCoords] = useState(startRouteCoordsKoko);
  const [endRouteCoords, setEndRouteCoords] = useState(endRouteCoordsKoko);
  const [trayectorias, setTrayectorias] = useState(trayectoriasKoko);
  const [isLocal, setIsLocal] = useState(false);
  const [isShortEnd, setIsShortEnd] = useState(false);
  const changeLocationToLocal = (shiftToLocal: Boolean) => {
    setDefaultRegion(shiftToLocal ? defaultRegionLocal : defaultRegionKoko);
    setStartKlimbCoords(shiftToLocal ? startKlimbCoordsLocal : startKlimbCoordsKoko);
    setEndKlimbCoors(shiftToLocal ? endKlimbCoorsLocal : endKlimbCoorsKoko);
    setExternalAreaCoords(shiftToLocal ? externalAreaCoordsLocal : externalAreaCoordsKoko);
    setStartRouteCoords(shiftToLocal ? startRouteCoordsLocal : startRouteCoordsKoko);
    setEndRouteCoords(shiftToLocal ? endRouteCoordsLocal : endRouteCoordsKoko);
    setTrayectorias(shiftToLocal ? trayectoriasLocal : trayectoriasKoko);
    mapRef.current.animateToRegion(shiftToLocal ? defaultRegionLocal : defaultRegionKoko)
    setIsLocal(Boolean(shiftToLocal))
  }

  console.log('defaultRegionLocal', defaultRegionKoko);
  

  const changeEndPosition = (shiftToShort: Boolean) => {
    setEndKlimbCoors(shiftToShort ? endKlimbCoorsKokoShort : endKlimbCoorsKoko);
    setEndRouteCoords(shiftToShort ? endRouteCoordsKokoShort : endRouteCoordsKoko);
    setTrayectorias(shiftToShort ? trayectoriasKokoShort : trayectoriasKoko);
    mapRef.current.animateCamera({center: { latitude: 21.28241649848108, longitude: -157.6897716522217 }, pitch: 30, heading: 52, altitude: 1600, zoom: 1}, { duration: 3000 })
    setIsShortEnd(Boolean(shiftToShort))
  }

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        //@ts-ignore
          if (!latitude || !longitude) return
          const userCords = [longitude,latitude];
          console.log('userCords', userCords);
          setUserCords(userCords);
          if ((isInStart || isInEnd || insideExternalZone || isRunning)) {
            mapRef.current?.animateCamera({ camera: { center: { ...position.coords } }, duration: 1000 })
          }
        //@ts-ignore
      },
      error => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 0.1 }
    );
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const config = useMemo(
    () => ({
      isTracking: Boolean(isRunning),
      startTime: startTime || Date.now(),
      elapsedTime: elapsedTime || 0,
    }),
    [elapsedTime, isRunning, startTime],
  );
  const [timer] = useTracking(config);
  // useEffect(() => {
  //   if (!insideExternalZone && isRunning) {
  //     toggleRunning();
  //   }
  // }, [insideExternalZone, isRunning, toggleRunning]);

  const handleStopTimer = (
    completeAllSteeps?: boolean,
    newTra?: trayectoriaType[],
  ) => {
    stopRuning(true);
    setShowStats(false);
    // distance
    if (completeAllSteeps) {
      const trac = [...(newTra || trayectoria || [])].map(t => ({
        ...t,
        completed: true,
        completedAt: t.completedAt || Date.now(),
      }));
      updateTrayectory(trac);
    }

    navigation.navigate('KlimbFinished', {
      canChangePhoto: true,
      workOutId: currentWorkout?.workoutId,
    });
  };

  const handleCancelKlimb = () => {
    stopRuning(true);
    navigation.navigate('Klimb');
  };

  const mapRef = useRef<any>();

  const nycJSON: any = useMemo(() => {
    return {
      type: 'FeatureCollection',
      id: 'nycJSON',
      features: [
        {
          geometry: {
            //start klimb
            coordinates: [startKlimbCoords],
            type: 'Polygon',
          },
          type: 'Feature',
          properties: {},
        },
        {
          geometry: {
            //end klimb
            coordinates: [endKlimbCoors],
            type: 'Polygon',
          },
          type: 'Feature',
          properties: {},
        },
      ],
    };
  }, []);


  const onPress = (e: any) => {
    debug && setUserCords(e.geometry.coordinates);
  };

  const nextZone = useMemo(() => {
    return trayectoria?.find((item: any) => !item.completed);
  }, [trayectoria]);
  const zonesToComplete = useMemo(() => {
    return trayectoria?.filter((item: any) => !item.completed)?.length || 0;
  }, [trayectoria]);

  const handleButton = () => {
    if (!isRunning) {
      if (!isInStart && !isInEnd) return;
      const type = `${workOutType}${isInStart ? '_1' : '_2'}`;
      let trayectoria = getTrayectoria(type);

      if (!trayectoria) {
        return;
      }

      trayectoria[0].completed = true;
      updateTrayectory(trayectoria);
      startRuning(true);
      return;
    }
    if (!insideNextSteep) {
      return;
    }
    const newTra = [...(trayectoria || [])];
    newTra[newTra.length - zonesToComplete - 1] = {
      ...newTra[newTra.length - zonesToComplete - 1],
      completed: true,
      completedAt: Date.now(),
    };

    if (zonesToComplete > 1) {
      newTra[newTra.length - zonesToComplete] = {
        ...newTra[newTra.length - zonesToComplete],
        completed: true,
      };
      return updateTrayectory(newTra);
    }
    handleStopTimer(true, newTra);
  };
  useEffect(() => {
    let distance = 0;

    if (typeof trayectoria[0]?.distanceToNext === 'function') {
      distance = trayectoria[0]?.distanceToNext();
    } else {
      distance = Number(trayectoria[0]?.distanceToNext || 0);
    }
    distance = Number(Number(distance).toFixed(2));
    if (distance !== distanceTotal) updateDistanceTotal(distance);
  }, [trayectoria, updateDistanceTotal]);
  useEffect(() => {
    if (!userCords) {
      if (isInStart) setIsInStart(false);
      if (isInEnd) setIsInEnd(false);
      if (insideExternalZone) setInsideExternalZone(false);
      return;
    }
    const pt = turf.point(userCords);
    const poly = turf.polygon([startKlimbCoords]);
    const poly2 = turf.polygon([endKlimbCoors]);
    const external = turf.polygon(externalAreaCoords.geometry.coordinates);

    const isInsideStart = turf.booleanPointInPolygon(pt, poly);
    const isInsideEnds = turf.booleanPointInPolygon(pt, poly2);
    const isInsideExternalZone = turf.booleanPointInPolygon(pt, external);
    if (isInStart !== isInsideStart) setIsInStart(isInsideStart);
    if (isInEnd !== isInsideEnds) setIsInEnd(isInsideEnds);
    if (insideExternalZone !== isInsideExternalZone) setInsideExternalZone(isInsideExternalZone);
  }, [setIsInEnd, setIsInStart, userCords]);

  const startPolygonCoordinates = useMemo(() => startKlimbCoords.map(coord => ({ latitude: coord[1], longitude: coord[0] })), [startKlimbCoords])
  const endPolygonCoordinates = useMemo(() => endKlimbCoors.map(coord => ({ latitude: coord[1], longitude: coord[0] })), [endKlimbCoors])
  const externalPolygonCoordinates = useMemo(() => externalAreaCoords?.geometry?.coordinates[0]?.map(coord => ({ latitude: coord[1], longitude: coord[0] })), [externalAreaCoords])
  const getTrayectoria = (type: string) => {
    return (trayectorias as any)[type] as trayectoriaType[] | undefined;
  };

  useEffect(() => {
    if (!userCords) {
      if (distanceLeft !== 0) updateDistanceLeft(0);
      if (insideNextSteep) setInsideNextSteep(false);
      return;
    }
    const pt = turf.point(userCords);
    if (nextZone?.area) {
      const lineEnd = turf.lineString([
        nextZone.pointToDistance || startRouteCoords,
        userCords,
      ]);
      let distance = 0;
      if (typeof nextZone.distanceToNext === 'function') {
        distance = nextZone.distanceToNext(userCords);
      } else {
        distance = Number(nextZone.distanceToNext || 0);
      }
      const distanceEnd = turf.length(lineEnd, { units: 'feet' });
      const distanceEndFixed = Number(Number(distanceEnd + distance).toFixed(2));
      if (distanceEndFixed !== distanceLeft) updateDistanceLeft(distanceEndFixed);

      const nextS = turf.polygon([nextZone?.area]);
      const isInsideNextSteep = turf.booleanPointInPolygon(pt, nextS);
      setInsideNextSteep(isInsideNextSteep);
    } else if (insideNextSteep || distanceLeft !== 0) {
      setInsideNextSteep(false);
      updateDistanceLeft(0);
    }
  }, [userCords, distanceLeft, nextZone, updateDistanceLeft]);

  const forceStartKlimb = () => {
    if (!isRunning) {
      const type = `${workOutType}_1`;
      let trayectoria = getTrayectoria(type);

      if (!trayectoria) {
        return;
      }

      trayectoria[0].completed = true;
      updateTrayectory(trayectoria);
      startRuning(true);
      return;
    }
  }

  const forceFinishKlimb = () => {
    
    if (isRunning) {
      const newTra = [...(trayectoria || [])];
      
      newTra[newTra.length - 1] = {
        ...newTra[newTra.length - 1],
        completed: true,
        completedAt: Date.now(),
      };
      
      handleStopTimer(true, newTra);
    }
  }

  const getButtonColor = () => {
    if (
      (!isRunning && isInStart) ||
      (isRunning && (insideNextSteep || isInEnd))
    ) {
      return insideNextSteep && zonesToComplete <= 1 ? '#8A2715' : isInEnd && !insideNextSteep ? '#fff' : '#0E6036';
    }
    if (isRunning) {
      return !showStats ? '#fff' : '#0E6036';
    }
    return '#FFFFFF';
  };
  const getColor = () => {
    if (
      (!isRunning && isInStart) ||
      (isRunning && (insideNextSteep || isInEnd))
    ) {
      return isInEnd && !insideNextSteep ? '#0E6036' : '#fff';
    }
    if (isRunning) {
      return !showStats ? '#056135' : '#fff';
    }
    return '#fff';
  };
  const getColor2 = () => {
    return !isRunning
      ? (!isInStart ? '#000' : '#fff')
      : !(insideNextSteep && zonesToComplete <= 1) ? '#000' : '#fff'
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setShowAboutLevels(false)
    }, 1000 * 10);
    return () => {
      clearTimeout(time);
    };
  }, [showAboutLevels])

  return (
    <View style={styles.container}>
      {/* <View>
        <Text>user location</Text>
        <Text>{userCords?.join(',')}</Text>
      </View> */}
    <MapView
        style={{ flex: 1 }}
        region={defaultRegion}
        ref={(ref) => (mapRef.current = ref)}
        onMapReady={() =>
          mapRef.current.animateCamera(
            {
              center: {
                latitude: 21.28241649848108,
                longitude: -157.6897716522217,
              },
              pitch: 30,
              heading: 52,
              altitude: 1600,
              zoom: 1,
            },
            { duration: 3000 }
          )
        }
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {Array.isArray(userCords) && userCords.length > 1 && (
          <Marker
            coordinate={{
              latitude: userCords[1],
              longitude: userCords[0],
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
          />
        )}
        <Polygon
          fillColor={isLocal ? '#FFFACD44' : '#ffffff1A'}
          strokeColor="#00000000"
          coordinates={externalPolygonCoordinates}
        />
        <Polygon
          fillColor="#05613580"
          strokeColor="#00000000"
          coordinates={startPolygonCoordinates}
        />
        <Polygon
          fillColor={isLocal ? 'red' : '#05613580'}
          strokeColor="#00000000"
          coordinates={endPolygonCoordinates}
        />
      </MapView>
      <TouchableOpacity
        onPress={() => {
          console.log('reloading...');
          navigation.replace('Klimber')
        }}
        style={styles.reload}
      >
        <Icon name="reload1" type='antdesign' size={35} color="#0E6036" />
      </TouchableOpacity>
      {Boolean(showStats) && (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            paddingTop: 135,
            position: 'absolute',
            width: '100%',
            backgroundColor: '#fff',
            height: '100%',
          }}>
          <Text allowFontScaling={false} style={styles.titleStats}>ELAPSED TIME</Text>
          <Text allowFontScaling={false} style={{ ...styles.statsText, marginTop: 23 }}>{timer}</Text>

          <Text allowFontScaling={false} style={{ ...styles.titleStats, marginTop: 50 }}>
            DISTANCE TO FINISH
          </Text>
          <Text allowFontScaling={false} style={styles.statsText}>{`${distanceLeft ?  Math.round(distanceLeft) : null} Feet`}</Text>

          <Text allowFontScaling={false} style={{ ...styles.titleStats, marginTop: 35 }}>
            WORKOUT TYPE
          </Text>
          <Text allowFontScaling={false}
            style={{
              ...styles.statsText,
              marginTop: 10,
              textTransform: 'capitalize',
            }}>
            {workOutType}
          </Text>
        </View>
      )}
      <View style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
        <View style={{ height: 50, width: 40, marginTop: 60, alignSelf: 'center' }}>
          <Image
            source={require('../../assets/klimber/logo-black.png')}
            style={{ width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center', position: 'absolute', tintColor:!showStats ? '#fff' : '#0E6036'}}
          />
        </View>
        {/* <View style={{ ...styles.timer, width: '80%', alignSelf: 'center' }}>
          <Text allowFontScaling={false} style={[styles.timerText, { fontSize: 12 }]}>{userCords?.join(', ')}</Text>
          <Text allowFontScaling={false} style={[styles.timerText, { fontSize: 16 }]}>InStart: {isInStart ? 'true' : 'false'}, InEnd: {isInEnd ? 'true' : 'false'}</Text>
        </View> */}
        {!showStats && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 14.84,
              height: 62,
              justifyContent: 'center',
            }}>
            <View style={{ ...styles.timer }}>
              <Text allowFontScaling={false} style={styles.timerText}>{timer}</Text>
            </View>
            {!isRunning && (
              <TouchableOpacity
                onPress={() => navigation.navigate('TabBar')}
                style={styles.closeScreen}
                activeOpacity={1}>
                <Icon name="arrow-back" type="ionicon" size={40} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {isRunning && (
        <TouchableOpacity
          onPress={() => setShowStats(!showStats)}
          style={styles.switchScreenButton}
          activeOpacity={1}>
          {Boolean(showStats) && (
            <Icon name="location-on" type='material' size={30} color="#fff" />
          )}
          {!showStats && (
            <Icon name="chart-timeline-variant" type='material-community' size={30} color="#fff" />
            // <Image source={require('../../assets/klimber/stats-icon.png')} />
          )}
        </TouchableOpacity>
      )}
      {isRunning && (
        <TouchableOpacity
          onPress={() => setShowInfoModal(true)}
          style={{ ...styles.switchScreenButton, left: 15 }}
          activeOpacity={1}>
          <Icon name="help-sharp" type='ionicon' size={50} color="#fff" />
        </TouchableOpacity>
      )}
      <View
        style={{
          flex: showStats ? 1 : 0,
          justifyContent: 'flex-end',
          margin: 0,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          elevation: 10,
          //shadow top
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
          {!isRunning && !isInStart && (
          <TouchableOpacity
            onPress={() => setShowForceStartModal(true)}
            style={styles.forceStart}
            activeOpacity={1}>
              <Text numberOfLines={2} style={[styles.timerText, {fontSize: 12, color: '#fff', lineHeight: 20}]}>Force Start</Text>
          </TouchableOpacity>
        )}
        {isRunning && !isInEnd && (
          <TouchableOpacity
            onPress={() => setShowForceFinishModal(true)}
            style={{ ...styles.forceStart, backgroundColor: 'red', }}
            activeOpacity={1}>
              <Text numberOfLines={2} style={[styles.timerText, {fontSize: 12, color: '#fff', lineHeight: 20}]}>Force Finish</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleButton}
          onLongPress={() => {
            if (isRunning && !insideNextSteep) {
              setShowAboutLevels(true)
            }
          }}
          disabled={!isInEnd && !isInStart && !isRunning}
          style={{
            ...styles.button,
            backgroundColor: getButtonColor(),
          }}
          // !showStats && isRunning ? '#FFFFFF' : '#0E6036'
          activeOpacity={1}>
          {Boolean(isRunning) && (
            <Text allowFontScaling={false}
              style={{
                ...styles.buttonLabel,
                color: getColor(),
              }}>
              {insideNextSteep
                ? zonesToComplete <= 1
                  ? 'Finish Klimb'
                  : 'Descend Down'
                : 'Klimb in Progress'}
            </Text>
          )}
          <Text allowFontScaling={false}
            style={{
              ...styles.buttonLabel,
              color: getColor2(),
              textAlign: 'center',
              fontSize: !isRunning ? 24 : 16,
              fontWeight: !isRunning ? '600' : '400',
            }}>
            {!isRunning
              ? (!isInStart ? 'Move to the starting zone to start Klimb' : 'Start Klimb')
              : !(insideNextSteep && zonesToComplete <= 1) ? 'Press and Hold To Cancel Klimb' : ''}
          </Text>
          {/* <Text allowFontScaling={false}
            style={{
              ...styles.buttonLabel,
              color: getColor2(),
              fontSize: 14,
              width: '100%',
              paddingLeft: 20
            }}>
            Workout: {workOutType}
          </Text> */}
        </TouchableOpacity>
      </View>
      <ActionPopup
        isOpen={showAboutLevels}
        onClose={() => {
          setShowAboutLevels(false)
          isRunning && handleCancelKlimb();
        }}
        text='Are you sure you want to cancel your klimb'
        cancelText='YES, CANCEL'
        continueText='NO, CONTINUE'
        onAccept={() => {
          setShowAboutLevels(false);
        }}
      />
      <ActionPopup
        isOpen={showForceStartModal}
        onClose={() => {
          setShowForceStartModal(false)
          forceStartKlimb();
        }}
        text='Are you sure you want to forcefully start your klimb'
        cancelText='YES, Start'
        continueText='NO'
        onAccept={() => {
          setShowForceStartModal(false);
        }}
      />
      <ActionPopup
        isOpen={showForceFinishModal}
        onClose={() => {
          setShowForceFinishModal(false)
          forceFinishKlimb();
        }}
        text='Are you sure you want to forcefully finish your klimb'
        cancelText='YES, Finish'
        continueText='NO, CONTINUE'
        onAccept={() => {
          setShowForceFinishModal(false);
        }}
      />

      <WorkTypeInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onSelected={() => setShowInfoModal(false)}
        type={workOutType}
        startText="DONE"
        isModal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    zIndex: 999,
    left: 20,
  },
  timer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 158,
    height: 62,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  timerText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 30,
    lineHeight: 34.92,
    color: '#000000',
  },
  titleStats: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 30,
    lineHeight: 34.92,
    color: '#0E6036',
  },
  statsText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 60,
    lineHeight: 69.84,
    color: '#000000',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  switchScreenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#0E6036',
    position: 'absolute',
    bottom: 104,
    right: 15,
    zIndex: 2,
  },
  shiftLocation: {
    bottom: 200,
    right: 15,
  },
  shiftEnd: {
    padding: 10,
    borderRadius: 60,
    backgroundColor: '#0E6036',
    position: 'absolute',
    right: 15,
    zIndex: 2,
    bottom: 300,
  },
  reload: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 200,
    right: 15,
    zIndex: 2,
  },
  forceStart: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 85,
    backgroundColor: '#0E6036',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 84,
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 27.94,
    paddingRight: 60
  },
});