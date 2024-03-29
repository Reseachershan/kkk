import React, {FC, useMemo} from 'react';
import {Image, Text, View} from 'react-native';
import {workOutType} from '../types/workout';
import SlidePagesModal, {PageType} from './SlidePagesModal';
const pagesDouble: PageType = [
  {
    id: 1,
    headerRender: (
      <View>
        <Image
          source={require('../assets/workout-onboarding/double-type-first.png')}
          style={{alignSelf: 'center'}}
        />
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#056135',
            height: 32,
            width: 160,
            bottom: 35,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 15,
            }}>
            Descend Down
          </Text>
        </View>
      </View>
    ),
    paragraph: [
      {
        id: 1,
        text: 'You have selected a DOUBLE workout.',
      },
      {
        id: 2,
        text: 'When you reach the finish area, press Descend Down and begin back down the mountain.',
      },
    ],
  },
  {
    id: 2,
    headerRender: (
      <View>
        <Image
          source={require('../assets/workout-onboarding/double-type-second.png')}
          style={{alignSelf: 'center'}}
        />
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#056135',
            height: 32,
            width: 160,
            bottom: 40,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 15,
            }}>
            Ascend Up
          </Text>
        </View>
      </View>
    ),
    paragraph: [
      {
        id: 1,
        text: 'When you return to the start area, press Ascend Up and begin back up the mountain.',
      },
      {
        id: 2,
        text: 'Once back at the finish area, press Finish Klimb.',
      },
    ],
  },
];
const pagesSingle: PageType = [
  {
    id: 1,
    headerRender: (
      <View>
        <Image
          source={require('../assets/onboarding/first.png')}
          style={{alignSelf: 'center', width: 270, height:420}}
          resizeMode='contain'
        />
        {/* <View
          style={{
            position: 'absolute',
            backgroundColor: '#056135',
            height: 32,
            width: 170,
            bottom: 44,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 15,
            }}>
            Start Klimb.
          </Text>
        </View> */}
      </View>
    ),
    paragraph: [
      {
        id: 1,
        text: 'Start your time in the area directly below the first stair.',
      },
    ],
  },

  {
    id: 3,
    headerRender: (
      <View>
        <Image
          source={require('../assets/onboarding/finish.png')}
          style={{alignSelf: 'center', width: 270, height:420}}
          resizeMode='contain'
        />
        {/* <View
          style={{
            position: 'absolute',
            backgroundColor: '#8A2715',
            height: 34,
            width: 160,
            bottom: 36,
            alignSelf: 'center',
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
          <Text
          allowFontScaling={false}
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
        </View> */}
      </View>
    ),
    paragraph: [
      {
        id: 1,
        text: 'Finish your time in the area directly above the last stair.',
      },
    ],
  },
  {
    id: 5,
    // headerRender: <View />,
    headerRender: (
      <View>
        <View
          style={{
            // position: 'absolute',
            // backgroundColor: '#000',
            height: '100%',
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/warning-icon/warning.png')}
            style={{ alignSelf: 'center', width: '40%', height: '40%', tintColor: '#fff', position:'absolute', top:10 }}
            resizeMode='contain'
          />
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: 17,
              marginHorizontal: 35
            }}>
            Cancel your Klimb at any time.
          </Text>
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: 17,
              marginTop: 35,
              marginHorizontal: 35
            }}>
            Give priority to hikers moving UP the mountain.
          </Text>
          <Text
          allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              lineHeight: 22,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: 17,
              marginTop: 35,
              marginHorizontal: 35
            }}>
            The bridge bypass trail is to the right of the bridge.
          </Text>
        </View>
      </View>
    ),
    align: 'center',
    paragraph: [],
  },
];
type Props = {
  isOpen: boolean;
  onClose?: () => void;
  onSelected?: () => void;
  type?: workOutType;
  startText?: string;
  isModal?: boolean;
};

const WorkTypeInfoModal: FC<Props> = ({
  isOpen,
  onClose,
  onSelected,
  type = 'double',
  startText = 'FINISH',
  isModal = false,
}) => {
  const pages = useMemo(() => {
    if (type === 'double') {
      return pagesDouble;
    }
    return pagesSingle;
  }, [type]);
  return (
    <SlidePagesModal
      isOpen={isOpen}
      onClose={onClose}
      pages={pages}
      onSelected={onSelected}
      startText={startText}
      isModal={isModal}
    />
  );
};

export default WorkTypeInfoModal;
