import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

export default function CreateNote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { editId } = params;

  // Garante um ID estável para esta sessão (não muda ao digitar)
  // Se veio editId, usa ele. Se não, cria um novo agora e mantém ele.
  const [noteId] = useState(() => {
    if (editId) return Array.isArray(editId) ? editId[0] : editId;
    return Date.now().toString();
  });

  const [mode, setMode] = useState("note"); 
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#E6E6D9");
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [listItems, setListItems] = useState<{ text: string; isChecked: boolean }[]>([
    { text: "", isChecked: false },
  ]);

  // Refs para guardar os valores mais recentes sem forçar re-render ou disparar useEffects
  const noteDataRef = useRef({ title, content, listItems, selectedColor, mode });

  // Atualiza a Ref toda vez que algo muda (sem salvar no banco ainda)
  useEffect(() => {
    noteDataRef.current = { title, content, listItems, selectedColor, mode };
  }, [title, content, listItems, selectedColor, mode]);

  const isSaving = useRef(false);
  const didSaveOnUnmount = useRef(false);

  // --- Carregar dados se for EDIÇÃO ---
  useEffect(() => {
    if (editId) {
      const loadNoteToEdit = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem("notes");
          if (storedNotes) {
            const notes = JSON.parse(storedNotes);
            const noteToEdit = notes.find((n: any) => n.id == editId);
            
            if (noteToEdit) {
              setTitle(noteToEdit.title || "");
              setContent(noteToEdit.content || "");
              setSelectedColor(noteToEdit.color || "#E6E6D9");
              setMode(noteToEdit.mode || "note");
              if (noteToEdit.list && Array.isArray(noteToEdit.list)) {
                setListItems(noteToEdit.list);
              }
            }
          }
        } catch (error) {
          console.log("Erro ao carregar nota para edição", error);
        }
      };
      loadNoteToEdit();
    }
  }, [editId]);

  const colors = ["#E6E6D9", "#F4BFBF", "#A3C9A8", "#A0C4FF", "#FFD6A5", "#FFADAD"];

  // --- Funções da Lista ---
  const updateListItemText = (text: string, index: number) => {
    const newItems = [...listItems];
    newItems[index].text = text;
    setListItems(newItems);
  };

  const toggleListItemCheck = (index: number) => {
    const newItems = [...listItems];
    newItems[index].isChecked = !newItems[index].isChecked;
    setListItems(newItems);
  };

  const addListItem = () => {
    setListItems([...listItems, { text: "", isChecked: false }]);
  };

  const removeListItem = (index: number) => {
    if (listItems.length === 1) {
      setListItems([{ text: "", isChecked: false }]);
      return;
    }
    const newItems = listItems.filter((_, i) => i !== index);
    setListItems(newItems);
  };
  // ------------------------

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    setColorModalVisible(false);
  };

  const saveNoteToStorage = async () => {
    if (isSaving.current) return;

    // Pega os dados mais recentes da Ref
    const currentData = noteDataRef.current;
    
    const hasContent = currentData.content.trim().length > 0;
    const hasList = currentData.listItems.some(i => i.text.trim().length > 0);
    const hasTitle = currentData.title.trim().length > 0;

    if (!hasTitle && !hasContent && !hasList) return; 
    
    isSaving.current = true;
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      
      const noteData = {
        id: noteId, // Usa o ID estável criado no início
        title: currentData.title,
        content: currentData.content,
        list: currentData.listItems,
        color: currentData.selectedColor,
        mode: currentData.mode,
      };

      // Procura se a nota já existe pelo ID para atualizar ou criar
      const existingIndex = parsedNotes.findIndex((n: any) => n.id === noteId);
      
      let updatedNotes;
      if (existingIndex !== -1) {
        // Atualiza nota existente
        parsedNotes[existingIndex] = noteData;
        updatedNotes = parsedNotes;
      } else {
        // Cria nova nota
        updatedNotes = [...parsedNotes, noteData];
      }
      
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      console.log("Nota salva (Upsert):", noteData.title);
    } catch (error) {
      console.log("Erro ao salvar nota:", error);
    } finally {
      isSaving.current = false;
    }
  };

  const handleBack = async () => {
    didSaveOnUnmount.current = true; 
    await saveNoteToStorage();
    router.back();
  };

  // Salva automaticamente APENAS quando o componente for desmontado (sair da tela)
  useEffect(() => {
    return () => {
      // Só salva se não tivermos salvo manualmente pelo botão Voltar
      if (!didSaveOnUnmount.current) {
        saveNoteToStorage();
      }
    };
  }, []); // Dependências vazias = roda só na montagem/desmontagem

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <TextInput
          placeholder="Título..."
          style={styles.titleInput}
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.content}>
        {mode === "note" ? (
          <TextInput
            placeholder="Escreva sua nota aqui..."
            style={styles.textInput}
            placeholderTextColor="#777"
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />
        ) : (
          <ScrollView style={styles.listContainer} keyboardShouldPersistTaps="always">
            {listItems.map((item, index) => (
              <View key={index} style={styles.listItemRow}>
                <TouchableOpacity onPress={() => toggleListItemCheck(index)} style={styles.checkbox}>
                  <Ionicons 
                    name={item.isChecked ? "checkbox" : "square-outline"} 
                    size={24} 
                    color="#555" 
                  />
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.listItemInput, 
                    item.isChecked && styles.listItemInputChecked
                  ]}
                  placeholder="Item..."
                  placeholderTextColor="#888"
                  value={item.text}
                  onChangeText={(text) => updateListItemText(text, index)}
                />

                <TouchableOpacity onPress={() => removeListItem(index)} style={styles.deleteButton}>
                  <Ionicons name="close" size={20} color="#888" />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity onPress={addListItem} style={styles.addItemButton}>
              <Ionicons name="add" size={20} color="#555" />
              <Text style={styles.addItemText}>Adicionar item</Text>
            </TouchableOpacity>
            
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => setMode("note")}>
          <Ionicons name="create-outline" size={24} color={mode === "note" ? "#E6E6D9" : "#777"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode("list")}>
          <Ionicons name="list" size={24} color={mode === "list" ? "#E6E6D9" : "#777"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setColorModalVisible(true)}>
          <Ionicons name="color-palette-outline" size={24} color="#E6E6D9" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notes/dataeven')}>
          <Ionicons name="calendar-outline" size={24} color="#E6E6D9" />
        </TouchableOpacity>
      </View>

      <Modal visible={colorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha uma cor</Text>
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
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 15,
    color: "#333",
    paddingVertical: 5,
  },
  content: { flex: 1, padding: 20 },
  textInput: { flex: 1, fontSize: 16, color: "#333", lineHeight: 24 },
  
  listContainer: { flex: 1 },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: { paddingRight: 10 },
  listItemInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1, 
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingVertical: 4,
  },
  listItemInputChecked: {
    textDecorationLine: "line-through",
    color: "#999",
    borderBottomColor: "transparent"
  },
  deleteButton: { padding: 8 },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    opacity: 0.7
  },
  addItemText: { marginLeft: 8, color: "#555", fontSize: 16 },

  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedColor: { borderWidth: 3, borderColor: "#333" },
  closeButton: {
    marginTop: 25,
    backgroundColor: "#333",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeText: { color: "#fff", fontWeight: "600" },
});