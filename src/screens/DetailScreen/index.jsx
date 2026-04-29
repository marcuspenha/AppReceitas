import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function DetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Receita</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, color: colors.text },
});