import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { ChevronLeft, User, Trash2, Cloud, Info, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Confg() {
  const router = useRouter();

  const user = {
    username: 'Usuário Padrão',
    profilePic: 'https://placehold.co/100x100/A0522D/ffffff?text=P',
  };

  const menuItems = [
    { name: 'Editar Perfil', icon: User, action: () => console.log('Navegar para Editar Perfil') },
    { name: 'Lixeira', icon: Trash2, action: () => console.log('Navegar para Lixeira') },
    { name: 'Backup', icon: Cloud, action: () => console.log('Navegar para Backup') },
    { name: 'Sobre', icon: Info, action: () => console.log('Navegar para Sobre') },
  ];

  const MenuItem = ({ name, Icon, action, isDanger = false }) => (
    <TouchableOpacity
      onPress={action}
      style={[styles.menuItem, isDanger && styles.menuDanger]}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Icon size={22} color={isDanger ? '#B00020' : '#333'} />
        <Text style={[styles.menuText, isDanger && styles.menuDangerText]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* PERFIL */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.profilePic }}
            style={styles.profilePic}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>{user.username}</Text>
          </View>
        </View>

        {/* ITENS */}
        {menuItems.map((item, index) => (
          <View key={item.name}>
            <MenuItem name={item.name} Icon={item.icon} action={item.action} />
            {index < menuItems.length - 1 && <View style={styles.separator} />}
          </View>
        ))}

        {/* SEPARADOR */}
        <View style={styles.separatorFull} />

        {/* SAIR */}
        <MenuItem
          name="Sair"
          Icon={LogOut}
          isDanger={true}
          action={() => console.log('Usuário deslogado')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },

  backButton: {
    padding: 6,
    borderRadius: 50,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },

  profilePic: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  menuItem: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  menuText: {
    fontSize: 16,
    color: '#333',
  },

  separator: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginLeft: 62,
  },

  separatorFull: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12,
  },

  menuDanger: {},

  menuDangerText: {
    color: '#B00020',
    fontWeight: '600',
  },
});
