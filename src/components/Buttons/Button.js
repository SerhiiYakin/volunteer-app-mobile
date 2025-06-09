import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = ({label, onPress, style, children}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
         {children ? children : <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        textAlign:'center',
        alignItems:'center',
        height: 48, 
        justifyContent:'center',
        borderRadius:20,
        width:'100%',
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 10
    },
    text:{
        fontSize:16,
        color: 'rgba(7, 33, 0, 1)'
    }
})