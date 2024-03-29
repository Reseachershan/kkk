import React from 'react';
import Animated, {SlideInUp} from 'react-native-reanimated';
import NavigationBottomBar from '../../components/NavigationBottomBar';

const MyTabBar = ({state, descriptors, navigation, position}: any) => {
  return (
    <Animated.View entering={SlideInUp.duration(800)}>
      <NavigationBottomBar index={state.index} />
    </Animated.View>
  );
};

export default MyTabBar;
