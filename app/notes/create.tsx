// ...existing code...
import { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, Edit3, List, Calendar, Palette } from "lucide-react-native";

export default function CreateNote() {
  const router = useRouter();
  const [mode, setMode] = useState("note");
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#E6E6D9");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isSaving = useRef(false);
  const didSaveOnUnmount = useRef(false);

  const colors = ["#E6E6D9", "#F4BFBF", "#A3C9A8", "#A0C4FF", "#FFD6A5", "#FFADAD"];

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    setColorModalVisible(false);
  };

  const saveNoteToStorage = async () => {
    if (isSaving.current) return;
    if (!title.trim() && !content.trim()) return; // evita notas vazias
    isSaving.current = true;
    try {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        color: selectedColor,
      };
      const storedNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = [...parsedNotes, newNote];
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      console.log("Nota salva:", newNote);
    } catch (error) {
      console.log("Erro ao salvar nota:", error);
    } finally {
      isSaving.current = false;
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Adiciona um título antes de salvar!");
      return;
    }
    await saveNoteToStorage();
    router.replace("/home");
  };

  const handleBack = async () => {
    await saveNoteToStorage();
    router.replace("/home");
  };

  // salva automaticamente quando a tela for desmontada (sair)
  useEffect(() => {
    return () => {
      if (!didSaveOnUnmount.current) {
        // não aguardar aqui para não bloquear a desmontagem
        saveNoteToStorage();
        didSaveOnUnmount.current = true;
      }
    };
    // manter dependências para capturar valores atuais no cleanup
  }, [title, content, selectedColor]);

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={26} color="#333" />
        </TouchableOpacity>

        <TextInput
          placeholder="Título da nota..."
          style={styles.titleInput}
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.content}>
        <TextInput
          placeholder={mode === "note" ? "Escreva sua nota..." : "Adicione itens da lista..."}
          style={styles.textInput}
          placeholderTextColor="#777"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
      </View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => setMode("note")}>
          <Edit3 size={24} color={mode === "note" ? "#E6E6D9" : "#777"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("list")}>
          <List size={24} color={mode === "list" ? "#E6E6D9" : "#777"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setColorModalVisible(true)}>
          <Palette size={24} color="#E6E6D9" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Calendar size={24} color="#E6E6D9" />
        </TouchableOpacity>
      </View>

      <Modal visible={colorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha uma cor do bloco</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => handleSelectColor(color)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setColorModalVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 15,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 4,
  },
  content: { flex: 1, padding: 20 },
  textInput: { flex: 1, fontSize: 16, color: "#333" },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "500", marginBottom: 15 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColor: { borderWidth: 3, borderColor: "#111" },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeText: { color: "#fff", fontWeight: "500" },
});  