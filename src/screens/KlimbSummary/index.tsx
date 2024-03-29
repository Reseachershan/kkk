import React, {useMemo} from 'react';
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
import {getLevelImage} from '../../utils/klimb';
import {getTimeFormat} from '../../hooks/useTracker';
import ShareKlimbBottom from '../../assets/share/ShareBottom.png';
import Logo from '../../assets/share/Logo.svg';

const win = Dimensions.get('window');
const ratio = win.width / 390;

const styles = StyleSheet.create({
  backgroundImage: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
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
    fontFamily: 'Good Times',
    fontWeight: '700',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: -10,
    textShadowColor: '#056135',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1
  },
  workOutType: {
    fontFamily: Platform.OS === 'ios' ? 'GoodTimesRg-Bold' : 'NATS-Regular',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 10,
    fontStyle: 'italic',
    textShadowColor: '#056135',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
    fontWeight:'400'
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
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 15,
    color: '#FFFFFF',
    paddingTop: 10,
    textAlign: 'center',
    textShadowColor: '#056135',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
    fontStyle: 'italic',
  },
  klimbLocalTime: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 17.64,
    color: '#FFFFFF',
    textAlign: 'left',
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
    bottom: '72%',
    fontFamily: Platform.OS === 'ios' ? 'NATS' : 'NATS-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 28.95,
    color: '#FFFFFF',
    right: 5,
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
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
    maxWidth: 200,
    overflow: 'hidden',
    textAlign: 'center',
    textShadowColor: '#056135',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2,
    fontStyle: 'italic',
    paddingTop: 4
  },
  levelIcon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: -15
  },
  firstBlock: {
    position: 'absolute',
    width: '70%',
    height: 200,
    top: 20,
    zIndex: 11,
    alignSelf: 'center',
  },
  secondBlock: {
    position: 'absolute',
    width: 35,
    height: 150,
    left: '50%',
    bottom: 70,
    backgroundColor: 'rgba(130, 167, 9, 0.8)',
  },
  thirdBlock: {
    position: 'absolute',
    width: '52%',
    height: 70,
    left: '50%',
    backgroundColor: 'rgba(44, 146, 97, 0.8)',
    zIndex: 111,
  },
  glowingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#056135',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 1,
  },
});

export const KlimbSummary = (props: any) => {
  const {customImage, workout} = props;
  const {user} = useUser();

  const time = useMemo(() => {
    return getTimeFormat(workout?.elapsedTime || 0, 0, true, 'mm:ss');
  }, [workout]);

  const [hours, minutes, seconds] = (time.split(':').length == 2 ? `00:${time}` : time)?.split(':');
  
  function splitStringByAMPM(str: any) {
    const parts = str.split(/\b(am|pm)\b/i);
    const result = parts.filter((part: any) => part.trim() !== '');
    const finalResult = result.map((part: any) =>
      part.replace(/\b(am|pm)\b/i, '').trim(),
    );
    return finalResult;
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 12,
      }}>
      <ImageBackground
        source={
          Boolean(customImage && isNaN(customImage))
            ? {uri: customImage}
            : require('../../assets/klimb-summary-picker/first-screen.png')
        }
        imageStyle={{
          resizeMode: 'cover',
        }}
        style={styles.backgroundImage}>
        <View style={{flex: 1, justifyContent: 'flex-end', margin: 0}}>
          <View style={styles.firstBlock}>
            <Text allowFontScaling={false} style={{...styles.klimbMonthAndDay, fontWeight:'400'}}>
              {moment(workout.startTime).format('MMM Do YYYY')}
            </Text>
            <Text allowFontScaling={false} style={{...styles.workOutType}}>
              {`${workout.workOutType?.toUpperCase()} KLIMB`}
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View>
                <Text style={{...styles.klimbTime, fontStyle:'italic'}}>{hours ? hours : null}</Text>
                <Text
                  style={{
                    ...styles.klimbTime,
                    fontSize: 8,
                    fontWeight: '400',
                    marginTop: 0.4,
                    fontStyle:'italic',
                    color:'white'
                  }}>
                  HR
                </Text>
              </View>
              <Text style={{...styles.klimbTime, fontStyle:'italic'}}>:</Text>
              <View>
                <Text style={{...styles.klimbTime, fontStyle:'italic'}}>{minutes ? minutes : null}</Text>
                <Text
                  style={{
                    ...styles.klimbTime,
                    fontSize: 8,
                    fontWeight: '400',
                    marginTop: 0.4,
                    color:'white',
                    fontStyle:'italic'
                  }}>
                  MIN
                </Text>
              </View>
              <Text style={{...styles.klimbTime, fontStyle:'italic'}}>:</Text>
              <View>
                <Text style={{...styles.klimbTime, fontStyle:'italic'}}>{seconds ? seconds : null}</Text>
                <Text
                  style={{
                    ...styles.klimbTime,
                    fontSize: 8,
                    fontWeight: '400',
                    marginTop: 0.4,
                    color:'white',
                    fontStyle:'italic'
                  }}>
                  SEC
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={{...styles.userName}}>
              @{user?.userName}
            </Text>

            <Image
              source={getLevelImage(user?.klimbLevel)}
              style={styles.levelIcon}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'GoodTimesRg-Bold',
                fontWeight: '400',
                fontSize: 22,
                color: '#FFFFFF',
                textAlign: 'center',
                bottom: '12%',
                fontStyle:'italic',   
                textShadowColor: 'black',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 1,
              }}>
              {user?.totalKlimbsAll}
            </Text>
          </View>
            <View style={{position:'absolute', width:'100%', bottom:0}}>
            <Image
            resizeMode="stretch"
            style={{height: 330, width: '100%', position:'absolute', bottom: -10}}
            source={ShareKlimbBottom}
          />
          <Image
            resizeMode="stretch"
            style={{position:'absolute', height: 330, width: '100%', bottom:0}}
            source={ShareKlimbBottom}
          />
            </View>
          
          <View style={{position: 'absolute', bottom: 0, right: 0}}>
            <Logo />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
