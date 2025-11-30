import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define um tipo unificado que pode ser uma Nota ou um Lembrete
interface Item {
    id: string;
    title?: string; // Título para notas
    content?: string; // Conteúdo para notas
    mode?: 'text' | 'list'; // Modo para notas
    list?: any[]; // Lista para notas
    color?: string; // Cor para notas
    message?: string; // Mensagem para lembretes
    date?: string; // Data para lembretes
}

export default function ViewNote() {
    const router = useRouter();
    // params agora conterá o objeto completo da nota (ou lembrete), se passado
    const params = useLocalSearchParams() as unknown as Item; 
    const { id } = params;

    const [item, setItem] = useState<Item | null>(null); // Use 'item' em vez de 'note'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadItem = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            // 1. Tentar carregar a nota/lembrete diretamente dos parâmetros
            // Na sua Home, você passa o objeto completo, então isso é o ideal.
            if (params.title || params.message) {
                setItem(params);
                setLoading(false);
                return;
            }

            // 2. Fallback: Se for acessado diretamente por ID, buscar no AsyncStorage
            try {
                // Tenta buscar como NOTA
                const storedNotes = await AsyncStorage.getItem("notes");
                if (storedNotes) {
                    const notes = JSON.parse(storedNotes);
                    const foundNote = notes.find((n: any) => n.id === id);
                    if (foundNote) {
                        setItem(foundNote);
                        return;
                    }
                }

                // Tenta buscar como LEMBRETE (Necessário se você usa esta View para Lembretes)
                const storedReminders = await AsyncStorage.getItem("reminders");
                if (storedReminders) {
                    const reminders = JSON.parse(storedReminders);
                    const foundReminder = reminders.find((r: any) => r.id === id);
                    if (foundReminder) {
                        setItem(foundReminder);
                        return;
                    }
                }

            } catch (error) {
                console.log("Erro ao buscar item:", error);
            } finally {
                setLoading(false);
            }
        };

        loadItem();
    }, [id, params]);

    // Usamos 'item' em vez de 'note' no resto do componente
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Item não encontrado.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: "blue" }}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    // ----------------------------------------------------
    // --- LÓGICA DE RENDERIZAÇÃO UNIFICADA ---
    // ----------------------------------------------------
    
    // Verifica se é um Lembrete
    const isReminder = !!item.message && !!item.date; 
    
    const backgroundColor = item.color || (isReminder ? '#EBEAE5' : '#fff'); // Fundo diferente para lembrete
    const textColor = isReminder ? '#333' : "#333"; 

    // Função para formatar a data do lembrete
    const formatDateTime = (dateString: string | undefined): string => {
        if (!dateString) return "Data Indefinida";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("pt-BR", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return "Data inválida";
        }
    };


    return (
        <View style={[styles.container, { backgroundColor }]}>
            
            {/* Header com Botão Voltar e Botão EDITAR */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={26} color={textColor} />
                </TouchableOpacity>

                {/* Botão de Editar */}
                <TouchableOpacity 
                    onPress={() => router.push({ 
                        // Navega para a tela correta (nota ou lembrete)
                        pathname: isReminder ? "/notes/create" : "/notes/create", 
                        params: { editId: item.id } 
                    })} 
                    style={styles.iconButton}
                >
                    <Ionicons name="create-outline" size={26} color={textColor} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                {isReminder ? (
                    // --- RENDERIZAÇÃO DE LEMBRETE ---
                    <View>
                        <View style={styles.dateBlock}>
                            <Ionicons name="alarm-outline" size={28} color="#1d631dff" />
                            <Text style={styles.dateText}>{formatDateTime(item.date)}</Text>
                        </View>
                        <Text style={[styles.title, styles.messageContent]}>{item.message}</Text>
                    </View>

                ) : (
                    // --- RENDERIZAÇÃO DE NOTA ---
                    <View>
                        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                        
                        {item.mode === 'list' && item.list ? (
                            <View style={styles.listContainer}>
                                {item.list.map((listItem: any, index: number) => (
                                    <View key={index} style={styles.listItem}>
                                        <Ionicons 
                                            name={listItem.isChecked ? "checkbox" : "square-outline"} 
                                            size={22} 
                                            color={textColor} 
                                            style={{ opacity: 0.6 }}
                                        />
                                        <Text style={[
                                            styles.listText, 
                                            { color: textColor },
                                            listItem.isChecked && styles.checkedText
                                        ]}>
                                            {listItem.text}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={[styles.content, { color: textColor }]}>{item.content}</Text>
                        )}
                    </View>
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
        flexDirection: 'row', 
        justifyContent: 'space-between', 
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
    // Lembrete
    dateBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(74, 97, 74, 0.1)', // #4A614A com transparência
    },
    dateText: {
        fontSize: 16, 
        fontWeight: "bold", 
        color: "#4A614A",
        marginLeft: 10,
    },
    messageContent: {
        fontSize: 22, 
        lineHeight: 32,
        fontWeight: "600",
        color: '#333'
    },
    // Lista
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