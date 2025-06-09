import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Buttons/Button';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { login, getUser } from '../../services/authService';
import { BASE_URL } from '../../config/config';

const LoginScreen = () => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
      const userResponse = await getUser();
      console.log('Авторизований користувач:', userResponse.data);
      setLoginVisible(false);
      navigate('homeNavigator');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Невірні дані', 'Неправильна пошта або пароль');
      } else {
        Alert.alert('Помилка', 'Щось пішло не так, спробуйте пізніше');
      }
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Помилка', 'Усі поля обовʼязкові');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        { username, email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setRegisterVisible(false);
        navigate('homeNavigator');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Помилка', 'Не вдалося зареєструватися');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/img/login.jpg')} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flex: 0.6 }} />

        <View style={styles.bottomContainer}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>Щоб почати авторизуйтесь у системі</Text>
          </View>

          <View style={styles.registerButton}>
            <Button
              label={'Зареєструватися'}
              style={{ backgroundColor: 'rgba(231, 232, 134, 1)' }}
              onPress={() => setRegisterVisible(true)}
            />
          </View>

          <View style={styles.loginButton}>
            <Button
              label={'Увійти'}
              style={{
                backgroundColor: 'rgba(245, 241, 228, 1)',
                borderColor: 'rgba(7, 33, 0, 1)',
                borderWidth: 2,
              }}
              onPress={() => setLoginVisible(true)}
            />
          </View>

          <View style={styles.googleButton}>
            <Button
              style={{
                backgroundColor: 'rgba(245, 241, 228, 1)',
                borderColor: 'rgba(7, 33, 0, 1)',
                borderWidth: 2,
              }}
            >
              <Image source={require('../../assets/img/google_icon.png')} style={{ width: 24, height: 24 }} />
              <Text>Продовжити з гугл</Text>
            </Button>
          </View>
        </View>
      </ImageBackground>

      {/* login window */}
      <Modal visible={isLoginVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalWrapper}
          >
            <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Увійти</Text>
              <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
              <TextInput
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Button
                label="Увійти"
                onPress={handleLogin}
                style={{ backgroundColor: 'rgba(231, 232, 134, 1)', marginBottom: 10 }}
              />
              <TouchableOpacity onPress={() => setLoginVisible(false)}>
                <Text style={styles.closeText}>Закрити</Text>
              </TouchableOpacity>
            </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* register window */}
      <Modal visible={isRegisterVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalWrapper}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Реєстрація</Text>
              <TextInput
                placeholder="Ім'я"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
              <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
              <TextInput
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Button
                label="Зареєструватися"
                onPress={handleRegister}
                style={{ backgroundColor: 'rgba(231, 232, 134, 1)', marginBottom: 10 }}
              />
              <TouchableOpacity onPress={() => setRegisterVisible(false)}>
                <Text style={styles.closeText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 0.45,
    backgroundColor: 'rgba(245, 241, 228, 1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 40,
    padding: 10,
    textAlign: 'center',
    color: 'rgba(7, 33, 0, 1)',
  },
  registerButton: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 140,
    width: '100%',
    padding: 20,
  },
  loginButton: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    width: '100%',
    padding: 20,
  },
  googleButton: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    padding: 20,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'rgba(245, 241, 228, 1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'rgba(7, 33, 0, 1)',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(7, 33, 0, 0.3)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  closeText: {
    textAlign: 'center',
    color: 'rgba(7, 33, 0, 1)',
    fontSize: 16,
    padding: 20,
  },
});
