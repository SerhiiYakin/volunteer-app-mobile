import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from './src/screens/Onboarding/Onboarding';
import LoginScreen from './src/screens/Login/LoginScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import BottomTabs from './src/components/BottomTab/BottomTabs';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='onboarding'>
            <Stack.Screen name='onboarding' component={Onboarding} options={{headerShown:false}}/>
            <Stack.Screen name='loginScreen' component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name='homeNavigator' component={BottomTabs} options={{headerShown:false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation

const styles = StyleSheet.create({})