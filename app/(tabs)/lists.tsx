import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Lists() {
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLists() {
    try {
      const stored = await AsyncStorage.getItem("notes");
      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          // PUXA APENAS LISTAS
          const onlyLists = parsed.filter(item => item.mode === "list");
          setLists(onlyLists.reverse());
        }
      }
    } catch (e) {
      console.error("Erro ao carregar listas:", e);
    }
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Listas</Text>

      {loading && <ActivityIndicator size="large" color="#000" />}

      <ScrollView contentContainerStyle={styles.scroll}>
        {lists.length === 0 &&
          !loading &&
          <Text style={styles.emptyText}>Nenhuma lista ainda.</Text>
        }

        {lists.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(`/notes/view?id=${item.id}`)}
          >
            <Text style={styles.title}>{item.title || "Sem título"}</Text>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/notes/create?mode=list")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  scroll: { paddingBottom: 80 },
  card: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "500" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 40,
    elevation: 4,
  },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#999" },
});
