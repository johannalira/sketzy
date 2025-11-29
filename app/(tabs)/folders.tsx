import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

export default function FoldersScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar as notas do banco
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) {
          // Opcional: Inverter a ordem para as mais novas aparecerem primeiro
          setNotes(parsedNotes.reverse()); 
        }
      }
    } catch (error) {
      console.log("Erro ao carregar notas na grade:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que você entra nesta aba
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NOTAS (GRADE)</Text>
        </View>

        {loading ? (
           <ActivityIndicator size="large" color="#555" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {notes.length === 0 ? (
               <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>
                  <TouchableOpacity onPress={() => router.push('/notes/create')}>
                     <Text style={styles.createLink}>Criar primeira nota</Text>
                  </TouchableOpacity>
               </View>
            ) : (
              <View style={styles.grid}>
                {notes.map((note) => (
                  <TouchableOpacity 
                    key={note.id} 
                    style={[
                      styles.card, 
                      { backgroundColor: note.color || '#82789E' } // Usa a cor da nota ou Roxo padrão
                    ]}
                    activeOpacity={0.8}
                    // Ao clicar, vai para a visualização da nota igual na Home
                    onPress={() => router.push({ pathname: "/notes/view", params: note })}
                  >
                    <Text style={styles.cardText} numberOfLines={4}>
                      {note.title || "Sem título"}
                    </Text>
                    
                    {/* Ícone discreto indicando se é lista ou texto */}
                    {note.mode === 'list' && (
                       <Ionicons name="checkbox-outline" size={20} color="rgba(0,0,0,0.4)" style={styles.typeIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBECE2', 
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#EBECE2',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    width: '47%', 
    aspectRatio: 0.85, 
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between', // Espalha o conteúdo (texto em cima, ícone embaixo)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 24, // Letra grande igual ao design
    color: '#1A1A1A',
    // Tenta usar fonte monoespaçada se disponível para ficar estiloso
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    lineHeight: 28,
    marginTop: 5,
    opacity: 0.85,
  },
  typeIcon: {
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  createLink: {
    fontSize: 16,
    color: '#4E7494',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});