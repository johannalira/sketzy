import { Redirect } from 'expo-router';

export default function Index() {
  // Se o usuário NÃO estiver logado:
  return <Redirect href="/(auth)/login" />;

  // Se o usuário ESTIVER logado (futuramente você põe a lógica real aqui):
  // return <Redirect href="/(tabs)/home" />;
}