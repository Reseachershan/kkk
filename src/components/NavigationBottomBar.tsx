import React, {FC} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, TouchableOpacity} from 'react-native';
import StatsIcon from './aplicationIcons/StatsIcon';
import KlimbIcon from './aplicationIcons/KlimbIcon';
import ScaleIcon from './aplicationIcons/ScaleIcon';
type Props = {index: number; onPress?: () => void};

const routes = [
  {
    id: 0,
    name: 'Stats',
    RenderItem: StatsIcon,
    size: 30,
  },
  {
    id: 1,
    name: 'Klimb',
    RenderItem: KlimbIcon,
    size: 40,
  },
  {
    id: 2,
    name: 'Leaderboard',
    RenderItem: ScaleIcon,
    size: 40,
  },
];
const NavigationBottomBar: FC<Props> = ({index, onPress}) => {
  const navigation = useNavigation<any>();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        right: 0,
        left: 0,
        bottom: 0,
        height: 75,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 30,
        elevation: 10,
        shadowColor: '#000000',

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
      }}>
      {routes.map(route => {
        const {id, name, RenderItem, size} = route;
        return (
          <TouchableOpacity
            key={id}
            onPress={() => {
              onPress?.();
              navigation.navigate(name);
            }}>
            <RenderItem
              width={size}
              height={size}
              color={index === id ? '#0E6036' : '#858484'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationBottomBar;
