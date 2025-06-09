import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../../services/authService';
import EventCard from '../EventCard/EventCard';
import { BASE_URL } from '../../config/config';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { navigate } = useNavigation();
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const updatedUser = await getUser();
      setUser(updatedUser);
    } catch (err) {
      console.error('Помилка оновлення користувача:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/events`, { withCredentials: true });
        setEvents(res.data);
        await refreshUser();
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      navigate('Map', { search: searchTerm });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            placeholder="🔍 Пошук можливостей..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Пошук</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Можливості зараз</Text>

        {events.map((event) => (
          <EventCard
            key={`${event.id}-${event.eventParticipants?.length}-${user?.id}`}
            event={event}
            currentUser={user}
            setFilteredEvents={setEvents}
            refreshUser={refreshUser}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(245, 241, 228, 1)',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    backgroundColor: '#7a7b1f',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
});
