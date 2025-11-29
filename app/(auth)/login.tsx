import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
// Importamos as fontes para evitar erro de carregamento e garantir o estilo visual
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

export default function LoginScreen() {
  // 1. Carregamento das fontes (Essencial para não travar o app)
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // CORREÇÃO: Em vez de retornar null (tela branca), mostramos um ícone de carregando
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#303030" />
      </View>
    );
  }

  const handleLogin = () => {
    // Validação simples para teste
    if (email === "teste@email.com" && senha === "1234") {
      // CORREÇÃO: Usa 'replace' para o usuário não voltar para o login ao clicar em voltar
      // Redireciona para o grupo de abas (onde está sua Home)
      router.replace("/(tabs)"); 
    } else {
      Alert.alert("Erro", "Email ou senha incorretos!");
    }
  };

  const handleCreateAccount = () => {
    // CORREÇÃO: Aponta para o caminho correto dentro da pasta (auth)
    router.push("/(auth)/createAccount"); 
  };

  const handleGuest = () => {
    // Entrar como convidado redireciona para a Home
    router.replace("/(tabs)"); 
  };

  return (
    <View style={styles.container}>
      {/* CORREÇÃO DO CAMINHO DA IMAGEM: 
        Como o arquivo está em app/(auth)/login.tsx, precisamos subir 
        dois níveis (../../) para chegar na pasta assets na raiz.
      */}
      <Image
        source={require("../../assets/scrib/logosemnada.png.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.smallText}>
        Não tem conta?{" "}
       <Text style={styles.linkText} onPress={handleCreateAccount}>
        Crie aqui
       </Text>
      </Text>

      <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
        <Text style={styles.guestText}>Entrar sem login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(233, 234, 219, 1)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(122, 111, 155, 0.53)",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dfd9e4ff",
    fontFamily: "Poppins_400Regular",
  },
  buttonLogin: {
    width: "100%",
    backgroundColor: "rgba(48, 48, 48, 1)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fdfdfdff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold", 
  },
  linkText: {
    color: "rgba(122, 111, 155, 1)",
    fontFamily: "Poppins_600SemiBold",
    textDecorationLine: "underline",
  },
  smallText: {
    color: "rgba(48, 48, 48, 1)",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  guestButton: {
    position: "absolute",
    bottom: 40,
    left: 25,
  },
  guestText: {
    color: "#3b3232ff",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Poppins_400Regular",
  },
});