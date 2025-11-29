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
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// Importação necessária para salvar os dados
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Componente Auxiliar ---
const CalendarBox = ({ day, selected }: { day: number | string | null, selected: boolean }) => (
  <View style={[styles.calendarDay, selected && styles.calendarDaySelected]}>
    <Text style={[styles.calendarText, selected && styles.calendarTextSelected]}>
      {day}
    </Text>
  </View>
);

const LembreteScreen = () => {
  const router = useRouter();

  // --- Estados do Componente ---
  const [date, setDate] = useState(new Date()); // Começa com a data de hoje
  const [message, setMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // --- Funções de Manipulação ---
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
    setDate(currentDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    if (Platform.OS === 'android') {
        setShowTimePicker(false);
    }
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

  // --- FUNÇÃO DE SALVAR ATUALIZADA ---
  const handleSaveReminder = async () => {
    // 1. Validação básica
    if (!message.trim()) {
        Alert.alert("Atenção", "Por favor, escreva o que devemos lembrar.");
        return;
    }

    try {
        // 2. Criar o objeto do lembrete
        const newReminder = {
            id: Date.now().toString(), // ID único
            date: date.toISOString(),  // Data em formato texto para salvar
            message: message.trim(),
            createdAt: Date.now(),
        };

        // 3. Buscar lembretes existentes
        const storedReminders = await AsyncStorage.getItem("reminders");
        const currentReminders = storedReminders ? JSON.parse(storedReminders) : [];

        // 4. Adicionar o novo na lista
        const updatedReminders = [...currentReminders, newReminder];

        // 5. Salvar de volta no celular
        await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));

        // 6. Confirmação visual
        const formattedDate = date.toLocaleDateString('pt-BR');
        const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        Alert.alert(
          'Lembrete Salvo!',
          `"${message}" agendado para ${formattedDate} às ${formattedTime}.`,
          [
            { text: "OK", onPress: () => router.back() } // Volta para a tela anterior
          ]
        );

    } catch (error) {
        console.log("Erro ao salvar lembrete:", error);
        Alert.alert("Erro", "Não foi possível salvar o lembrete.");
    }
  };

  // --- Renderização do Calendário ---
  const renderCalendar = () => {
    // Dias fixos para Dezembro 2025 (Exemplo visual)
    const days = [
        null, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27,
        28, 29, 30, 31
    ];

    const calendarGrid = [];
    const dayNames = ['DOM', 'SEG', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    
    // Cabeçalho
    const header = dayNames.map((name, index) => (
      <Text key={`header-${index}`} style={styles.headerDay}>{name}</Text>
    ));
    calendarGrid.push(<View key="header" style={styles.calendarRow}>{header}</View>);

    // Corpo
    let dayIndex = 0; 
    for (let i = 0; i < 5; i++) { 
        const row = [];
        for (let j = 0; j < 7; j++) { 
            const day = days[dayIndex];
            const isSelected = day === date.getDate() && date.getMonth() === 11 && date.getFullYear() === 2025;

            row.push(
                <TouchableOpacity
                    key={`day-${i}-${j}`}
                    onPress={() => day && setDate(new Date(2025, 11, day, date.getHours(), date.getMinutes()))}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}
                    disabled={!day}
                >
                    <CalendarBox
                        day={day || ' '}
                        selected={!!(day && isSelected)}
                    />
                </TouchableOpacity>
            );
            dayIndex++;
            if (dayIndex >= days.length) break;
        }
        calendarGrid.push(<View key={`row-${i}`} style={styles.calendarRow}>{row}</View>);
        if (dayIndex >= days.length) break;
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
            <Text style={styles.monthYearText}>DEZ 2025</Text>
            <TouchableOpacity onPress={showDateMode}>
                <Ionicons name="calendar" size={20} color="#5B5B5B" />
            </TouchableOpacity>
        </View>
        {calendarGrid}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header com Botão Voltar */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                <Text style={[styles.headerText, { marginLeft: 10 }]}>Agendar</Text>
            </TouchableOpacity>
        </View>

        {/* Calendário Visual */}
        <View style={styles.calendarWrapper}>
            {renderCalendar()}
        </View>

        {/* Componentes Invisíveis ou Modais do DateTimePicker */}
        {showDatePicker && (
            <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            // Removi restrições de data mínima/máxima para facilitar testes
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

        {/* Box de Lembrete */}
        <View style={styles.reminderBox}>
            <TouchableOpacity style={styles.datePart} onPress={showDateMode}>
                <Text style={styles.dateText}>
                    {date.getDate().toString().padStart(2, '0')}
                </Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReminder}>
            <Text style={styles.saveButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  // Calendário
  calendarWrapper: {
    marginHorizontal: 20,
    backgroundColor: '#EBEAE5',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  calendarContainer: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B5B5B',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 5,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDaySelected: {
    backgroundColor: '#333',
  },
  calendarText: {
    fontSize: 14,
    color: '#333',
  },
  calendarTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  // Box Lembrete
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
  // Botão
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