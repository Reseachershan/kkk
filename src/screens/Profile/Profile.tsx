import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  LogBox,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ToggleSwitch from 'toggle-switch-react-native';
import MyAccountModal from './components/MyAccountModal';
import useUser from '../../hooks/useUser';
import {logOut} from '../../services/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import UpdatePaswordModal from './components/UpdatePaswordModal';
import ProfileIcon from '../../components/aplicationIcons/ProfileIcon';
import {
  getNextKlimberLevelPercent,
  getNextKlimberLevelText,
} from '../../utils/klimb';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    paddingHorizontal: 21,
  },
  formInput: {
    paddingHorizontal: 18,
    height: 56,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
    color: '#8391A1',
    flex: 1,
  },
  body: {flex: 1},
  screenTitle: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 21,
    marginVertical: 12,
    color: '#181D27',
  },
  userInformation: {
    justifyContent: 'center',
    height: 89,
    borderRadius: 5,
    backgroundColor: '#056135',
  },
  userImage: {
    marginTop: 2,
    marginLeft: 16,
    marginRight: 13,
    width: 55,
    height: 55,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 100,
  },
  userName: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  progressBar: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 7,
    width: 142.56,
    height: 17,
    borderWidth: 1,
    borderRadius: 8.5,
    borderColor: '#ABAFAB',
  },
  nextLevelText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 11.64,
    color: '#EFF2F5',
  },
  listItemBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    height: 40,
    // backgroundColor: '#FFFFFF',
  },
  listIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#05613510',
  },
  listTitle: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    color: '#181D27',
  },
  listDescription: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 16,
    color: '#ABABAB',
  },
  listLabel: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
    color: '#181D27',
  },
  settingsText: {
    marginTop: 21,
    marginLeft: 10,
    fontFamily: 'DMSans-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 19,
    color: '#181D27',
    opacity: 0.8,
  },
});

