import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ViewNote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, content, color } = params;

  return (
    <View style={[styles.container, { backgroundColor: color || "#fff" }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={{ color: "#fff" }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12, color: "#fff" },
  content: { fontSize: 16, color: "#fff" },
  backButton: {
    position: "absolute",
    bottom: 30,
    left: 25,
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 10,
  },
});
