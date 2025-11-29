import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, ScrollView, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ConfigScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Função para deslogar
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive", 
        onPress: () => router.replace("/(auth)/login") 
      }
    ]);
  };

  const MenuItem = ({ name, iconName, action, isDanger = false, showArrow = true }: any) => (
    <TouchableOpacity
      onPress={action}
      style={[styles.menuItem, isDanger && styles.menuDanger]}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, isDanger && styles.iconDangerContainer]}>
            <Ionicons name={iconName} size={20} color={isDanger ? '#ef4444' : '#333'} />
        </View>
        <Text style={[styles.menuText, isDanger && styles.menuDangerText]}>{name}</Text>
      </View>
      
      {showArrow && !isDanger && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.profileSection}>
        <View style={styles.imageContainer}>
             <Image 
                source={{ uri: "http://i.pravatar.cc/150" }} 
                style={styles.profileImage} 
             />
             <TouchableOpacity style={styles.editImageBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
             </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Seu Nome</Text>
        <Text style={styles.profileEmail}>email@exemplo.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geral</Text>
        
        <MenuItem 
            name="Editar Perfil" 
            iconName="person-outline" 
            action={() => Alert.alert("Em breve", "Funcionalidade de editar perfil.")} 
        />
        
        {/* CORREÇÃO AQUI: Adicionado 'as any' para evitar erro de rota não encontrada */}
        <MenuItem 
            name="Lixeira" 
            iconName="trash-outline" 
            action={() => router.push('/trash' as any)} 
        />

        <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name="moon-outline" size={20} color="#333" />
                </View>
                <Text style={styles.menuText}>Modo Escuro</Text>
            </View>
            <Switch 
                value={isDark} 
                onValueChange={setIsDark}
                trackColor={{ false: "#ddd", true: "#333" }}
            />
        </View>

        <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications-outline" size={20} color="#333" />
                </View>
                <Text style={styles.menuText}>Notificações</Text>
            </View>
            <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: "#ddd", true: "#333" }}
            />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Segurança</Text>
        <MenuItem 
            name="Alterar Senha" 
            iconName="lock-closed-outline" 
            action={() => {}} 
        />
        <MenuItem 
            name="Privacidade" 
            iconName="shield-checkmark-outline" 
            action={() => {}} 
        />
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
         <MenuItem 
            name="Sair da Conta" 
            iconName="log-out-outline" 
            action={handleLogout} 
            isDanger={true}
            showArrow={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  menuDanger: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  iconDangerContainer: {
    backgroundColor: "#FEE2E2",
  },
  menuDangerText: {
    color: "#EF4444",
    fontWeight: "bold",
  },
});