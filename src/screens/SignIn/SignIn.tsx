import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {HelperText} from 'react-native-paper';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useScroll from '../../hooks/useScroll';
import {getDocument} from '../../services/firestore';
import {loginService} from '../../services/auth';
import useUser from '../../hooks/useUser';
import ScreenLoader from '../../components/Loaders/ScreenLoader';

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
  formPasswordWrapper: {
    paddingHorizontal: 14,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: 331,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
  },
  formPasswordInput: {
    flex: 1,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391a1',
  },
  forgotPasswordText: {
    marginBottom: 30,
    alignSelf: 'flex-end',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17.07,
    color: '#6A707C',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 331,
    height: 56,
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
  registerText1: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    color: '#1E232C',
  },
  registerText2: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    color: '#133B82',
  },
});

const defaultData = {
  email: '',
  password: '',
};
export const SignIn = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState(defaultData.email);
  const [password, setPassword] = useState(defaultData.password);
  const [hidePassword, setHidePassword] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const {setUserData, setTokenValue} = useUser();

  const scrollConfig = useScroll();
  const {focusAction, scrollRef, scrollTo, registerInput} = scrollConfig;

  const validateEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  const handleChangeEmail = (value: string) => {
    setEmail(value);

    const hasEmailError = !validateEmail(email) ? true : false;
    setEmailError(hasEmailError);
  };
  const [h, setH] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [rotateValue] = useState(new Animated.Value(0));
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [secondLoader, setSecondLoader] = useState(false);

  const login = async () => {
    setLoaderVisible(true);
    setSecondLoader(true);

    try {
      const {uid, error, user, token} = await loginService(
        email?.trim(),
        password,
      );
      if (!user || error) {
        // settoasttext('User not found');
        setLoaderVisible(false);
        setSecondLoader(false);
        return error;
      }

      const userData = await getDocument(`users/${uid}`).get();
      const data = userData.data();
      var storeData = {
        id: uid,
        user: data,
      };
      await AsyncStorage.setItem('@USER_DATA', JSON.stringify(storeData));
      let animate = true;
      const startAnimation = () => {
        if (!animate) {
          return;
        }
        rotateValue.setValue(0);
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }).start(() => {
          if (animate) {
            setTokenValue(token);
            setUserData(user);
            setSecondLoader(false);
            navigation.replace('TabBar');
          }
        });
      };
      setLoaderVisible(false);
      return startAnimation();
    } catch (error) {
      console.log(error);
      setLoaderVisible(false);
      setSecondLoader(false);
    }
  };

  const animationR = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0],
  });
  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          onLayout={e => setH(e.nativeEvent.layout.height)}
          onKeyboardDidShow={() => setShowKeyboard(true)}
          onKeyboardDidHide={() => setShowKeyboard(false)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={ref => (scrollRef.current = ref)}>
          <View style={{minHeight: !showKeyboard ? h : 0}}>
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
                Ready to Klimb?
              </Text>
            </View>

            <View style={{flex: 1, paddingVertical: 22}}>
              <View>
                <View style={{marginBottom: 15}}>
                  <TextInput
                    style={styles.formInput}
                    value={email}
                    placeholder="Enter your email"
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
                    <HelperText type="error" visible={true} style={{top: 2}}>
                      This is not a valid email!
                    </HelperText>
                  ) : null}
                </View>

                <View style={styles.formPasswordWrapper}>
                  <TextInput
                    style={styles.formPasswordInput}
                    placeholder="Enter your password"
                    secureTextEntry={hidePassword}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    placeholderTextColor="#00000060"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onFocus={(e: any) => scrollTo(e.target)}
                    ref={registerInput('imput1')}
                    editable={!secondLoader}
                  />
                  <Icon
                    name={hidePassword ? 'eye-slash' : 'eye'}
                    onPress={() =>
                      !secondLoader && setHidePassword(!hidePassword)
                    }
                  />
                </View>

                <Text allowFontScaling={false}
                  onPress={() => !secondLoader && console.log('forgotPassword')}
                  style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </View>

              <TouchableOpacity onPress={() => login()} disabled={secondLoader}>
                <View style={styles.button}>
                  <Text allowFontScaling={false} style={styles.buttonLabel}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                bottom: 0,
              }}>
              <Text allowFontScaling={false} style={styles.registerText1}>Don't have an account? </Text>
              <Text allowFontScaling={false}
                onPress={() => !secondLoader && navigation.navigate('SignUp')}
                style={styles.registerText2}>
                Register Now
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <ScreenLoader show={loaderVisible} />
    </>
  );
};
