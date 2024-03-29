import React, {FC} from 'react';
import {View} from 'react-native';
import Loader from './Loader';

type Props = {show: boolean};
const ScreenLoader: FC<Props> = ({show}) => {
  if (!show) {
    return <></>;
  }
  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000040',
      }}>
      <Loader />
    </View>
  );
};

export default ScreenLoader;
