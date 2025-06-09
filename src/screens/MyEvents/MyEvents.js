// screens/CreateEventScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import EventCard from '../EventCard/EventCard';
import { getUser } from '../../services/authService';
import { BASE_URL } from '../../config/config';

export default function CreateEventScreen() {
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Поля форми
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('1');
  const [date, setDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [banner, setBanner] = useState(null);
  const [coords, setCoords] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await getUser();
        setUser(me);
        const res = await axios.get(`${BASE_URL}/events/my-events`, { withCredentials: true });
        setMyEvents(res.data.filter(e => e.status === 'current'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, resp => {
      if (resp.assets?.length) setBanner(resp.assets[0]);
    });
  };

  const handleCreate = async () => {
    try {
      let imageUrl = null;
      if (banner) {
        const fd = new FormData();
        fd.append('file', {
          uri: banner.uri,
          name: banner.fileName,
          type: banner.type,
        });
        const up = await axios.post(
          `${BASE_URL}/events/upload-image`,
          fd,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        imageUrl = up.data;
      }

      await axios.post(
        `${BASE_URL}/events`,
        {
          title,
          description,
          location: locationText,
          dateTime: date.toISOString(),
          durationHours: Number(duration),
          imageUrl,
          latitude: coords?.latitude || 0,
          longitude: coords?.longitude || 0,
          category,
        },
        { withCredentials: true }
      );

      const res = await axios.get(`${BASE_URL}/events/my-events`, { withCredentials: true });
      setMyEvents(res.data.filter(e => e.status === 'current'));

      // Очищуємо форму
      setTitle('');
      setDescription('');
      setLocationText('');
      setCategory('');
      setDuration('1');
      setBanner(null);
      setCoords(null);
      alert('Подію створено');
    } catch (err) {
      console.error(err);
      alert('Помилка створення події');
    }
  };

  const onMapPress = e => setCoords(e.nativeEvent.coordinate);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Нова подія</Text>

      {/* Заголовок */}
      <TextInput
        style={styles.input}
        placeholder="Заголовок"
        value={title}
        onChangeText={setTitle}
      />

      {/* Опис */}
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Опис"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Локація */}
      <TextInput
        style={styles.input}
        placeholder="Локація (текст)"
        value={locationText}
        onChangeText={setLocationText}
      />

      {/* Дата */}
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>
          Дата: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) setDate(new Date(
              d.getFullYear(), d.getMonth(), d.getDate(),
              date.getHours(), date.getMinutes()
            ));
          }}
        />
      )}

      {/* Час */}
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>
          Час: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={date}
          onChange={(_, d) => {
            setShowTimePicker(false);
            if (d) setDate(new Date(
              date.getFullYear(), date.getMonth(), date.getDate(),
              d.getHours(), d.getMinutes()
            ));
          }}
        />
      )}

      {/* Категорія */}
      <View style={styles.row}>
        <Text style={styles.label}>Категорія:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Виберіть..." value="" />
            <Picker.Item label="Environment" value="Environment" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="Youth" value="Youth" />
          </Picker>
        </View>
      </View>

      {/* Тривалість */}
      <TextInput
        style={styles.input}
        placeholder="Тривалість (години)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      {/* Зображення */}
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>
          {banner ? 'Змінити зображення' : 'Додати зображення'}
        </Text>
      </TouchableOpacity>
      {banner && (
        <Image source={{ uri: banner.uri }} style={styles.preview} />
      )}

      {/* Координати */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMapModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {coords
            ? `Координати: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
            : 'Оберіть локацію на карті'}
        </Text>
      </TouchableOpacity>

      {/* Кнопка створити */}
      <TouchableOpacity
        style={[styles.button, styles.submit]}
        onPress={handleCreate}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>
          Створити подію
        </Text>
      </TouchableOpacity>

      {/* Секція "Мої події" */}
      <Text style={styles.heading}>Мої події</Text>
      {myEvents.length > 0 ? (
        myEvents.map(ev => (
          <EventCard
            key={ev.id}
            event={ev}
            currentUser={user}
            setFilteredEvents={setMyEvents}
            refreshUser={async () => setUser(await getUser())}
          />
        ))
      ) : (
        <Text style={styles.empty}>Немає поточних подій</Text>
      )}

      {/* Модал з картою */}
      <Modal visible={mapModalVisible} animationType="slide">
        <View style={styles.modal}>
          <MapView
            style={styles.modalMap}
            initialRegion={{
              latitude: 43.7,
              longitude: -79.42,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
            onPress={onMapPress}
          >
            {coords && <Marker coordinate={coords} />}
          </MapView>
          <TouchableOpacity
            style={[styles.button, { margin: 16 }]}
            onPress={() => setMapModalVisible(false)}
          >
            <Text style={styles.buttonText}>Підтвердити</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f1e4',
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateTimeButton: {
    backgroundColor: '#797a1f20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#797a1f20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submit: {
    backgroundColor: 'rgba(121,122,31,1)',
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 100,
    fontSize: 14,
  },
  pickerWrapper: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerItem: {
    height: 50,
    color: '#000',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  modal: {
    flex: 1,
  },
  modalMap: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
