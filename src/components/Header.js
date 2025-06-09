import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import { logout, getUser } from '../services/authService';
import { useNavigation } from '@react-navigation/native';




const Header = () => {
    const {navigate} = useNavigation();
    const handleLogout = () => {
        logout();
        Alert.alert('Logout', 'You have been logged out.');
        navigate('loginScreen');
    };


    return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>

        <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container:{
        height:'10%',
        backgroundColor:'rgba(245, 241, 228, 1)'
    },
    logoutButton:{
        alignSelf:'flex-end',
        textAlign:'center',
        alignItems:'center',
        width:'20%',
        borderColor:'rgba(7, 33, 0, 1)',
        borderWidth: 2,
        borderRadius:20,
        margin:10,
        marginTop:20,
        padding:10,
        backgroundColor:'rgba(245, 241, 228, 1)'
    },
    logoutText:{
        fontSize:18,
        color:'rgba(7, 33, 0, 1)',
    }
})