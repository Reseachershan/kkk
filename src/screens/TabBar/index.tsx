import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabBarRoutes} from '../../../routes';
import MyTabBar from './TabBarRender';

const Tab = createMaterialTopTabNavigator();

const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Klimb"
      tabBarPosition="bottom"
      tabBar={props => <MyTabBar {...props} />}>
      {TabBarRoutes.map(route => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </Tab.Navigator>
  );
};
export default TabBar;
