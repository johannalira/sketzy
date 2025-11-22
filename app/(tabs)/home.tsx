import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const today = new Date();
  const dayMonth = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}`;
  const year = today.getFullYear();

  const [notes, setNotes] = useState([]);

  // Carregar notas do AsyncStorage
  useEffect(() => {
    const loadNotes = async () => {
      const stored = await AsyncStorage.getItem("notes");
      if (stored) setNotes(JSON.parse(stored));
    };
    loadNotes();
  }, []);

  const handleAddNote = () => {
    router.push("/notes/create"); // vai pra tela de criação
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateText, { fontSize: 32 }]}>{dayMonth}</Text>
            <Text style={[styles.dateText, { fontSize: 36 }]}>{year}</Text>
          </View>

          <Text style={styles.separator}>|</Text>

          <TouchableOpacity style={styles.profileContainer}
          onPress={() => router.push('/configura/confg')}
          activeOpacity={0.7}
          >
            <Text style={styles.username}>Username</Text>
            <Image source={{ uri: "http://i.pravatar.cc/100" }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        {/* Notas */}
        <View style={styles.notesContainer}>
          {notes.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>Nenhuma nota ainda</Text>
          ) : (
            notes.map((note) => ( 
              <TouchableOpacity
                key={note.id}
                onPress={() => router.push({ pathname: "/notes/view", params: note })}
                style={[styles.noteCard, { backgroundColor: note.color }]}
              >
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddNote}>
        <Plus color="rgba(206, 208, 181, 1)" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EADB",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateText: { color: "#232622", fontWeight: "600" },
  profileContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  username: { color: "#232622", fontWeight: "600", fontSize: 14 },
  profileImage: { width: 35, height: 35, borderRadius: 20, borderWidth: 1, borderColor: "#888" },
  separator: { color: "#232622", fontSize: 18, marginHorizontal: 8, fontWeight: "500" },
  notesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  noteCard: {
    width: "48%",
    minHeight: 120,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    justifyContent: "center",
  },
  noteTitle: { color: "#fff", fontWeight: "600", fontSize: 16, marginBottom: 6 },
  noteContent: { color: "#eee", fontSize: 14 },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "rgba(38, 38, 38, 1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    profileContainer: { flexDirection: "row", alignItems: "center" },
    username: { color: "#232622", fontWeight: "600", fontSize: 14, marginRight: 8 },
  },
});
