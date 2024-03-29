import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import OnboardingCarousel from './components/OnboardingCarousel';
import Share from 'react-native-share';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    marginTop: 0,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    color: '#056135',
    alignSelf: 'center',
    marginBottom: 18
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 53,
    borderRadius: 100,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    fontWeight: '500',
  },
});

export const KlimbSummaryPicker = ({route}: any) => {
  const navigation = useNavigation<any>();
  const [screenOption, setScreenOption] = useState(1);
  const [image, setImage] = useState('');
  const {customImage, workout} = route.params;
  ;

  const onShare = async (uri: string) => {
    setImage(uri)
    try {
      await Share.open({
        title: 'Klimb Summary',
        url: uri,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height: 50, width: 40, marginTop: 60, alignSelf: 'center', justifyContent: 'center',alignItems:'center'}}>
        <Image
          source={require('../../assets/klimber/logo-green.png')}
          style={{width: '100%', height: '100%', resizeMode: 'contain', alignSelf: 'center', position: 'absolute'}}
        />
      </View>
      <Text allowFontScaling={false} style={styles.screenTitle}>KLIMB SUMMARY</Text>

      <OnboardingCarousel workout={workout} customImage={customImage} image={image} setImage={setImage} onShare={onShare} setScreenOption={setScreenOption} screenOption={screenOption} />
    </View>
  );
};
