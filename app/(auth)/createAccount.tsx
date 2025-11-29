import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
// Importamos as fontes aqui também para garantir
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { router } from "expo-router";

export default function CreateAccountScreen() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  if (!fontsLoaded) return null;

  const handleCreateAccount = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos!");
    } else if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
    } else {
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      // CORREÇÃO: Volta para a tela de login usando 'back' ou o caminho correto
      router.back(); 
    }
  };

  return (
    <View style={styles.container}>
      {/* CORREÇÃO DO ERRO DA IMAGEM:
          1. Usamos ../../ para voltar duas pastas (auth -> app -> raiz).
          2. Verifique se o nome do seu arquivo é mesmo .png.png ou apenas .png
          Se der erro de novo, tente apagar um ".png" do final.
      */}
      <Image
        source={require("../../assets/scrib/logosemnada.png.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="rgba(48, 48, 48, 0.78)"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

       <Text style={[styles.smallText, { marginTop: 15 }]}>
         Já tem uma conta?{" "}
       {/* CORREÇÃO DO LINK: Volta para o login */}
       <Text style={styles.linkText} onPress={() => router.back()}>
            Faça login
          </Text>
       </Text>

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
    marginBottom: 30, 
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(122, 111, 155, 0.44)",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    width: "100%",
    backgroundColor: "rgba(48, 48, 48, 1)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
   linkText: {
     color: "rgba(122, 111, 155, 1)",
     textDecorationLine: "underline",
     fontFamily: "Poppins_400Regular",
  },
  smallText: {
    color: "rgba(48, 48, 48, 1)",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
});