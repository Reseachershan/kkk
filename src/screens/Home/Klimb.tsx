import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import ExclamationIcon from '../../assets/home/exclamationIcon.svg';
import ProfileIcon from '../../assets/home/ProfileIcon.svg';
import DownIcon from '../../assets/home/down_icon.svg';

import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import SingleGridCard from '../../components/SingleGridCard';
import {GoButton} from './components/GoButton';
import WorkOutTypesModal from './components/WorkOutTypesModal';
import UserInfo from '../../components/UserInfo';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import useWorkOut from '../../hooks/useWorkOut';
import useGeo from '../../hooks/useGeo';
import {
  observeBestUserWorkout,
  observeLastUserWorkout,
} from '../../services/workout';
import useUser from '../../hooks/useUser';
import {getTimeFormat} from '../../hooks/useTracker';
import { NumberProp } from 'react-native-svg';
import moment from 'moment';

const {height} = Dimensions.get('window');

interface dashboardGridsType {
  id: number;
  title: string;
  value: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    overflow: 'hidden',
    width: '100%',
    height: height,
  },
  header: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationText: {
    marginTop: 9.91,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 13,
    color: '#343434',
  },
  temperatureText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    color: '#343434',
  },
  temperatureSign: {
    marginTop: 5,
    marginLeft: 3.1,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 9,
    lineHeight: 11,
    color: '#343434',
  },
  dashboardGrids: {
    paddingHorizontal: 20,
  },
  gridValue: {
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 25.61,
    color: '#000000',
  },
  userWorkout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  workOutTypeText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 16,
    color: '#000000',
    marginTop: 8
  },
  workOutSelectText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 21,
    color: '#000000',
    textTransform: 'uppercase',
  },
  startWorkOutText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    color: '#000000',
  },
  
  image: {
    width: 40,
    height: 40,
  },
});

