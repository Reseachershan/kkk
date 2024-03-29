import React from 'react';
import Svg, {Line} from 'react-native-svg';
const StatsIcon = ({width = 32, height = 27, color = 'black'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 87 87" fill="none">
      <Line
        x1="4.5"
        y1="1.87657e-07"
        x2="4.5"
        y2="87"
        stroke={color}
        strokeWidth={9}
      />
      <Line
        x1="87"
        y1="82.5"
        x2="-3.93403e-07"
        y2="82.5"
        stroke={color}
        strokeWidth={9}
      />
      <Line
        x1="35.7322"
        y1="28.1514"
        x2="6.98837"
        y2="83.1444"
        stroke={color}
        strokeWidth={9}
      />
      <Line
        x1="30.2837"
        y1="29.0387"
        x2="62.1095"
        y2="46.0127"
        stroke={color}
        strokeWidth={9}
      />
      <Line
        x1="75.9796"
        y1="10.1007"
        x2="56.3625"
        y2="47.2626"
        stroke={color}
        strokeWidth={9}
      />
    </Svg>
  );
};
export default StatsIcon;
