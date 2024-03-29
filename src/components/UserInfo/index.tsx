import React, { FC, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LevelsModal from '../../screens/Home/components/LevelsModal';
import LinearGradient from 'react-native-linear-gradient';
import useUser from '../../hooks/useUser';
import ProfileIcon from '../aplicationIcons/ProfileIcon';
import { getLevelImage, getNextKlimberLevelPercent, getNextKlimberLevelText, getNextKlimberLevelValue, getNextLevelImage } from '../../utils/klimb';
import FastImage from 'react-native-fast-image';

const UserInfo: FC = () => {
  const [isLevelsModalVisible, setIsLevelsModalVisible] = useState(false);
  const { user } = useUser();
  const leftToNextLevelText = useMemo(() => {
    return getNextKlimberLevelText(user?.totalKlimbs || 0);
  }, [user?.totalKlimbs]);
  const leftToNextLevelPercentage = useMemo(() => {
    return getNextKlimberLevelPercent(user?.totalKlimbs || 0) * 100;
  }, [user?.totalKlimbs]);
  return (
    <>
      <LevelsModal
        isLevelsModalVisible={isLevelsModalVisible}
        setIsLevelsModalVisible={setIsLevelsModalVisible}
        close={() => setIsLevelsModalVisible(false)}
      />
      <View style={styles.userInformation}>
        <View style={{ flex: 1, marginRight: 20, paddingVertical: 6 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 20,
              marginTop: 10
            }}>
            <FastImage
              style={{
                borderRadius: 100,
                overflow: 'hidden',
                height: 50,
                width: 50,
              }}
              source={user?.profileImage ? { uri: user.profileImage } : require('../../assets/profile/placeholder.png')}
            />

            <View
              style={{
                flexDirection: 'column',
                marginLeft: 9,
                marginBottom: 4,
              }}>
              <Text allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{...styles.userName, width:150}}
              >{user?.firstName}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
                style={{...styles.nickName, width:150}}>
                @{user?.userName}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.progressBar}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#23744D', '#23744D']}
                style={{ width: `${leftToNextLevelPercentage}%`, borderRadius: 7 }}
              />
            </View>
            {/* <Image
              source={getNextLevelImage(user?.klimbLevel)}
              style={{
                width: 55,
                height: 45,
                right: -20,
                top: -25,
                position: 'absolute',
              }}
            /> */}
          </View>
            <Text numberOfLines={1} allowFontScaling={false} style={styles.nextLevelText}>{leftToNextLevelText}</Text>
          </View>
        <TouchableOpacity onPress={() => setIsLevelsModalVisible(true)} style={styles.klimbLevel}>
          <Text allowFontScaling={false} style={styles.klimbLevelCategory}>{user?.klimbLevel}</Text>
          <View style={{ height: 70 }}>
            <Image
              source={getLevelImage(user?.klimbLevel)}
              style={{
                marginVertical: 10,
                width: 100,
                height: 100,
                alignSelf: 'center',
                bottom: 37,
              }}
            />
          </View>
          <Text allowFontScaling={false} style={styles.klimbLevelTitle}>VIEW KLIMB LEVELS</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
export default UserInfo;

const styles = StyleSheet.create({
  klimbLevel: {
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 10,
    // marginBottom: 11,
    width: 130,
    height:130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  klimbLevelTitle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 11,
  },
  klimbLevelCategory: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  userInformation: {
    marginTop: 14,
    marginHorizontal: 20,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#FFFEFE',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  userName: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    marginBottom: 4,
  },
  nickName: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: '#000000',
    textTransform: 'uppercase',
  },
  nextLevelText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontStyle: 'italic',
    fontSize: 11,
    color: '#000000',
    marginVertical: 12,
  },
  progressBar: {
    flexDirection: 'row',
    height: 17,
    borderWidth: 1,
    borderRadius: 8.5,
    borderColor: '#060606',
    width: '100%'
  },
  viewAllLevelsContainer: {
    marginTop: 8,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 8.5,
  },
  viewAllLevelsText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 10,
    color: '#000000',
  },
});
