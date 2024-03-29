import React, { FC, ReactNode, useMemo, useState } from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import moment from 'moment';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import useUser from '../../hooks/useUser';
import { getLevelImage } from '../../utils/klimb';
import { getTimeFormat } from '../../hooks/useTracker';

const { width } = Dimensions.get('window');
const ratio = width / 390;

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
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 23,
    color: '#FFFFFF',
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
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    marginTop: -5
  },
  klimbLocalTime: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 17.64,
    color: '#FFFFFF',
    marginTop: -5
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
    marginTop: -5
  },
  currentYear: {
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28.95,
    color: '#FFFFFF',
    paddingRight: 10
  },
  userTotalKlimbs: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 45,
    lineHeight: 42,
    color: '#FFFFFF',
    marginTop: -5,
    paddingRight: 5
  },
  userName: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 18.62,
    color: '#FFFFFF',
    width: 120,
    height: 20,
    overflow: 'hidden',
    left: 0,
    position:'absolute',
  },
  levelIcon: {
    width: 65,
    height: 65,
    top: 30
  },
  firstBlock: {
    position: 'absolute',
    width: 95,
    height: 270,
    backgroundColor: 'rgba(43, 165, 218, 0.8)',
    zIndex: 11
  },
  secondBlock: {
    position: 'absolute',
    width: 130,
    height: 55,
    left: 95,
    top: 70,
    backgroundColor: 'rgba(86, 204, 242, 0.8)',
  },
  thirdBlock: {
    position: 'absolute',
    width: 105,
    height: 55,
    left: 95,
    top: 125,
    backgroundColor: 'rgba(35, 130, 136, 0.8)',
  },
});

export const KlimbSummary2 = (props: any) => {
  const { customImage, workout } = props;
  const { user } = useUser();

  const time = useMemo(() => {
    return getTimeFormat(workout?.elapsedTime || 0, 0, true, "mm:ss");
  }, [workout]);
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
          resizeMode: 'cover'
        }}
        style={styles.backgroundImage}>
        <Animated.View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginHorizontal: 14.5,
            marginTop: 40,
            zIndex: 1,
            position: 'absolute',
            right: 0,
          }}>
        </Animated.View>

        <View style={styles.firstBlock}>
        <View style={{ marginLeft: 5, position: 'absolute', top: 15, left: "5%" }}>
          <KlimbScreenLogo color='white' width={50} height={50} />
        </View>

        <View style={{ position: 'absolute', top: 60, left: 3, minWidth: 200 }}>
          <Text allowFontScaling={false} style={styles.klimbTime}>{time ? time : null}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: "2%",
            left: "15%",
            width: 96,
            alignItems: 'center',
          }}>
          <Text allowFontScaling={false} style={{ ...styles.currentYear, fontSize: 14 }}>{`${moment(workout.date).format(
            'YYYY',
          )} KLIMBS`}</Text>
          <Text allowFontScaling={false} style={{ ...styles.userTotalKlimbs, fontSize: 35, }}>{user?.totalKlimbsAll}</Text>
        </View>
        <RotateLabel>
          <Text allowFontScaling={false} style={styles.userName}>@{user?.userName}</Text>
        </RotateLabel>
        <View
          style={{
            position: 'absolute',
            bottom: 95,
            left:10,
            width: 96,
            alignItems: 'center',
          }}>
          <Image source={getLevelImage(user?.klimbLevel)} style={styles.levelIcon} />
        </View>
        </View>
        <View style={styles.secondBlock}>
        <View style={{ position: 'absolute', top: '5%', left: "2%" }}>
          <Text allowFontScaling={false}
            style={styles.workOutType}>{`${workout.workOutType?.toUpperCase()} KLIMB`}</Text>
        </View>
        </View>
        <View style={styles.thirdBlock}>
        <View style={{ position: 'absolute', top: '12%',left:5}}>
          <Text allowFontScaling={false} style={styles.klimbYear}>
            {moment(workout.startTime).format('YYYY')}
          </Text>

          <Text allowFontScaling={false} style={styles.klimbMonthAndDay}>
            {moment(workout.startTime).format('MMM Do')}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.klimbTemperature}>{workout.temp}°F</Text>
          </View>
          <View
          style={{
            position: 'absolute',
            top: 276,
            right: width - 115,
            alignItems: 'flex-end',
          }}>
          <Text allowFontScaling={false} style={styles.currentYear}>{`${moment(workout.date).format(
            'YYYY',
          )} KLIMBS`}</Text>
          <Text allowFontScaling={false} style={styles.userTotalKlimbs}>{user?.totalKlimbsAll}</Text>
        </View>
        </View>
        
        </View>
      </ImageBackground>
    </View>
  );
};
const RotateLabel: FC<{ children: ReactNode }> = ({ children }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View
      onLayout={e => setSize(e.nativeEvent.layout)}
      style={{
        position: 'absolute',
        bottom: '2%',
        left: 1,
        transform: [
          { rotate: '270deg' },
          { translateX: (size.width - size.height) / 2 },
          { translateY: (size.height - size.width) / 2 },
        ],
      }}>
      {children}
    </View>
  );
};
