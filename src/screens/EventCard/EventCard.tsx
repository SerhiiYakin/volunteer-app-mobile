import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    imageUrl?: string;
    category: string;
    status: string;
    // eventParticipants може бути undefined, тому наш код його обробляє
    eventParticipants?: Array<{
      user?: { id?: number };
      role?: string;
    }>;
  };
  currentUser: { id?: number } | null;
  setFilteredEvents?: (events: any[]) => void;
  refreshUser?: () => Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  currentUser,
  setFilteredEvents,
  refreshUser,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Гарантуємо, що eventParticipants — масив
  const participants = Array.isArray(event.eventParticipants)
    ? event.eventParticipants
    : [];

  const userId = String(currentUser?.id);
  const isParticipant = participants.some(
    (p) => String(p.user?.id) === userId
  );
  const isOrganizer = participants.some(
    (p) =>
      String(p.user?.id) === userId && String(p.role)?.toLowerCase() === 'organizer'
  );
  const isMember = isParticipant || isOrganizer;
  const isCurrent = String(event.status).toLowerCase() === 'current';

  const formattedDate = event.dateTime
    ? new Date(event.dateTime).toLocaleString('uk-UA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const shouldShowImage =
    route.name !== 'Map' && route.name !== 'MyEvents';

  const handleJoin = async (eventId: string) => {
    if (String(event.status).toLowerCase() === 'passed') {
      Alert.alert(
        'Увага',
        'Не можна доєднатись до події, яка вже минула'
      );
      return;
    }

    if (!currentUser) {
      navigation.navigate('Login' as never);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/events/${eventId}/participants`,
        {},
        { withCredentials: true }
      );
      Alert.alert('Успіх', 'Ви успішно приєдналися до події');

      // Оновлюємо список подій зверху
      if (setFilteredEvents) {
        const res = await axios.get(`${BASE_URL}/events`, {
          withCredentials: true,
        });
        setFilteredEvents(res.data);
      }
      // Оновлюємо інформацію про користувача
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err: any) {
      Alert.alert(
        'Помилка',
        err.response?.data || 'Помилка при доєднанні'
      );
    }
  };

  return (
    <View style={styles.card}>
      {shouldShowImage && event.imageUrl && (
        <Image
          source={{
            uri: `${BASE_URL}/${event.imageUrl.replace(/^\/+/, '')}`,
          }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <View style={styles.chips}>
          <Text style={styles.chip}>{event.category}</Text>
          <Text
            style={[
              styles.chip,
              isCurrent ? styles.activeChip : styles.inactiveChip,
            ]}
          >
            {event.status?.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.location}>📍 {event.location}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonText}>Переглянути</Text>
          </TouchableOpacity>

          {isOrganizer && (
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonText}>Редагувати</Text>
            </TouchableOpacity>
          )}

          {isCurrent && (
            <TouchableOpacity
              style={isMember ? styles.disabledButton : styles.button}
              disabled={isMember}
              onPress={() => handleJoin(event.id)}
            >
              <Text
                style={
                  isMember
                    ? styles.disabledText
                    : styles.buttonTextWhite
                }
              >
                {isOrganizer
                  ? 'Ви організатор'
                  : isParticipant
                  ? 'Ви вже учасник'
                  : 'Доєднатися'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  inactiveChip: {
    backgroundColor: '#aaa',
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  buttonTextWhite: {
    fontSize: 14,
    color: '#fff',
  },
  disabledText: {
    fontSize: 14,
    color: '#666',
  },
});