export const Profile = () => {
  const navigation = useNavigation<any>();
  const [isMyAccountModalVisible, setIsMyAccountModalVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const userController = useUser();
  const {toggleProfileVisiblity, user, toggleEnabledLocation} = userController;
  const {toggleEnabledNotifications, toggleSystemUnit} = userController;
  const {toggleTemperature} = userController;
  const {hideProfile} = user || {};
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const handleLogOut = useCallback(() => {
    logOut();
    navigation.replace('SignIn');
  }, [navigation]);

  const profileOptionsArray = useMemo(
    () => [
      {
        id: 0,
        title: 'My Account',
        description: 'Make changes to your account',
        icon: require('../../assets/profile/myAccount-icon.png'),
        handleAction: (value: boolean) => setIsMyAccountModalVisible(value),
      },
      {
        id: 1,
        title: 'Change Password',
        description: 'Change password of your account',
        icon: require('../../assets/profile/changePassword-icon.png'),
        handleAction: (value: boolean) => setShowPasswordModal(value),
      },
      {
        id: 2,
        title: 'Log out',
        description: 'Further secure your account for safety',
        icon: require('../../assets/profile/logOut-icon.png'),
        handleAction: () => handleLogOut(),
      },
    ],
    [handleLogOut],
  );

  const settingsOptionsArray = useMemo(
    () => [
      {
        id: 4,
        title: 'Display Profile',
        description: 'Allows leaderboards access',
        icon: require('../../assets/profile/hideProfile-icon.png'),
        label: !hideProfile ? 'On' : 'Off',
        status: !hideProfile,
        setStatus: toggleProfileVisiblity,
      },
      {
        id: 2,
        title: 'Location Services',
        description: '',
        icon: require('../../assets/profile/location-icon.png'),
        label: user?.enabledLocation ? 'On' : 'Off',
        status: user?.enabledLocation,
        setStatus: toggleEnabledLocation,
      },
      {
        id: 3,
        title: 'Push Notifications',
        description: '',
        icon: require('../../assets/profile/pushNotifications-icon.png'),
        label: user?.enabledNotifications ? 'On' : 'Off',
        status: user?.enabledNotifications,
        setStatus: toggleEnabledNotifications,
      },
      {
        id: 0,
        title: 'Temperature',
        description: 'Celsius or Farenheit',
        icon: require('../../assets/profile/temperature-icon.png'),
        label: user?.temperatureUnit === 'C' ? '°C' : '°F',
        status: user?.temperatureUnit === 'F',
        setStatus: toggleTemperature,
      },
      {
        id: 1,
        title: 'Units',
        description: 'Metric or Imperial',
        icon: require('../../assets/profile/units-icon.png'),
        label: user?.systemUnit === 'imp' ? 'Imp' : 'Met',
        status: user?.systemUnit === 'imp',
        setStatus: toggleSystemUnit,
      },
    ],
    [
      hideProfile,
      toggleEnabledLocation,
      toggleEnabledNotifications,
      toggleProfileVisiblity,
      toggleSystemUnit,
      toggleTemperature,
      user?.enabledLocation,
      user?.enabledNotifications,
      user?.systemUnit,
      user?.temperatureUnit,
    ],
  );
  const leftToNextLevelText = useMemo(() => {
    return getNextKlimberLevelText(user?.totalKlimbs || 0);
  }, [user?.totalKlimbs]);
  const percent = useMemo(() => {
    return getNextKlimberLevelPercent(user?.totalKlimbs || 0) * 100;
  }, [user?.totalKlimbs]);
  return (
    <>
      <MyAccountModal
        isOpen={isMyAccountModalVisible}
        onClose={() => setIsMyAccountModalVisible(false)}
      />
      <UpdatePaswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            style={{marginTop: 10}}>
            <Image source={require('../../assets/profile/arrowLeft.png')} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <Text allowFontScaling={false} style={styles.screenTitle}>Profile</Text>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.userInformation}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginTop: 2,
                  marginLeft: 16,
                  marginRight: 13,
                }}>
                {user?.profileImage ? (
                  <FastImage
                    style={{
                      width: 55,
                      height: 55,
                      borderWidth: 3,
                      borderColor: '#FFFFFF',
                      borderRadius: 100,
                    }}
                    source={{uri: user?.profileImage}}
                  />
                ) : (
                  <ProfileIcon width={50} height={50} color="#fff" />
                )}
              </View>

              <View style={{flexDirection: 'column'}}>
                <Text allowFontScaling={false} style={styles.userName}>{user?.firstName}</Text>

                <View style={styles.progressBar}>
                  <LinearGradient
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['#6DA02A', '#FFF171']}
                    style={{width: `${percent}%`, borderRadius: 8.5}}
                  />
                </View>

                <Text allowFontScaling={false} style={styles.nextLevelText}>{leftToNextLevelText}</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 25,
              flexGrow: 0,
              borderRadius: 5,
              backgroundColor: '#FFFFFF',
              paddingVertical: 15
            }}>
            {profileOptionsArray.map((profileOption, i) => (
              <TouchableOpacity
                key={profileOption.id}
                onPress={() => profileOption.handleAction(true)}
                style={{
                  ...styles.listItemBody,
                  marginBottom: i < profileOptionsArray.length - 1 ? 26 : 0,
                }}
                activeOpacity={0.6}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.listIcon}>
                    <Image source={profileOption.icon} style={{height: '100%', width: '100%'}} />
                  </View>

                  <View style={{flexDirection: 'column', marginLeft: 16}}>
                    <Text allowFontScaling={false} style={styles.listTitle}>{profileOption.title}</Text>
                    <Text allowFontScaling={false} style={styles.listDescription}>
                      {profileOption.description}
                    </Text>
                  </View>
                </View>

                <Image
                  source={require('../../assets/profile/arrow-right.png')}
                  style={{}}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text allowFontScaling={false} style={styles.settingsText}>Settings</Text>

          <View
            style={{
              marginTop: 25,
              flexGrow: 0,
              borderRadius: 5,
              backgroundColor: '#FFFFFF',
              paddingVertical: 15
            }}>
            {settingsOptionsArray.map((settingsOption, i) => (
              <TouchableOpacity
                onPress={() => console.log('Languages')}
                key={settingsOption.id}
                style={{
                  ...styles.listItemBody,
                  marginBottom: i < settingsOptionsArray.length - 1 ? 26 : 0,
                }}
                activeOpacity={0.6}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.listIcon}>
                    <Image source={settingsOption.icon} style={{height: '100%', width: '100%'}} />
                  </View>

                  <View style={{flexDirection: 'column', marginLeft: 16}}>
                    <Text allowFontScaling={false} style={styles.listTitle}>{settingsOption.title}</Text>
                    <Text allowFontScaling={false} style={styles.listDescription}>
                      {settingsOption.description}
                    </Text>
                  </View>
                </View>

                <ToggleSwitch
                  isOn={Boolean(settingsOption.status)}
                  label={settingsOption.label}
                  labelStyle={styles.listLabel}
                  thumbOnStyle={{backgroundColor: '#ABABAB'}}
                  thumbOffStyle={{backgroundColor: '#ABABAB'}}
                  trackOnStyle={{backgroundColor: '#0F6D3D'}}
                  trackOffStyle={{backgroundColor: '#E8E8E8'}}
                  size="medium"
                  onToggle={settingsOption.setStatus}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{height: 24}} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
