import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Folders() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Pastas</Text>

      <TouchableOpacity style={styles.addFolderButton}>
        <Ionicons name="folder-open" size={22} color="#fff" />
        <Text style={styles.addFolderText}>Criar nova pasta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9EADB", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  addFolderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#343434",
    padding: 14,
    borderRadius: 14,
  },
  addFolderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
