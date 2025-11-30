import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- 1. DEFINIÇÃO DAS CORES ---
const COLOR_OPTIONS = [
  '#4A614A', // Verde Escuro
  '#A16E83', // Rosa Velho
  '#4E7494', // Azul Aço
  '#D7B10A', // Amarelo Ouro
  '#808080', // Cinza Neutro
  '#9E6038', // Marrom Cobre
];

const LembreteScreen = () => {
  const router = useRouter();

  // --- Estados do Componente ---
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  // --- Funções de Manipulação ---
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    if (Platform.OS === 'android') setShowTimePicker(false);
    setDate(currentTime);
  };

  const showDateMode = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };

  const showTimeMode = () => {
    setShowTimePicker(true);
    setShowDatePicker(false);
  };

  // --- Função de Salvar ---
  const handleSaveReminder = async () => {
    if (!message.trim()) {
      Alert.alert("Atenção", "Por favor, escreva o que devemos lembrar.");
      return;
    }

    try {
      const newReminder = {
        id: Date.now().toString(),
        date: date.toISOString(),
        message: message.trim(),
        color: selectedColor,
        createdAt: Date.now(),
      };

      const storedReminders = await AsyncStorage.getItem("reminders");
      const currentReminders = storedReminders ? JSON.parse(storedReminders) : [];
      const updatedReminders = [...currentReminders, newReminder];

      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));

      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      Alert.alert(
        'Lembrete Salvo!',
        `"${message}" agendado para ${formattedDate} às ${formattedTime}.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.log("Erro ao salvar lembrete:", error);
      Alert.alert("Erro", "Não foi possível salvar o lembrete.");
    }
  };

  // --- Componente Seletor de Cores ---
  const renderColorSelector = () => (
    <View style={styles.colorSelectorContainer}>
      <Text style={styles.colorSelectorLabel}>Cor do Bloco na Lista:</Text>
      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorOptionSelected,
            ]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && <Ionicons name="checkmark" size={20} color="#FFF" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={[styles.headerText, { marginLeft: 10 }]}>Agendar</Text>
          </TouchableOpacity>
        </View>

        {/* Data Selecionada */}
        <View style={styles.selectedDateDisplay}>
          <Text style={styles.selectedDateLabel}>Agendado para:</Text>
          <View style={styles.selectedDateInfo}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
            <Text style={styles.selectedDateText}>
              {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={showDateMode} style={styles.editDateButton}>
              <Ionicons name="create-outline" size={20} color="#5B5B5B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seletor de Cores */}
        {renderColorSelector()}

        {/* Box de Lembrete */}
        <View style={styles.reminderBox}>
          <TouchableOpacity style={styles.datePart} onPress={showDateMode}>
            <Text style={styles.dateText}>{date.getDate().toString().padStart(2, '0')}</Text>
            <Text style={styles.labelSmall}>Dia</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.timePart} onPress={showTimeMode}>
            <Text style={styles.dateText}>
              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.labelSmall}>Hora</Text>
          </TouchableOpacity>

          <View style={styles.messagePart}>
            <TextInput
              style={styles.messageInput}
              onChangeText={setMessage}
              value={message}
              placeholder="O que vamos lembrar?"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
        </View>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        )}

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReminder}>
          <Text style={styles.saveButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ------------------------------------
// --- ESTILOS ---
// ------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F0',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedDateDisplay: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#EBEAE5',
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#4A614A',
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  selectedDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  editDateButton: {
    padding: 5,
  },
  colorSelectorContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  colorSelectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B5B5B',
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 5,
  },
  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  colorOptionSelected: {
    borderWidth: 4,
    borderColor: '#FFF',
  },
  reminderBox: {
    flexDirection: 'row',
    backgroundColor: '#2E3A2E',
    borderRadius: 16,
    height: 90,
    marginHorizontal: 20,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  datePart: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  timePart: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  messagePart: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  labelSmall: {
    fontSize: 10,
    color: '#CCC',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  messageInput: {
    color: '#FFF',
    fontSize: 16,
    padding: 0,
  },
  saveButton: {
    backgroundColor: '#4A614A',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default LembreteScreen;
