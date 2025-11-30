import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const today = new Date();
  const dayMonth = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const year = today.getFullYear();

  const [notes, setNotes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) setNotes(parsedNotes);
      }

      const storedReminders = await AsyncStorage.getItem("reminders");
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders);
        if (Array.isArray(parsedReminders)) {
          parsedReminders.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setReminders(parsedReminders);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddNote = () => {
    router.push("/notes/create");
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a nota.");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const updatedReminders = reminders.filter((r) => r.id !== reminderId);
      setReminders(updatedReminders);
      await AsyncStorage.setItem(
        "reminders",
        JSON.stringify(updatedReminders)
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o lembrete.");
    }
  };

  const formatReminderDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${d.getDate()}/${d.getMonth() + 1} às ${d.getHours()}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const handleViewReminder = (reminderId: string) => {
    router.push({ pathname: "/notes/view", params: { id: reminderId } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E9EADB" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateText, { fontSize: 32 }]}>{dayMonth}</Text>
            <Text style={[styles.dateText, { fontSize: 36 }]}>{year}</Text>
          </View>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/configura")}
            activeOpacity={0.7}
          >
            <Text style={styles.username}>Perfil</Text>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "http://i.pravatar.cc/100" }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#555"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {/* Lembretes */}
            {reminders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lembretes</Text>
                <View style={styles.remindersContainer}>
                  {reminders.map((reminder) => (
                    <TouchableOpacity
                      key={reminder.id}
                      style={[
                        styles.reminderCard,
                        { backgroundColor: reminder.color || "#2E3A2E" },
                      ]}
                      onPress={() => handleViewReminder(reminder.id)}
                      onLongPress={() => {
                        Alert.alert(
                          "Concluir Lembrete?",
                          "Deseja remover este lembrete?",
                          [
                            { text: "Não", style: "cancel" },
                            {
                              text: "Sim",
                              onPress: () =>
                                handleDeleteReminder(reminder.id),
                            },
                          ]
                        );
                      }}
                    >
                      <View
                        style={[
                          styles.reminderBorder,
                          { backgroundColor: reminder.color || "#2E3A2E" },
                        ]}
                      />
                      <View style={styles.reminderIcon}>
                        <Ionicons name="notifications" size={20} color="#FFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={styles.reminderMessage}
                          numberOfLines={2}
                        >
                          {reminder.message}
                        </Text>
                        <Text style={styles.reminderDate}>
                          {formatReminderDate(reminder.date)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Notas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minhas Notas</Text>
              <View style={styles.notesContainer}>
                {notes.length === 0 ? (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: "#555",
                      width: "100%",
                    }}
                  >
                    Nenhuma nota ainda.
                  </Text>
                ) : (
                  notes.map((note) => (
                    <TouchableOpacity
                      key={note.id}
                      onPress={() =>
                        router.push({ pathname: "/notes/view", params: note })
                      }
                      onLongPress={() => {
                        Alert.alert(
                          "Apagar bloco?",
                          "Deseja realmente apagar este bloco?",
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Apagar",
                              style: "destructive",
                              onPress: () => handleDeleteNote(note.id),
                            },
                          ]
                        );
                      }}
                      style={[
                        styles.noteCard,
                        {
                          backgroundColor: note.color || "#444",
                          minHeight: note.mode === "list" ? 150 : 120,
                        },
                      ]}
                    >
                      <Text style={styles.noteTitle}>
                        {note.title || "Sem título"}
                      </Text>
                      {note.mode === "list" && Array.isArray(note.list) ? (
                        note.list.slice(0, 3).map((item: any, index: number) => (
                          <Text key={index} style={styles.listItemPreview}>
                            • {item.text}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.noteContent} numberOfLines={3}>
                          {note.content}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={handleAddNote}>
        <Ionicons name="add" size={32} color="rgba(206, 208, 181, 1)" />
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
    marginBottom: 10,
  },
  dateText: {
    color: "#232622",
    fontWeight: "600",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    color: "#232622",
    fontWeight: "600",
    fontSize: 14,
  },
  profileImageContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#ccc",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  separator: {
    color: "#232622",
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: "500",
  },

  // Seções
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginLeft: 4,
  },

  // Lembretes
  remindersContainer: {
    gap: 10,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reminderBorder: {
    width: 6,
    height: "100%",
    borderRadius: 3,
    marginRight: 10,
  },
  reminderIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  reminderMessage: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
  reminderDate: {
    color: "#CCC",
    fontSize: 12,
    marginTop: 2,
  },

  // Notas
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noteCard: {
    width: "48%",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    justifyContent: "center",
  },
  noteTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  noteContent: {
    color: "#eee",
    fontSize: 14,
  },
  listItemPreview: {
    color: "#f5f5f5",
    fontSize: 13,
    marginBottom: 3,
  },

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
  },
});
