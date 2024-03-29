import React, { useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Video from 'react-native-video';
import Animated from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  backgroundVideo: {
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
  },
  body: {
    flex: 1,
  },
  aboutTitle: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 25,
    lineHeight: 29,
    color: '#FFFFFF',
  },
  aboutDescription: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 24.8,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  button: {
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 380,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: 50,
    backgroundColor: '#7C777799',
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    // fontSize: 25,
    numberOfLines: 1,
    color: '#FFFFFF',
    textAlign: 'center'
  },
});
const texts = [
  {
    id: 1,
    text: "The Koko Crater Tramway, known to many as the Koko Crater Stairs, leads to the Pu'u Mai Summit of Mount Kohelepelepe, offering panoramic views of East Honolulu and a glimpse into Ancient Hawaiian land. Comprised of exactly 1075 steps and an elevation gain of 990 feet, this hike will take your breath away, in more ways than one.",
  },
  {
    id: 2,
    text: "Originally built by US Army in 1942, the tramway carried personnel and supplies up to facilities atop Pu'u Mai summit. After being decommissioned in 1963, the tramway slowly grew in popularity among hikers who desired a challenging workout with access to amazing views from the top. As the decades passed, and with hundreds of hikers making their way up the stairs each day, natural erosion and damage began to take its toll on the historic tramway. This created safety issues for hikers, frequent calls to 911, and considerable overall damage to the landscape of Koko Crater.",
  },
  {
    id: 3,
    text: "At this point, a group of stair enthusiasts came together to form the Kokonut Koalition, who's mission was to protect, preserve, and rehabilitate the stairs and the mountain's cultural significance. After raising community awareness and receiving private and public funding, the organization began reconstructing the tramway in the spring of 2020. New wooden cross ties were installed and each step area was leveled with gravel. Hundreds of volunteers across the community helped to transform the stairs's appearance and safety, reducing Honolulu Fire Department's emergency calls at Koko Head Park by 50%.",
  },
  {
    id: 4,
    text: 'Today the tramway continues to draw individuals of all ages and walks of life, including those from Hawaii Kai, communities across ‘Oahu, and from regions and countries across the globe, with estimates of 500 to 1,000 hikers utilizing the trail daily. The Klimb Hawaii team is on a mission to help deepen every hiker’s relationship with Koko Crater and grow the community’s engagement around this legendary landmark of ‘Oahu',
  },
];
const H_MIN_HEIGHT = 250;
export const About = () => {
  const navigation = useNavigation<any>();
  const supportUrl =
    'http://www.kokonutkoalition.org/index.php/about-koko-crater/history';

  const handleOpenSupportLink = () => {
    Linking.canOpenURL(supportUrl).then(supported => {
      supported
        ? Linking.openURL(supportUrl)
        : console.log('Could not open: ', supportUrl);
    });
  };
  const supportUrl2 =
    'http://www.klimbhawaii.com/';

  const handleOpenSupportLink2 = () => {
    Linking.canOpenURL(supportUrl2).then(supported => {
      supported
        ? Linking.openURL(supportUrl2)
        : console.log('Could not open: ', supportUrl2);
    });
  };
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const [h, setH] = useState(0);
  const H_SCROLL_DISTANCE = useMemo(
    () => Math.max(h - H_MIN_HEIGHT, H_MIN_HEIGHT),
    [h],
  );
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_SCROLL_DISTANCE, 0],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/about/about-us.mp4')}
        style={styles.backgroundVideo}
        repeat={true}
        resizeMode={'cover'}
      />

      <View style={{ height: 150 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
          style={{ marginTop: 42, width: 0, marginLeft: 21 }}>
          <Image source={require('../../assets/profile/arrowLeft.png')} style={{ width: 30, height: 30, tintColor: '#fff' }} />
        </TouchableOpacity>
        <View style={{ height: 50, width: 40, position: 'absolute', alignSelf: 'center', marginTop: 50 }}>
          <Image
            source={require('../../assets/about/logo.png')}
            style={{ width: '100%', height: '100%', position: 'absolute', alignSelf: 'center', resizeMode: 'contain' }}
          />
        </View>
      </View>

      <View style={styles.body}>
        <LinearGradient
          style={{ height: '100%', width: '100%', position: 'absolute' }}
          colors={['#00000000', '#00000030', '#00000070']}
        />
        {/* height: headerScrollHeight */}
        <View
          style={{ bottom: 40, flex: 1 }}
          onLayout={e => setH(e.nativeEvent.layout.height)}>
          <Animated.View
            style={{
              marginHorizontal: 25,
              marginTop: headerScrollHeight,
              flex: 1,
            }}>
            <Text allowFontScaling={false} style={styles.aboutTitle}>KOKO CRATER</Text>

            <MaskedView
              style={{ flex: 1 }}
              maskElement={
                <>
                  <View style={{ flex: 1, backgroundColor: '#fff' }} />
                  <LinearGradient
                    style={{ flex: 1, maxHeight: H_MIN_HEIGHT }}
                    colors={['#FFFFFF', '#FFFFFF00']}
                  />
                </>
              }>
              <Animated.ScrollView
                style={{ flex: 1, marginTop: 6 }}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                  {
                    useNativeDriver: false,
                  },
                )}
                scrollEventThrottle={16}>
                {texts.map(text => (
                  <Text allowFontScaling={false} key={text.id} style={styles.aboutDescription}>
                    {text.text}
                  </Text>
                ))}
                <View style={{ height: 200 }} />
              </Animated.ScrollView>
            </MaskedView>
          </Animated.View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => handleOpenSupportLink()}
            style={styles.button}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={styles.buttonLabel} adjustsFontSizeToFit>
              SUPPORT KOKONUT KOALITION
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOpenSupportLink2()}
            style={styles.button}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={styles.buttonLabel} adjustsFontSizeToFit>
              SUPPORT KLIMB HAWAII
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
