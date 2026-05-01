import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

/**
 * Card reutilizável para exibir uma receita na lista.
 * Props:
 *   emoji     string  — ícone visual da receita
 *   title     string  — nome da receita
 *   category  string  — categoria
 *   time      string  — tempo de preparo
 *   onPress   func    — ação ao tocar
 */
export default function Card({ emoji, title, category, time, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.time}>⏱ {time}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  emoji:    { fontSize: 42, marginRight: 14 },
  body:     { flex: 1 },
  title:    { fontSize: 16, fontWeight: '700', color: colors.text },
  category: { fontSize: 12, color: colors.primary,
               fontWeight: '600', marginTop: 2 },
  time:     { fontSize: 12, color: colors.textLight, marginTop: 4 },
  arrow:    { fontSize: 22, color: colors.textLight, marginLeft: 8 },
});