import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  glowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 4,
    bottom: 0,
    left: 0,
    right: 10,
  },
  button: {
    justifyContent: 'center',
    width: 143,
    height: 143,
    borderRadius: 100,
    backgroundColor: '#0E6035',
  },
  buttonLabel: {
    alignSelf: 'center',
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '400',
    fontSize: 40,
    lineHeight: 46.56,
    color: '#FFFFFF',
  },
});

export const GoButton = ({navigation}: any) => {
  const glowAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.2, {duration: 1200}),
            withTiming(1.6, {duration: 1200}),
          ),
          -1,
          true,
        ),
      },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.glowContainer, glowAnimation]}>
        <Image
          source={require('../../../assets/home/sun-glow.png')}
          style={{width: 120, height: 140, borderRadius: 200}}
        />
      </Animated.View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Onboarding')}
        style={styles.button}
        activeOpacity={0.8}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>GO</Text>
      </TouchableOpacity>
    </>
  );
};