const Klimb = () => {
  const navigation = useNavigation<any>();
  const {user} = useUser();
  const { workOut: {workOutType,elapsedTime,}, updateWorkOut } = useWorkOut();
  const [isWorkOutTypesModalVisible, setIsWorkOutTypesModalVisible] = useState(false);

  const [analyticData, setAnalyticData] = useState({
    lastTime: 0,
    bestTime: 0,
    totalKlimbs: 0,
    totalKlimbsAll: 0,
  });
  const [temperature, setTemperature] = useState({
    temp: 0,
    units: 'C',
  });
  const [tempMax, setTempMax] = useState<any>('')
  const [tempMin, setTempMin] = useState<any>('')
  const [icon, setIcon] = useState<any>('')

  useEffect(() => {
    if (user?.temperatureUnit) {
      getOpenWeather(user?.temperatureUnit)
    }
  }, [user])

  const getOpenWeather = async (temp: string) => {
    try{
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=21.2811257&lon=-157.6904359&units=metric&appid=973ab808187e7299cbf50afdfab230e7`);
      const data = await res.json();
      if (temp === 'C') {
        setTempMax(data?.main?.temp_max)
        setTempMin(data?.main?.temp_min)
      } else {
        const temp_max = (data?.main?.temp_max * 9/5) + 32
        const temp_min = (data?.main?.temp_min * 9/5) + 32
        setTempMax(temp_max)
        setTempMin(temp_min)
      }
      setIcon(data?.weather[0]?.icon)
    }
    catch(error){
      console.log(error);
    }
  }
  

  const getWeather = async () => {  
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=21.2811257&longitude=-157.6904359&hourly=temperature_2m&current_weather=true`);
      const data = await res.json();
      const {hourly_units, hourly} = data;
      let units = hourly_units.temperature_2m || 'F';
      units = units.replace('°', '').toUpperCase();
      let temp = 0;
      const dateNow = new Date();
      const {temperature_2m, time} = hourly;
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

  useEffect(() => {
    getWeather();
  }, []);

  useEffect(() => {
    setAnalyticData(prev => ({
      ...prev,
      lastTime: Number(elapsedTime || 0),
      totalKlimbsAll: user ? user.totalKlimbsAll : 0,
      totalKlimbs: user ? user.totalKlimbsAll : 0,
      // bestTime: 
    }));
  }, [elapsedTime, user])

  const weather = useMemo(() => {
    const {temp, units} = temperature;
    const userUnits = user?.temperatureUnit || 'C';
    if (units === userUnits) {
      return {
        temperature: temp,
        units: userUnits,
      };
    }
    if (units === 'C') {
      const f = Number(Number((temp * 9) / 5 + 32).toFixed(1));
      return {
        temperature: f,
        units: userUnits,
      };
    }
    const c = Number(Number(((temp - 32) * 5) / 9).toFixed(1));
    return {
      temperature: c,
      units: userUnits,
    }
  }, [temperature, user?.temperatureUnit])

  useEffect(() => {
    setAnalyticData(prev => ({
      ...prev,
      totalKlimbs: user?.totalKlimbs || 0,
      totalKlimbsAll: user?.totalKlimbsAll || 0,
    }));
  }, [user?.totalKlimbs, user?.totalKlimbsAll]);
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = observeLastUserWorkout(user?.uid, workout => {
      setAnalyticData(prev => ({
        ...prev,
        lastTime: Number(workout?.elapsedTime || 0),
      }));
    });
    const off1 = observeBestUserWorkout(user?.uid, workout => {
      setAnalyticData(prev => ({
        ...prev,
        bestTime: Number(workout?.elapsedTime || 0),
      }));
    });
    return () => {
      off();
      off1();
    };
  }, [user?.uid]);

  const dashboardGrids = useMemo(() => {
    return [
      {
        id: 1,
        title: 'LATEST TIME',
        value: getTimeFormat(analyticData.lastTime, 0),
      },
      {
        id: 2,
        title: 'BEST TIME',
        value: getTimeFormat(analyticData.bestTime, 0),
      },
      {
        id: 3,
        title: new Date().getFullYear() + ' KLIMBS',
        value: analyticData.totalKlimbs,
      },
      {
        id: 4,
        title: 'TOTAL KLIMBS',
        value: analyticData.totalKlimbsAll,
      },
    ];
  }, [analyticData]);
  const dashboardGridsGroup = useMemo(
    () =>
      dashboardGrids.reduce(
        (
          a: Array<dashboardGridsType[]>,
          b: dashboardGridsType,
          index: number,
        ) => {
          //group elements in groups of 2
          if (index % 4 === 0) {
            a.push([b]);
          } else {
            a[a.length - 1].push(b);
          }
          return a;
        },
        [],
      ),
    [dashboardGrids],
  );

  const WeatherIcon = ({ icon }: { icon: string }) => {
    return (
      <Image
        resizeMode='cover'
        style={{width:60, height:60}}
        onError={(err) => console.log('error', err)}
        source={{ uri: `https://openweathermap.org/img/wn/${icon}.png` }}
      />
    );
  };

  return (
    <>
      <WorkOutTypesModal
        isWorkOutTypesModalVisible={isWorkOutTypesModalVisible}
        workOutType={workOutType}
        setWorkOutType={updateWorkOut}
        setIsWorkOutTypesModalVisible={setIsWorkOutTypesModalVisible}
      />

      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/home/klimbBackground.png')}
          imageStyle={{
            resizeMode: 'cover',
            height: '100%',
          }}
          style={styles.backgroundImage}>
          <View style={{marginBottom: 75, flex: 1}}>
            <Animated.View
              style={{
                ...styles.header,
                paddingVertical: Platform.OS === 'ios' ? 55 : 35,
              }}>
              <Animated.View
                style={{
                  flexDirection: 'column',
                  marginTop: 10,
                  width: 70,
                  alignItems: 'center',
                }}
                entering={SlideInLeft.duration(800)}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('About')}>
                  <ExclamationIcon
                    width={40}
                    height={40}
                    style={{ alignSelf: 'center', marginTop: 0.2 }}
                  />
                </TouchableOpacity>

                <Text numberOfLines={1} allowFontScaling={false} style={styles.locationText}>Koko Crater</Text>
                {/* <WeatherIcon icon={icon} /> */}

                {Boolean(tempMax && tempMax) && <View style={{ flexDirection: 'row', marginTop: 0 }}>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Text allowFontScaling={false} style={styles.temperatureText}>
                      {parseInt(tempMax)}
                    </Text>
                    <Text allowFontScaling={false} style={styles.temperatureSign}>°</Text>
                  </View>
                  <Text allowFontScaling={false} style={styles.temperatureText}>
                    /
                  </Text>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Text allowFontScaling={false} style={styles.temperatureText}>
                      {parseInt(tempMin)}
                    </Text>
                    <Text allowFontScaling={false} style={styles.temperatureSign}>°</Text>
                  </View>
                </View>
                }
              </Animated.View>

              <Animated.View style={{flex: 1, alignItems: 'center'}}>
                <KlimbScreenLogo width={80} height={80} />
              </Animated.View>

              <Animated.View
                entering={SlideInRight.duration(800)}
                style={{
                  flexDirection: 'column',
                  marginTop: 10,
                  width: 70,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  activeOpacity={0.6}>
                  <ProfileIcon
                    width={40}
                    height={40}
                    style={{alignSelf: 'center', marginTop: 0.2}}
                  />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={{flex: 1, justifyContent: 'flex-end', marginBottom: 17}}
              entering={SlideInDown.duration(800)}>
              <View style={styles.dashboardGrids}>
                {dashboardGridsGroup.map((dashboardGrid, index: number) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {dashboardGrid.map((grid, gIndex) => (
                      <SingleGridCard
                        key={gIndex}
                        title={grid.title}
                        height={50}>
                        <Text allowFontScaling={false}
                          style={styles.gridValue}
                          adjustsFontSizeToFit
                          numberOfLines={1}>
                          {grid.value}
                        </Text>
                      </SingleGridCard>
                    ))}
                  </View>
                ))}
              </View>

              <UserInfo />

              <View style={styles.userWorkout}>
                <View
                  style={{
                    width: 178,
                    height: 140,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    padding: 12,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text allowFontScaling={false} style={styles.workOutTypeText}>WORKOUT TYPE</Text>

                  <TouchableOpacity
                    onPress={() => setIsWorkOutTypesModalVisible(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: 144,
                      height: 42,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      borderColor: '#000000',
                    }}
                    activeOpacity={0.6}>
                    <View style={{width: 8}} />
                    <Text allowFontScaling={false} style={styles.workOutSelectText}>{workOutType}</Text>
                    <View style={{marginRight: 8}}>
                    <DownIcon />
                    </View>
                  </TouchableOpacity>

                  <Text allowFontScaling={false} style={styles.startWorkOutText}>PRESS GO TO START</Text>
                </View>

                <View style={{alignSelf: 'center'}}>
                  <GoButton navigation={navigation} />
                </View>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Klimb;
