import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

export default function NotificationsScreen() {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'byEvent'
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/notifications`, { withCredentials: true })
      .then(({ data }) => setAll(data))
      .catch(err => {
        console.error(err);
        Alert.alert('Помилка', 'Не вдалося завантажити повідомлення');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'byEvent' && selected) {
      return n.event.id === selected.event.id;
    }
    return true;
  });

  const markRead = async () => {
    if (!selected) return;
    try {
      await axios.put(
        `${BASE_URL}/notifications/${selected.id}/read`,
        {},
        { withCredentials: true }
      );
      // локально оновлюємо статус
      setAll(prev =>
        prev.map(n =>
          n.id === selected.id ? { ...n, read: true } : n
        )
      );
      setSelected(sel => ({ ...sel, read: true }));
    } catch {
      Alert.alert('Помилка', 'Не вдалося позначити як прочитане');
    }
  };

  const remove = async () => {
    if (!selected) return;
    try {
      await axios.delete(
        `${BASE_URL}/notifications/${selected.id}`,
        { withCredentials: true }
      );
      setAll(prev => prev.filter(n => n.id !== selected.id));
      setSelected(null);
    } catch {
      Alert.alert('Помилка', 'Не вдалося видалити повідомлення');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Повідомлення</Text>
      <Text style={styles.subtitle}>
        Будь в курсі повідомлень від організатора
      </Text>

      {/* Фільтри */}
      <View style={styles.filters}>
        {['all', 'unread', 'byEvent'].map(val => (
          <TouchableOpacity
            key={val}
            style={[
              styles.filterButton,
              filter === val && styles.filterButtonActive,
            ]}
            onPress={() => {
              setFilter(val);
              if (val !== 'byEvent') setSelected(null);
            }}
          >
            <Text
              style={[
                styles.filterText,
                filter === val && styles.filterTextActive,
              ]}
            >
              {val === 'all'
                ? 'Усі'
                : val === 'unread'
                ? 'Непрочитані'
                : 'Подія'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Список повідомлень */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              selected?.id === item.id && styles.listItemSelected,
            ]}
            onPress={() => {
              setSelected(item);
              setFilter('byEvent');
            }}
          >
            <View style={styles.listItemText}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              <Text style={styles.messageSnippet}>
                {item.message.length > 50
                  ? item.message.slice(0, 50) + '…'
                  : item.message}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Немає повідомлень</Text>
        }
      />

      {/* Деталі обраного повідомлення */}
      {selected && (
        <ScrollView style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selected.event.title}</Text>
            <View style={styles.detailActions}>
              <TouchableOpacity onPress={markRead}>
                <Text style={styles.actionText}>🔖</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={remove} style={{ marginLeft: 16 }}>
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.fromText}>
            Від:{' '}
            {(() => {
              const org = selected.event.eventParticipants.find(
                p => p.role === 'organizer'
              );
              return org?.user?.username || 'Organizer';
            })()}
          </Text>
          <Text style={styles.fullMessage}>{selected.message}</Text>
          <TouchableOpacity style={styles.replyButton}>
            <Text style={styles.replyButtonText}>
              На жаль не можу доєднатись
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f1e4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', margin:10, textAlign:'center' },
  subtitle: { color: '#666', margin: 12, textAlign:'center' },
  filters: { flexDirection: 'row', marginBottom: 12 },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: { backgroundColor: 'rgba(121,122,31,0.8)' },
  filterText: { color: '#333' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { flexGrow: 0, marginBottom: 12 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemSelected: { backgroundColor: '#e8e8e8' },
  listItemText: { flex: 1 },
  eventTitle: { fontWeight: '600', marginBottom: 4 },
  messageSnippet: { color: '#666' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'orange',
  },
  empty: { textAlign: 'center', color: '#666', marginTop: 16 },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: { fontSize: 18, fontWeight: '700' },
  detailActions: { flexDirection: 'row' },
  actionText: { fontSize: 20 },
  fromText: { color: '#666', marginTop: 8 },
  fullMessage: { marginTop: 12, lineHeight: 20 },
  replyButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  replyButtonText: { color: '#333', fontWeight: '600' },
});
