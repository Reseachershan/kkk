import React, { useMemo } from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import moment from 'moment';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import useUser from '../../hooks/useUser';
import { getLevelImage } from '../../utils/klimb';
import { getTimeFormat } from '../../hooks/useTracker';

const win = Dimensions.get('window');
const ratio = win.width / 390;

const styles = StyleSheet.create({

  backgroundImage: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor:'grey'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#217232',
  },
  klimbTime: {
    marginLeft: 8,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 45,
    lineHeight: 81.48,
    color: '#FFFFFF',
  },
  workOutType: {
    marginLeft: 11,
    bottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 23,
    color: '#FFFFFF',
  },
  klimbYear: {
    textAlign: 'right',
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 13.97,
    color: '#FFFFFF',
  },
  klimbMonthAndDay: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 15,
    color: '#FFFFFF',
    paddingTop: 10
  },
  klimbLocalTime: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 17.64,
    color: '#FFFFFF',
    textAlign: 'left'
  },
  klimbAMandPM: {
    marginLeft: 0.5,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18.95,
    color: '#FFFFFF',
  },
  klimbTemperature: {
    marginLeft: 1,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 16.3,
    color: '#FFFFFF',
  },
  currentYear: {
    position: 'absolute',
    bottom: "72%",
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 28.95,
    color: '#FFFFFF',
    right: 5
  },
  userTotalKlimbs: {
    position: 'absolute',
    bottom: 10,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 52,
    color: '#FFFFFF',
  },
  userName: {
    position: 'absolute',
    bottom: 0,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 18.62,
    color: '#FFFFFF',
    maxWidth: 100,
    height: 20,
    overflow: 'hidden'
  },
  levelIcon: {
    position: 'absolute',
    bottom: 15,
    right: "30%",
    width: 50,
    height: 50,
  },
  firstBlock: {
    position: 'absolute',
    width: "50%",
    height: 200,
    bottom: 0,
    backgroundColor: 'rgba(5, 97, 53, 0.8)',
    zIndex: 11
  },
  secondBlock: {
    position: 'absolute',
    width: 35,
    height: 150,
    left: "50%",
    bottom: 70,
    backgroundColor: 'rgba(130, 167, 9, 0.8)',
  },
  thirdBlock: {
    position: 'absolute',
    width: "52%",
    height: 70,
    left: "50%",
    bottom: "0%",
    backgroundColor: 'rgba(44, 146, 97, 0.8)',
    zIndex: 111
  },
});

export const KlimbSummary1 = (props: any) => {
  const { customImage, workout } = props;
  const { user } = useUser();

  const time = useMemo(() => {
    return getTimeFormat(workout?.elapsedTime || 0, 0, true, "mm:ss");
  }, [workout]);

  function splitStringByAMPM(str: any) {
    const parts = str.split(/\b(am|pm)\b/i);
    const result = parts.filter((part: any) => part.trim() !== '');
    const finalResult = result.map((part: any) => part.replace(/\b(am|pm)\b/i, '').trim());
    return finalResult;
  }

  return (
    <View style={{
      width: '100%', height: '100%', borderRadius: 12
    }}>
      <ImageBackground
        source={
          Boolean(customImage && isNaN(customImage))
            ? { uri: customImage }
            : require('../../assets/klimb-summary-picker/first-screen.png')
        }
        imageStyle={{
          resizeMode: 'cover',
        }}
        style={styles.backgroundImage}>
        <View style={{ flex: 1, justifyContent: 'flex-end', margin: 0 }}>
          <View style={styles.firstBlock} >

          <View style={{ position: 'absolute', top: -20, minWidth: 200 }}>
            <Text style={styles.klimbTime}>{time ? time : null}</Text>
          </View>
          <View style={{ position: 'absolute', top: 45, left: 0 }}>
            <Text allowFontScaling={false}
              style={styles.workOutType}>{`${workout.workOutType?.toUpperCase()} KLIMB`}</Text>
          </View>

          <View style={{ position: 'absolute', bottom: 116, right: "10%" }}>
            <Text allowFontScaling={false} style={styles.klimbLocalTime}>
              {moment(workout.startTime).format('YYYY')}
            </Text>
          </View>

          <View style={{ position: 'absolute', bottom: 100, right: "10%", marginTop: 8 }}>
            <Text allowFontScaling={false} style={styles.klimbMonthAndDay}>
              {moment(workout.startTime).format('MMM Do')}
            </Text>
          </View> 
          <View style={{ position: 'absolute', bottom: 85, right: "10%" }}>
            <View style={{ flexDirection: 'row' }}>
              <Text allowFontScaling={false} style={styles.klimbLocalTime}>
                {moment(workout.startTime).format('HH:mm:ss')}
              </Text>
              <Text allowFontScaling={false} style={styles.klimbAMandPM}>
                {splitStringByAMPM(moment(workout.startTime).format('A'))} 
              </Text>
              <Text allowFontScaling={false} style={{...styles.klimbAMandPM, fontSize: 6}}>
                {moment(workout.startTime).format('A').includes('PM') ? 'PM  ' : 'AM  '}
              </Text>
              <Text allowFontScaling={false} style={styles.klimbTemperature}>{workout.temp}°F</Text>
            </View>
          </View>
          <View style={{ marginLeft: 10,position:'absolute', bottom: 0 }}>
            <KlimbScreenLogo color='white' width={50} height={50} />
          </View>
          </View>
          <View style={styles.secondBlock}></View>
          <View style={styles.thirdBlock}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: 190,
              height: 60,
              right: 5,
              bottom: 0,
            }}>
            <Image source={getLevelImage(user?.klimbLevel)} style={styles.levelIcon} />
            <Text allowFontScaling={false} style={styles.currentYear}>{`${moment(workout.date).format(
              'YYYY',
            )} KLIMBS`}</Text>
            <Text allowFontScaling={false} style={{ ...styles.klimbTime, fontSize: 30, bottom: "25%", right: 5 }}>{user?.totalKlimbsAll}</Text>
            <Text allowFontScaling={false} style={{ ...styles.userName, right: 2 }}>@{user?.userName}</Text>
          </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
