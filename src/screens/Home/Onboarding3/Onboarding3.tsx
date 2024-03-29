import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#056135',
  },
  title: {
    marginTop: 62.77,
    marginHorizontal: 43,
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

export const Onboarding3 = () => {
  const navigation = useNavigation<any>();

  const handleNextScreen = () => {
    navigation.navigate('Klimber');
  };

  const handleBackScreen = () => {
    navigation.navigate('Onboarding2');
  };

  const insets = useSafeAreaInsets();
  return (
    <View style={{...styles.container, paddingTop: insets.top + 10}}>
      <View>
        <View>
          <Image
            source={require('../../../assets/onboarding/third.png')}
            style={{alignSelf: 'center'}}
          />
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#056135',
              height: 32,
              width: 160,
              bottom: 37,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text allowFontScaling={false}
              style={{
                textAlign: 'center',
                fontFamily: 'Montserrat-SemiBold',
                lineHeight: 22,
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: 15,
              }}>
              Finish Klimb.
            </Text>
          </View>
        </View>
        <Text allowFontScaling={false} style={styles.title}>
          Finish your time in the area directly above the last stair.
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{...styles.paginationIcon, opacity: 0.2}} />
            <View
              style={{
                ...styles.paginationIcon,
                marginHorizontal: 12,
                opacity: 0.2,
              }}
            />
            <View style={styles.paginationIcon} />
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
            <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#FFFFFF'}}>START</Text>
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
