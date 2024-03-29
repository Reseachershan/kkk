import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  onSelect: (id: string) => void;
  selected: string;
  tabs: {id: string; name: string}[];
  containerStyles?: any;
};
const TabLabels: FC<Props> = ({tabs, onSelect, selected, containerStyles}) => {
  return (
    <View
      style={{
        ...styles.headerOptions,
        ...(containerStyles || {}),
      }}>
      {tabs?.map(item => {
        return (
          <View
            key={item.id}
            style={{
              ...styles.headerOptionsTextBackground,
              backgroundColor: selected === item.id ? '#FFFFFF' : '#FFFFFF00',
            }}>
            <Text
            allowFontScaling={false}
              onPress={() => onSelect?.(item.id)}
              style={{
                ...styles.headerOptionsText,
                color: selected === item.id ? '#056135' : '#fff',
              }}>
              {item.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default TabLabels;

const styles = StyleSheet.create({
  headerOptions: {
    marginTop: 9,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerOptionsTextBackground: {
    justifyContent: 'center',
    width: 76,
    height: 32,
    borderRadius: 30,
  },
  headerOptionsText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 22,
    color: '#FFFFFF',
  },
});
