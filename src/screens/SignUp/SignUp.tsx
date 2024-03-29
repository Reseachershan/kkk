/* eslint-disable no-catch-shadow */
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Keyboard,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {HelperText} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {getDocument} from '../../services/firestore';
import {createUser} from '../../services/auth';
import useUser from '../../hooks/useUser';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import useScroll from '../../hooks/useScroll';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import NetInfo from "@react-native-community/netinfo";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    marginTop: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  logoText: {
    marginTop: 15.36,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 35,
    color: '#1E232C',
  },
  formInput: {
    paddingHorizontal: 18,
    width: 331,
    height: 56,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
    color: '#8391A1',
  },
  formDatePicker: {
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 17,
    width: 331,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
  },
  formattedBirthDate: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391A1',
  },
  formDropdown: {
    marginBottom: 18,
    width: 331,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
  },
  formDropdownText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391A1',
  },
  birthDateText: {
    paddingHorizontal: 10,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    lineHeight: 14,
    fontSize: 10,
    color: '#000000',
    opacity: 0.6,
    top: -14,
  },
  button: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 331,
    height: 65.09,
    borderRadius: 8,
    backgroundColor: '#056135',
  },
  buttonLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18.29,
    color: '#FFFFFF',
  },
  loginText1: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    color: '#1E232C',
  },
  loginText2: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    color: '#133B82',
  },
});

const sexOptionsArray = ['Male', 'Female', 'Other'];

