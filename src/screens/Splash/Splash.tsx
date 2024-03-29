import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  View,
  ImageBackground,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KlimbScreenLogo from '../../components/aplicationIcons/KlimbScreenLogo';
import SplashScreen from 'react-native-splash-screen';
import useUser from '../../hooks/useUser';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});

export const Splash = () => {
  const navigation = useNavigation<any>();
  const [h, setH] = useState(0);
  const [hContainer, setHContainer] = useState(0);
  const [rotateValue] = useState(new Animated.Value(0));
  const { isAuth, loadingUser } = useUser();
  const isFocus = useIsFocused();
  const route: any = useRoute();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (!isFocus || loadingUser) {
      return;
    }
    let animate = true;
    const startAnimation = () => {
      if (!animate) {
        return;
      }
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      }).start(() => {
        if (animate) {
          // setTimeout(startAnimation, 1000);
          const goto = route?.params?.toKlimber ? 'Klimber' : 'TabBar'
          navigation.replace(!isAuth ? 'SignIn' : goto);
        }
      });
    };
    const off = setTimeout(startAnimation, 1000);
    return () => {
      animate = false;
      clearTimeout(off);
    };
  }, [isAuth, isFocus, loadingUser, navigation, rotateValue]);
  const animationR = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [(hContainer - h) / 2, 55],
  });
  const scale = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1.5, 1],
  });
  return (
    <View
      style={styles.container}
      onLayout={e => setHContainer(e.nativeEvent.layout.height)}>
      <ImageBackground
        source={require('../../assets/opening/background.png')}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <LinearGradient
          colors={['#0D490314', '#060606']}
          style={{ width: '100%', height: '100%' }}>
          <Animated.View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              justifyContent: 'center',
              transform: [{ translateY: animationR }, { scale: scale }],
            }}
            onLayout={e => setH(e.nativeEvent.layout.height)}>
            <KlimbScreenLogo width={80} height={80} color={"#FFFFFF"} />
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
