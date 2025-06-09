import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/config';

export default function MyAccountScreen() {
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/profile`, { withCredentials: true })
      .then(({ data }) => setProfile(data))
      .catch(() => navigation.navigate('Login'));
  }, []);

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Профіль */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.username[0]?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.levelRow}>
          Рівень: {profile.lvlName}{' '}
          {Array.from({ length: profile.lvlInApp }).map((_, i) => (
            <Text key={i} style={styles.star}>★</Text>
          ))}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Налаштування</Text>
        </Pressable>
      </View>

      {/* Статистика */}
      <View style={styles.card}>
        <Text style={styles.statLabel}>Активні години</Text>
        <Text style={styles.statValue}>{profile.hoursVolunteered}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.statLabel}>Завершених подій</Text>
        <Text style={styles.statValue}>{profile.eventsCompleted}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.statLabel}>Оцінка впливу</Text>
        <Text style={styles.statValue}>{profile.impactScore}</Text>
      </View>

      <Text style={styles.sectionTitle}>Поточні події</Text>
      {profile.upcomingEvents.length > 0 ? (
        profile.upcomingEvents.map((ev) => (
          <View key={ev.id} style={styles.card}>
            <Text style={styles.eventTitle}>{ev.title}</Text>
            <Text style={styles.eventDate}>
              Наступний: {formatDate(ev.dateTime)}
            </Text>
            <Pressable
              style={styles.linkButton}
              onPress={() =>
                navigation.navigate('EventDetails', { id: ev.id })
              }
            >
              <Text style={styles.linkText}>Переглянути деталі</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Немає наближачихся подій</Text>
      )}

      {/* Минулі події */}
      <Text style={styles.sectionTitle}>Минулі події</Text>
      {profile.pastEvents.length > 0 ? (
        profile.pastEvents.map((ev) => (
          <View key={ev.id} style={styles.card}>
            <Text style={styles.eventTitle}>{ev.title}</Text>
            <Text style={styles.eventDate}>{formatDate(ev.dateTime)}</Text>
            <Text style={styles.eventMeta}>
              Годин: {ev.durationHours} Вплив: ★ 10
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Немає минулих подій</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f5f1e4',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    backgroundColor: '#797a1f',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  username: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  levelRow: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },
  star: {
    color: 'gold',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgba(121,122,31,1)',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
    color: '#333',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventMeta: {
    fontSize: 14,
    color: '#444',
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: 'rgba(121,122,31,1)',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
