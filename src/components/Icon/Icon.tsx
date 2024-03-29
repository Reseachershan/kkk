import React, {FC} from 'react';
import geticonType, {IconType} from './geticonType';
import {
  IconButtonProps,
  IconProps as VectorIconProps,
} from 'react-native-vector-icons/Icon';
import {StyleProp, ViewStyle} from 'react-native';
export declare type RneFunctionComponent<T> = React.FunctionComponent<T>;

export declare type IconProps = IconButtonProps & {
  type?: IconType;
  Component?: typeof React.Component;
  reverse?: boolean;
  raised?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  iconProps?: VectorIconProps;
  reverseColor?: string;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  solid?: boolean;
  brand?: boolean;
};

const Icon: FC<IconProps> = ({type, ...props}) => {
  const SelectedIcon = geticonType(type || 'material');
  return <SelectedIcon {...props} />;
};

export default Icon;
