import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem('reminders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Só pegar lembretes com data
          const sorted = parsed
            .filter(r => r.date)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setReminders(sorted);
        }
      }
    } catch (e) {
      console.log('Erro ao carregar lembretes:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator size="large" color="#555" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {reminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum lembrete encontrado.</Text>
              <TouchableOpacity onPress={() => router.push('/notes/create')}>
                <Text style={styles.createLink}>Criar primeiro lembrete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {reminders.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.card, { backgroundColor: '#b1deb1ff' }]}
                  onPress={() => router.push({ pathname: '/notes/view', params: r })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {r.message}
                  </Text>
                  <Text style={styles.cardDate}>
                    {new Date(r.date).toLocaleDateString('pt-BR')} - {new Date(r.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF8F0', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888', marginBottom: 10 },
  createLink: { fontSize: 16, color: '#4E7494', fontWeight: 'bold', textDecorationLine: 'underline' },
  grid: { flexDirection: 'column', gap: 15 },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, color: '#FFF', fontWeight: 'bold', marginBottom: 8 },
  cardDate: { fontSize: 14, color: '#DDD' },
});
