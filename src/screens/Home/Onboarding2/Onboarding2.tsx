import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#056135',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 173,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFEFE',
  },
  paginationIcon: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#056135',
  },
  button: {
    justifyContent: 'center',
    width: 331,
    height: 56,
    borderRadius: 8,
  },
  buttonLabel: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,
  },
});

export const Onboarding2 = () => {
  const navigation = useNavigation<any>();

  const handleNextScreen = () => {
    navigation.navigate('Onboarding3');
  };

  const handleBackScreen = () => {
    navigation.navigate('Onboarding');
  };

  const insets = useSafeAreaInsets();
  return (
    <View style={{...styles.container, paddingTop: insets.top + 10}}>
      <View style={{paddingHorizontal: 8}}>
        <View>
          <Image
            source={require('../../../assets/onboarding/second.png')}
            style={{alignSelf: 'center'}}
          />
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#056135',
              height: 32,
              width: 170,
              bottom: 37,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text allowFontScaling={false} style={{...styles.title, fontWeight: '700', fontSize: 15}}>
              Hold to cancel Klimb.
            </Text>
          </View>
        </View>

        <Text allowFontScaling={false} style={{...styles.title, marginTop: 20, marginHorizontal: 38}}>
          Cancel your Klimb at any time.
        </Text>

        <Text allowFontScaling={false} style={{...styles.title, marginTop: 20, marginHorizontal: 7}}>
          Give priority to hikers moving UP the mountain so we can keep Koko
          Crater safe.
        </Text>

        <Text allowFontScaling={false} style={{...styles.title, marginTop: 20}}>
          The bridge bypass trail using the path on the right.
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{...styles.paginationIcon, opacity: 0.2}} />
            <View style={{...styles.paginationIcon, marginHorizontal: 12}} />
            <View style={{...styles.paginationIcon, opacity: 0.2}} />
          </View>

          <TouchableOpacity
            onPress={() => handleNextScreen()}
            style={{
              ...styles.button,
              marginTop: 25,
              marginBottom: 4,
              backgroundColor: '#056135',
            }}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#FFFFFF'}}>NEXT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBackScreen()}
            style={{...styles.button, backgroundColor: '#FFFEFE'}}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#00000061'}}>
              BACK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
