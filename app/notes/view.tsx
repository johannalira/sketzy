import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewNote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params; 

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("notes");
        if (storedNotes) {
          const notes = JSON.parse(storedNotes);
          const foundNote = notes.find((n: any) => n.id === id);
          setNote(foundNote);
        }
      } catch (error) {
        console.log("Erro ao buscar nota", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Nota não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "blue" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backgroundColor = note.color || "#fff";
  const textColor = "#333"; 

  return (
    <View style={[styles.container, { backgroundColor }]}>
      
      {/* Header com Botão Voltar e Botão EDITAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
           <Ionicons name="arrow-back" size={26} color={textColor} />
        </TouchableOpacity>

        {/* Botão de Editar que manda para a tela de criação com o ID */}
        <TouchableOpacity 
          onPress={() => router.push({ pathname: "/notes/create", params: { editId: note.id } })} 
          style={styles.iconButton}
        >
           <Ionicons name="create-outline" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={[styles.title, { color: textColor }]}>{note.title}</Text>
        
        {note.mode === 'list' && note.list ? (
          <View style={styles.listContainer}>
            {note.list.map((item: any, index: number) => (
              <View key={index} style={styles.listItem}>
                <Ionicons 
                  name={item.isChecked ? "checkbox" : "square-outline"} 
                  size={22} 
                  color={textColor} 
                  style={{ opacity: 0.6 }}
                />
                <Text style={[
                  styles.listText, 
                  { color: textColor },
                  item.isChecked && styles.checkedText
                ]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.content, { color: textColor }]}>{note.content}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row', // Para alinhar os botões lado a lado
    justifyContent: 'space-between', // Um na esquerda, outro na direita
    alignItems: 'center'
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 20,
  },
  content: { 
    fontSize: 18, 
    lineHeight: 28,
  },
  listContainer: {
    gap: 12
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  listText: {
    fontSize: 18,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5
  }
});