const defaultForm = {
  birthDate: moment().toDate(), //new Date()
  email: '',
  firstName: '',
  lastName: '',
  hideProfile: false,
  sex: '',
  userName: '',
};
const passwords = {
  password: '',
  confirmPassword: '',
};
export const SignUp = () => {
  const navigation = useNavigation<any>();
  const [birthDate, setBirthDate] = useState(defaultForm.birthDate);
  const [email, setEmail] = useState(defaultForm.email);
  const [confirmEmail, setConfirmEmail] = useState(defaultForm.email);
  const [firstName, setFirstName] = useState(defaultForm.firstName);
  const [lastName, setLastName] = useState(defaultForm.lastName);
  const [gender, setGender] = useState(defaultForm.sex);
  const [userName, setUserName] = useState(defaultForm.userName);
  const [password, setPassword] = useState(passwords.password);
  const [confirmPassword, setConfirmPassword] = useState(
    passwords.confirmPassword,
  );
  const [emailError, setEmailError] = useState(false);
  const [openBirthDateModal, setOpenBirthDateModal] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [loader, setLoader] = useState(false);
  const [secondLoader, setSecondLoader] = useState(false);
  const [errorUserName, setErrorUserName] = useState<string | undefined>();
  const scrollConfig = useScroll();
  const {focusAction, scrollRef} = scrollConfig;
  const {scrollTo, isKeyboardVisible, registerInput} = scrollConfig;

  const {setUserData, setTokenValue} = useUser();
  const [rotateValue] = useState(new Animated.Value(0));
  useEffect(() => {
    if (!openBirthDateModal) {
      return;
    }
    Keyboard.dismiss();
  }, [openBirthDateModal]);

  const validateEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  const handleChangeEmail = (value: string) => {
    setEmail(value);

    const hasEmailError = !validateEmail(email) ? true : false;
    setEmailError(hasEmailError);
  };
  const hasInvalidConfirmPassword = useMemo(() => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return "Passwords don't match";
    }
    return null;
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setLoader(false);
        setSecondLoader(false);
        return Alert.alert('Network error')
      }
    }).catch((err) => {
      setLoader(false);
      setSecondLoader(false);
      return Alert.alert('Network error')
    })
    if (loader) {
      return;
    }
    if (!firstName || !lastName) {
      return;
    }
    if (!birthDate) {
      return;
    }
    if (hasInvalidConfirmPassword || !password) {
      return;
    }
    if (emailError || !email) {
      return;
    }
    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      return;
    }
    if (!userName || errorUserName) {
      return setErrorUserName('Please enter a username.');
    }
    setLoader(true);
    setSecondLoader(true);
    try {
      const existSanp = await getDocument(`singleUsersInfo/${userName}`).get();
      if (existSanp.exists) {
        setLoader(false);
        setSecondLoader(false);
        return setErrorUserName('UserName already exists.');
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      setSecondLoader(false);
      return setErrorUserName('UserName already exists.');
    }
    try {
      const { user, error, token } = await createUser(email?.trim(), password);
      if (!user || error) {
        console.log('An error has occurred' + ' ' + (error || ''));
        setLoader(false);
        setSecondLoader(false);
        return;
      }
      const data = {
        email: email?.trim(),
        userName,
        firstName,
        lastName,
        birthDate: moment(birthDate).format('YYYY-MM-DD'),
        gender: gender || 'Male',
        hideProfile: false,
        requireFinishRegister: false,
        temperatureUnit: 'F',
        systemUnit: 'imp',
        enabledLocation: true,
        enabledNotifications: true,
        lenguage: 'en',
        uid: user?.uid,
        klimbLevel: 'klimber',
        totalKlimbs: 0,
        totalKlimbsAll: 0,
      };

      await getDocument(`singleUsersInfo/${userName}`).set({
        userName,
        userId: user?.uid,
        lastUpdate: Date.now(),
      });
      await getDocument(`users/${user?.uid}`).set(data);
      const storeData = {
        uid: user.uid,
        user: data,
      };
      await AsyncStorage.setItem('@USER_DATA', JSON.stringify(storeData));

      let animate = true;
      const startAnimation = () => {
        if (!animate) {
          return;
        }
        rotateValue.setValue(0);
        scrollTo('ScrollTop');
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }).start(() => {
          if (animate) {
            setTokenValue(token);
            setUserData(user);
            setLoader(false);
            navigation.replace('TabBar');
          }
        });
      };
      setSecondLoader(false);
      return startAnimation();
    } catch (error) {
      try {
        auth().currentUser?.delete();
      } catch (error) {}
      setLoader(false);
      setSecondLoader(false);
    }
  };

  const animationR = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
  });
  const [h, setH] = useState(0);

  return (
    <>
      <DatePicker
        modal
        mode="date"
        title="Select Birth Date"
        open={openBirthDateModal}
        date={birthDate}
        maximumDate={new Date()}
        onConfirm={(date: Date) => {
          setOpenBirthDateModal(false);
          setBirthDate(date);
          setFormattedDate(moment(date).format('MM/DD/YYYY'));
        }}
        onCancel={() => {
          setOpenBirthDateModal(false);
        }}
      />

      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          onLayout={e => setH(e.nativeEvent.layout.height)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={ref => (scrollRef.current = ref)}>
          <View style={{minHeight: !isKeyboardVisible ? h : 0}}>
            <View style={styles.header}>
              <Animated.View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  transform: [{translateY: animationR}],
                }}
                onLayout={e => setH(e.nativeEvent.layout.height)}>
                <KlimbScreenLogo width={80} height={80} color="#056135" />
              </Animated.View>
              <Text allowFontScaling={false} style={{...styles.logoText, marginTop: 80}}>
                Just a few details
              </Text>
            </View>

            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={email}
              placeholder="Email"
              onChangeText={text => handleChangeEmail(text)}
              keyboardType="email-address"
              placeholderTextColor="#00000060"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={(e: any) => scrollTo(e.target)}
              onSubmitEditing={() => focusAction('imput1')}
              editable={!secondLoader}
            />
            {emailError ? (
              <HelperText type="error" visible={true} style={{top: -18}}>
                This is not a valid email!
              </HelperText>
            ) : null}
            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={confirmEmail}
              placeholder="Confirm Email"
              onChangeText={text => setConfirmEmail(text)}
              keyboardType="email-address"
              placeholderTextColor="#00000060"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={(e: any) => scrollTo(e.target)}
              onSubmitEditing={() => focusAction('imput1')}
              editable={!secondLoader}
            />
            {(confirmEmail && confirmEmail.toLowerCase() !== email.toLowerCase()) ? (
              <HelperText type="error" visible={true} style={{top: -18}}>
                Email does not match!
              </HelperText>
            ) : null}

            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={password}
              placeholder="Password"
              secureTextEntry
              onChangeText={text => setPassword(text)}
              placeholderTextColor="#00000060"
              ref={registerInput('imput1')}
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={(e: any) => scrollTo(e.target)}
              onSubmitEditing={() => focusAction('imput2')}
              editable={!secondLoader}
            />
            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={confirmPassword}
              placeholder="Confirm password"
              secureTextEntry
              onChangeText={text => setConfirmPassword(text)}
              placeholderTextColor="#00000060"
              ref={registerInput('imput2')}
              blurOnSubmit={false}
              onSubmitEditing={() => focusAction('imput3')}
              editable={!secondLoader}
            />
            {hasInvalidConfirmPassword ? (
              <HelperText type="error" visible={true} style={{top: -18}}>
                {hasInvalidConfirmPassword}
              </HelperText>
            ) : null}

            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={userName}
              placeholder="Username"
              onChangeText={text => {
                setErrorUserName(undefined);
                setUserName(text);
              }}
              placeholderTextColor="#00000060"
              ref={registerInput('imput3')}
              onFocus={(e: any) => scrollTo(e.target)}
              onSubmitEditing={() => focusAction('imput4')}
              returnKeyType="next"
              blurOnSubmit={false}
              editable={!secondLoader}
            />
            {errorUserName ? (
              <HelperText type="error" visible={true} style={{top: -18}}>
                {errorUserName}
              </HelperText>
            ) : (
              <Text allowFontScaling={false} style={styles.birthDateText}>
                Only your username is displayed on the leaderboards
              </Text>
            )}

            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={firstName}
              placeholder="First Name"
              onChangeText={text => setFirstName(text)}
              placeholderTextColor="#00000060"
              returnKeyType="next"
              blurOnSubmit={false}
              ref={registerInput('imput4')}
              onFocus={(e: any) => scrollTo(e.target)}
              onSubmitEditing={() => focusAction('imput5')}
              editable={!secondLoader}
            />
            <TextInput
              style={{...styles.formInput, marginBottom: 18}}
              value={lastName}
              placeholder="Last Name"
              onChangeText={text => setLastName(text)}
              placeholderTextColor="#00000060"
              returnKeyType="next"
              ref={registerInput('imput5')}
              onFocus={(e: any) => scrollTo(e.target)}
              blurOnSubmit={false}
              onSubmitEditing={() => setOpenBirthDateModal(true)}
              editable={!secondLoader}
            />
            <TouchableOpacity
              onPress={() => setOpenBirthDateModal(true)}
              disabled={secondLoader}
              style={styles.formDatePicker}
              activeOpacity={1}>
              <Text allowFontScaling={false} style={styles.formattedBirthDate}>
                {formattedDate || 'Date of Birth'}
              </Text>
            </TouchableOpacity>

            <SelectDropdown
              data={sexOptionsArray}
              defaultButtonText="Sex"
              buttonStyle={styles.formDropdown}
              buttonTextStyle={{...styles.formDropdownText, textAlign: 'left'}}
              disabled={secondLoader}
              renderDropdownIcon={(isOpened: boolean) => {
                return (
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={12}
                    style={{marginRight: 8}}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              rowTextStyle={styles.formDropdownText}
              onSelect={(selectedItem: string) => {
                setGender(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem: string) => {
                return selectedItem;
              }}
              rowTextForSelection={(item: string) => {
                return item;
              }}
            />
            <Text allowFontScaling={false} style={styles.birthDateText}>
              Date of Birth and Sex required for leaderboards
            </Text>

            <View style={{height: 50}} />
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity onPress={handleRegister} disabled={secondLoader}>
          <View style={styles.button}>
            <Text allowFontScaling={false} style={styles.buttonLabel}>Register</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{flexDirection: 'row', marginTop: 17.74, marginBottom: 21.17}}>
          <Text allowFontScaling={false} style={styles.loginText1}>Already have an account? </Text>
          <Text allowFontScaling={false}
            onPress={() => navigation.navigate('SignIn')}
            style={styles.loginText2}>
            Login Now
          </Text>
        </View>
      </SafeAreaView>
      <ScreenLoader show={loader} />
    </>
  );
};
