import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '../../components/Buttons/Button'
import { useNavigation } from '@react-navigation/native'

const Onboarding = () => {
    const{navigate}= useNavigation();
  return (
    <View style={{flex:1}}>
        <ImageBackground source={require('../../assets/img/onboarding.jpg')} style = {{flex:1, justifyContent:'center'}}>
            <View style={{flex:0.6}}>

            </View>
            <View style={{flex:0.45, backgroundColor:'rgba(245, 241, 228, 1)', borderTopLeftRadius:20, borderTopRightRadius:20}}>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:22, fontWeight:'bold', paddingVertical:40, color: 'rgba(7, 33, 0, 1)'}}>
                        Вітаємо у волонтерській системі 
                    </Text>
                    <Text style={{fontSize:18, paddingVertical:10, paddingHorizontal: 10, textAlign:'center', color: 'rgba(96, 98, 10, 1)'}}>
                        {'Почни приймати участь у волонтерстві сьогодні!'}
                    </Text>
                </View>
                <View style={{alignItems:'center', bottom:0, position:'absolute', width:'100%', padding:20, marginBottom:20}}>
                <Button label={'Розпочати'} style={{ backgroundColor: 'rgba(231, 232, 134, 1)'}} onPress={() => navigate('loginScreen')} />
                </View>
            </View>
        </ImageBackground>
    </View>
  )
}

export default Onboarding

const styles = StyleSheet.create({})