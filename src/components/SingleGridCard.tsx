import React, {FC} from 'react';
import {View, Text} from 'react-native';

type Props = {
  children?: React.ReactNode;
  title?: string;
  width?: any;
  height?: any;
  paddingTop?: any;
  fontFamily?: string;
  fontWeight?: any;
  fontSize?: number;
  lineHeight?: number;
  borderRadius?: any;
  color?: string;
  backgroundColor?: any;
};

const SingleGridCard: FC<Props> = ({
  children,
  title = '',
  width = 80,
  height = 55,
  paddingTop = 7,
  fontFamily = 'Montserrat-SemiBold',
  fontWeight = '500',
  fontSize = 9.5,
  lineHeight = 11.06,
  borderRadius = 10,
  color = '#000000',
  backgroundColor = '#FFFFFF',
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        borderRadius: borderRadius,
        backgroundColor: backgroundColor,
      }}>
      <Text
      allowFontScaling={false}
        style={{
          flex: 1,
          paddingTop: paddingTop,
          textAlign: 'center',
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontSize: fontSize,
          lineHeight: lineHeight,
          color: color,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default SingleGridCard;
