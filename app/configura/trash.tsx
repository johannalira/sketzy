import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// CORREÇÃO 1: Usando Ionicons para evitar erros
import { Ionicons } from "@expo/vector-icons";
// CORREÇÃO 2: Importação correta do router
import { useRouter } from "expo-router";

export default function Trash() {
  const router = useRouter();
  const [trash, setTrash] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrash();
  }, []);

  async function loadTrash() {
    try {
      const storedTrash = await AsyncStorage.getItem("trash");
      const data = storedTrash ? JSON.parse(storedTrash) : [];

      // Limpa itens muito antigos (mais de 7 dias)
      const cleaned = cleanOldTrash(data);
      
      // Se houve limpeza, atualiza o storage
      if (cleaned.length !== data.length) {
        await AsyncStorage.setItem("trash", JSON.stringify(cleaned));
      }

      setTrash(cleaned);
    } catch (error) {
      console.log("Erro ao carregar lixeira", error);
    } finally {
      setLoading(false);
    }
  }

  function cleanOldTrash(list: any[]) {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    // Garante que item.deletedAt existe, senão assume agora para não apagar errado
    return list.filter(
      item => Date.now() - (item.deletedAt || Date.now()) < sevenDays
    );
  }

  async function restoreNote(item: any) {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      
      const storedTrash = await AsyncStorage.getItem("trash");
      const currentTrash = storedTrash ? JSON.parse(storedTrash) : [];

      // Adiciona de volta às notas (remove o campo deletedAt se quiser limpar)
      const noteToRestore = { ...item };
      delete noteToRestore.deletedAt;
      
      const newNotes = [...notes, noteToRestore];
      const newTrash = currentTrash.filter((n: any) => n.id !== item.id);

      await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
      await AsyncStorage.setItem("trash", JSON.stringify(newTrash));

      setTrash(newTrash);
      Alert.alert("Sucesso", "Nota restaurada!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao restaurar nota.");
    }
  }

  async function deleteForever(id: string) {
    Alert.alert(
      "Excluir permanentemente",
      "Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = trash.filter(n => n.id !== id);
              await AsyncStorage.setItem("trash", JSON.stringify(updated));
              setTrash(updated);
            } catch (error) {
              console.log("Erro ao deletar", error);
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
         
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Lixeira</Text>
      </View>

      {loading ? (
         <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {trash.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Ionicons name="trash-outline" size={50} color="#333" />
                <Text style={styles.empty}>A lixeira está vazia.</Text>
            </View>
          ) : (
            trash.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title || "Sem título"}</Text>
                
                {item.mode === 'list' ? (
                   <Text style={styles.cardText}>[Lista de verificação]</Text>
                ) : (
                   <Text style={styles.cardText} numberOfLines={2}>
                     {item.content || "Sem conteúdo"}
                   </Text>
                )}

                <View style={styles.row}>
                  <TouchableOpacity 
                    onPress={() => restoreNote(item)} 
                    style={styles.actionButton}
                  >
                    <Ionicons name="refresh" size={20} color="#4ade80" />
                    <Text style={[styles.actionText, { color: "#4ade80" }]}>Restaurar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => deleteForever(item.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash" size={20} color="#ef4444" />
                    <Text style={[styles.actionText, { color: "#ef4444" }]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 10
  },
  empty: {
    color: "#777",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#555'
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  cardText: {
    color: "#ccc",
    marginBottom: 15,
    fontSize: 14
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500"
  }
});