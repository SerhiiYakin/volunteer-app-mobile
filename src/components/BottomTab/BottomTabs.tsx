import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import Map from '../../screens/Map/Map';
import MyAccount from '../../screens/MyAccount/MyAccount';
import MyEvents from '../../screens/MyEvents/MyEvents';
import Notifications from '../../screens/Notifications/Notifications';

type TabRoutes = 'homeScreen' | 'map' | 'myAccount' | 'myEvents' | 'notifications';

const icons: Record<TabRoutes, [any, any]> = {
  homeScreen: [
    require('../../assets/img/house-2.png'),
    require('../../assets/img/house.png'),
  ],
  map: [
    require('../../assets/img/maps-and-flags.png'),
    require('../../assets/img/maps-and-flags-2.png'),
  ],
  myAccount: [
    require('../../assets/img/user.png'),
    require('../../assets/img/user-2.png'),
  ],
  myEvents: [
    require('../../assets/img/event-2.png'),
    require('../../assets/img/event.png'),
  ],
  notifications: [
    require('../../assets/img/notification-2.png'),
    require('../../assets/img/notification.png'),
  ],
};

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="homeScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const [activeIcon, inactiveIcon] = icons[route.name as TabRoutes];
          return (
            <Image
              source={focused ? activeIcon : inactiveIcon}
              style={styles.icon}
              resizeMode="contain"
            />
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarLabel: () => null,
        headerStyle: styles.header,
        headerTintColor: '#000',
        headerTitleStyle: styles.headerTitle,
        headerBackTitleVisible: false,
      })}
    >
      <Tab.Screen name="homeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="map" component={Map} options={{ headerShown: false }} />
      <Tab.Screen name="myAccount" component={MyAccount} options={{ headerShown: false }} />
      <Tab.Screen name="myEvents" component={MyEvents} options={{ headerShown: false }} />
      <Tab.Screen name="notifications" component={Notifications} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  tabBar: {
    backgroundColor: '#F5F1E4',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    backgroundColor: 'rgba(231, 232, 134, 1)',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
