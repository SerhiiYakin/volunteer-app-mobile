// screens/MapScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import EventCard from '../EventCard/EventCard';
import { getUser } from '../../services/authService';
import { BASE_URL } from '../../config/config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.3;

export default function MapScreen() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await getUser();
        setUser(me);
        const res = await axios.get(`${BASE_URL}/events`, { withCredentials: true });
        setEvents(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Фільтруємо події за назвою
  const visibleEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  // Центруємо карту на першій доступній події
  const first = visibleEvents.find(e => e.latitude && e.longitude) || {};
  const region = {
    latitude: first.latitude || 0,
    longitude: first.longitude || 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      {/* Пошукове поле над картою */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Пошук подій..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Округлена карта з тінню */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={region}>
          {visibleEvents.map(evt =>
            evt.latitude && evt.longitude ? (
              <Marker
                key={evt.id}
                coordinate={{ latitude: evt.latitude, longitude: evt.longitude }}
                title={evt.title}
                description={evt.location}
              />
            ) : null
          )}
        </MapView>
      </View>

      {/* Підпис над списком подій */}
      <Text style={styles.sectionTitle}>Можливості зараз</Text>

      {/* Список карток */}
      <FlatList
        data={visibleEvents}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            currentUser={user}
            setFilteredEvents={setEvents}
            refreshUser={async () => {
              const me = await getUser();
              setUser(me);
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e4',
  },
  searchWrapper: {
    flexDirection: 'row',
    margin: 10,
    marginBottom: 0,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#797a1f',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    margin: 30,
    height: MAP_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    // тінь для iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation для Android
    elevation: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    textAlign:'center',
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
