import { View, Text, ScrollView,
         TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function DetailScreen({ route, navigation }) {
  // Recebe o objeto recipe passado pelo HomeScreen
  const { recipe } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.emoji}>{recipe.emoji}</Text>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Badges */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🍽 {recipe.category}</Text>
          </View>
          <View style={[styles.badge, styles.badgeTime]}>
            <Text style={styles.badgeText}>⏱ {recipe.time}</Text>
          </View>
        </View>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Modo de preparo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        <Text style={styles.description}>{recipe.description}</Text>
      </View>

      {/* Ações */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.buttonText}>✏️  Editar Receita</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonOutline}
        activeOpacity={0.85}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonOutlineText}>← Voltar para receitas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 14,
  },
  badges: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeTime: {
    backgroundColor: colors.secondary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
});