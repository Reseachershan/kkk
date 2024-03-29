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
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
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
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 45,
    lineHeight: 81.48,
    color: '#FFFFFF',
  },
  workOutType: {
    right: 0,
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 23,
    color: '#FFFFFF',
    marginTop: 3,
    marginLeft: 3,
  },
  klimbYear: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 13.97,
    color: '#FFFFFF',
  },
  klimbMonthAndDay: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 25,
    lineHeight: 26,
    color: '#FFFFFF',
  },
  klimbLocalTime: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 17.64,
    color: '#FFFFFF',
  },
  klimbAMandPM: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 18.95,
    color: '#FFFFFF',
  },
  klimbTemperature: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16.3,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  currentYear: {
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 28.95,
    color: '#FFFFFF',
  },
  userTotalKlimbs: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 30,
    color: '#FFFFFF',
    marginTop: -12
  },
  userName: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 18.62,
    color: '#FFFFFF',
  },
  levelIcon: {
    width: 65,
    height: 65,
  },
  firstBlock: {
    marginLeft: 90,
    width: 110,
    height: 30,
    backgroundColor: 'rgba(242, 75, 153, 0.8)',
    position: 'absolute',
    bottom: 235
  },
  secondBlock: {
    position: 'absolute',
    bottom: 140,
    right: 0,
    width: 190,
    height: 95,
    backgroundColor: 'rgba(217, 30, 65, 0.8)',
  },
  thirdBlock: {
    right: 0,
    width: 168,
    height: 80,
    backgroundColor: 'rgba(217, 105, 7, 0.8)',
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 5
  },
  fourthBlock: {
    position: 'absolute',
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(242, 75, 153, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export const KlimbSummary3 = (props: any) => {
  const { customImage, workout } = props;
  const { user } = useUser();

  const time = useMemo(() => {
    return getTimeFormat(workout?.elapsedTime || 0, 0, true, "mm:ss");
  }, [workout]);

  return (

    <View style={{
      width: '100%', height: '100%' 
    }}>
      <ImageBackground
        source={
          Boolean(customImage && isNaN(customImage))
            ? { uri: customImage }
            : require('../../assets/klimb-summary-picker/first-screen.png')
        }
        imageStyle={{
          resizeMode: 'cover'
        }}
        style={styles.backgroundImage}>
        <View style={{ flex: 1, justifyContent: 'flex-end', margin: 0 }}>
          <View style={styles.firstBlock}>
            <Text allowFontScaling={false}
              style={styles.workOutType}>{`${workout.workOutType?.toUpperCase()} KLIMB`}</Text>
          </View>
          <View style={styles.secondBlock}>
            <View style={{ position: 'absolute', top: -30 }}>
              <Text allowFontScaling={false} style={styles.klimbTime}>{time ? time : null}</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 0, left: 4 }}>
              <Text allowFontScaling={false} style={styles.klimbYear}>
                {moment(workout.startTime).format('YYYY')}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text allowFontScaling={false} style={styles.klimbLocalTime}>
                  {moment(workout.startTime).format('MMM Do')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text allowFontScaling={false} style={styles.klimbAMandPM}>
                  {moment(workout.date).format('HH:mm:ss')}
                </Text>
                <Text allowFontScaling={false} style={{...styles.klimbAMandPM, fontSize: 8}}>
                {moment(workout.startTime).format('A').includes('PM') ? 'PM  ' : 'AM  '}
              </Text>
                <Text allowFontScaling={false} style={styles.klimbTemperature}> {workout.temp}°F</Text>
              </View>
            </View>
          </View>

          <View style={styles.thirdBlock}>
            <View>
              <Text style={{ ...styles.userName, width: 112, height: 20, overflow: 'hidden' }}>@{user?.userName}</Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.currentYear}>{`${moment(workout.date).format(
                'YYYY',
              )} KLIMBS`}</Text>
            </View>
            <Text allowFontScaling={false} style={styles.userTotalKlimbs}>{user?.totalKlimbsAll}</Text>
            <View style={{ position: 'absolute', right: "0%", bottom: 0 }}>
            <Image source={getLevelImage(user?.klimbLevel)} style={styles.levelIcon} />
          </View> 
          </View>

          <View style={styles.fourthBlock} >
            <View>
              <KlimbScreenLogo color='white' width={50} height={50} />
            </View>
          </View>
          
        </View>
      </ImageBackground>
    </View>
  );
};
