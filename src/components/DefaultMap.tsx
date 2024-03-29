import React from 'react';
// import MapboxGL from '@rnmapbox/maps';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
// MapboxGL.setAccessToken(
//   'pk.eyJ1Ijoiam9lY2hvOTkiLCJhIjoiY2xiOW40dzZxMHduZzNycWM2NG5yaTk0YyJ9.fGYm0BpYuBg4P1M4ZAWjYg',
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});

const DefaultMap = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <MapboxGL.MapView style={{flex: 1}} /> */}
    </SafeAreaView>
  );
};

export default DefaultMap;
