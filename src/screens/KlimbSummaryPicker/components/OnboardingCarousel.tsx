import React, { FC, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { KlimbSummary1 } from '../../KlimbSummary1/KlimbSummary1';
import { KlimbSummary2 } from '../../KlimbSummary2/KlimbSummary2';
import { KlimbSummary3 } from '../../KlimbSummary3/KlimbSummary3';
import { workOut } from '../../../contexts/workOutContext';
import { useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { KlimbSummary } from '../../KlimbSummary';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
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

const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.6 : width * 0.6;
const SEPARATOR_SIZE = (width - ITEM_SIZE) / 4;
const EMPTY_ITEM_SIZE = 30;

export default function OnboardingCarousel(props: any) {
  const { setScreenOption, customImage, setImage, workout, flatListRef, screenOption, image } = props;

  const items = [
    {
      key: 'option1',
      img: require('../../../assets/klimb-summary-picker/first-screen.png'),
      option: 'KlimbSummary1',
      uri: customImage
    },
    // {
    //   key: 'option2',
    //   img: require('../../../assets/klimb-summary-picker/first-screen.png'),
    //   option: 'KlimbSummary2',
    //   uri: customImage
    // },
    // {
    //   key: 'option3',
    //   img: require('../../../assets/klimb-summary-picker/first-screen.png'),
    //   option: 'KlimbSummary3',
    //   uri: customImage
    // },
  ];



  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: any) => {
      const itemIndex = viewableItems[0].index;
      setScreenOption(items[itemIndex]?.option || 'KlimbSummary1');
    },
    [setScreenOption],
  );

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 });

  return (
    <View style={styles.container}>
      <FlatList
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={item => item.key}
        horizontal
        bounces={false}
        decelerationRate="fast"
        renderToHardwareTextureAndroid
        snapToInterval={ITEM_SIZE + SEPARATOR_SIZE * 2}
        snapToAlignment="center"
        scrollEventThrottle={16}
        renderItem={({ item }) => <ScreenRender setImage={setImage} item={item} workout={workout}  screenOption={screenOption} image={image} />}
        ItemSeparatorComponent={() => <View style={{ width: SEPARATOR_SIZE }} />}
        ListFooterComponent={() => <View style={{ width: SEPARATOR_SIZE * 2 }} />}
        ListHeaderComponent={() => <View style={{ width: SEPARATOR_SIZE * 2 }} />}
      />
   
    </View>
  );
}
type ScreenRenderProps = {
  item: any;
  setImage: any
  workout: workOut
  screenOption: string
  image: string
};
const ScreenRender: FC<ScreenRenderProps> = ({ item, setImage, workout, screenOption, image }) => {

  if (!item.img) {
    return <View style={{ width: EMPTY_ITEM_SIZE }} />;
  }

  const ScreenShot = useRef(null);

  const onShare = async (uri: string) => {
    console.log('uri');
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

  const handleSharePress = async () => {
    console.log('uri');
    try {
      //@ts-ignore
      const uri = await captureRef(ScreenShot);
      onShare(uri);
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = useNavigation<any>();

  return (
    <View style={{flex: 1, height:'100%', width: '100%'}}> 
    <View style={{ borderRadius:20, overflow: 'hidden', height:'75%', width:'100%', borderColor:'#056135', borderWidth: 10 }}>
    <ViewShot
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          ref={ScreenShot}
          options={{ format: 'jpg', quality: 0.9 }}
        >
          <View style={{
            width: ITEM_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <KlimbSummary screenOption={screenOption} workout={workout} customImage={item.uri ? item.uri : item.img} />

          </View>
        </ViewShot>
      {/* {item.option === 'KlimbSummary1' && (
        <ViewShot
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          ref={ScreenShot}
          options={{ format: 'jpg', quality: 0.9 }}
        >
          <View style={{
            width: ITEM_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <KlimbSummary1 screenOption={screenOption} workout={workout} customImage={item.uri ? item.uri : item.img} />
          </View>
        </ViewShot>
      )}
      {item.option === 'KlimbSummary2' && (
        <ViewShot
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          ref={ScreenShot}
          options={{ format: 'jpg', quality: 0.9 }}
        >
          <View style={{
            width: ITEM_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <KlimbSummary2 screenOption={screenOption} workout={workout} customImage={item.uri ? item.uri : item.img} />
          </View>
        </ViewShot>
      )}
      {item.option === 'KlimbSummary3' && (
        <ViewShot
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          ref={ScreenShot}
          options={{ format: 'jpg', quality: 0.9 }}
        >
          <View style={{
            width: ITEM_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <KlimbSummary3 screenOption={screenOption} workout={workout} customImage={item.uri ? item.uri : item.img} />
          </View>
        </ViewShot>
      )} */}
    </View>

      {screenOption === item.option &&
     <View style={{ justifyContent: 'center', alignItems: 'center', marginTop:15 }}>
     <View style={{ width: '120%' }}>
       <TouchableOpacity
         onPress={() => handleSharePress()}
         style={{ ...styles.button, backgroundColor: '#056135' }}
         activeOpacity={0.6}>
         <Text allowFontScaling={false} style={{ ...styles.buttonLabel, color: '#FFFFFF' }}>
           SHARE
         </Text>
       </TouchableOpacity>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
         <TouchableOpacity
           onPress={() => navigation.goBack()}
           style={{ ...styles.button, marginTop: 4, backgroundColor: '#D9D9D9', width: '47.5%' }}
           activeOpacity={0.6}>
           <Text allowFontScaling={false} style={{ ...styles.buttonLabel, color: '#000000' }}>BACK</Text>
         </TouchableOpacity>
         <TouchableOpacity
           onPress={() => navigation.navigate('TabBar')}
           style={{ ...styles.button, marginTop: 4, backgroundColor: '#D9D9D9', width: '47.5%' }}
           activeOpacity={0.6}>
           <Text allowFontScaling={false} style={{ ...styles.buttonLabel, color: '#000000' }}>HOME</Text>
         </TouchableOpacity>
       </View>
     </View>
   </View>
   
      }
  </View>

  );
};