import { View, Text, FlatList, TouchableOpacity,
         StyleSheet, StatusBar } from 'react-native';
import colors from '../../constants/colors';

// Dados mockados — substituídos pelo Supabase depois
const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Macarrão ao Sugo',
    category: 'Massas',
    time: '30 min',
    emoji: '🍝',
    description: 'Cozinhe o macarrão al dente. Refogue alho no azeite, adicione tomate pelado e deixe reduzir por 15 min. Tempere com sal, pimenta e manjericão fresco. Misture ao macarrão e sirva com parmesão.',
  },
  {
    id: '2',
    title: 'Frango Grelhado',
    category: 'Carnes',
    time: '25 min',
    emoji: '🍗',
    description: 'Marine o frango com limão, alho, sal e páprica por 20 min. Grelhe em frigideira quente por 6 min de cada lado até dourar. Sirva com legumes assados ou salada verde.',
  },
  {
    id: '3',
    title: 'Salada Caesar',
    category: 'Saladas',
    time: '10 min',
    emoji: '🥗',
    description: 'Misture alface romana, croutons e lascas de parmesão. Prepare o molho com maionese, mostarda, limão e alho. Regue sobre a salada e sirva gelada.',
  },
  {
    id: '4',
    title: 'Bolo de Chocolate',
    category: 'Sobremesa',
    time: '50 min',
    emoji: '🍰',
    description: 'Misture farinha, cacau, açúcar, ovos, leite e manteiga. Asse em forma untada a 180°C por 35 min. Cubra com ganache de chocolate meio amargo e nata quente.',
  },
  {
    id: '5',
    title: 'Pizza Margherita',
    category: 'Massas',
    time: '45 min',
    emoji: '🍕',
    description: 'Prepare a massa com farinha, fermento, sal e água morna. Deixe crescer 30 min. Abra, espalhe molho de tomate, mozarela fatiada e manjericão. Asse a 220°C por 15 min.',
  },
  {
    id: '6',
    title: 'Sopa de Legumes',
    category: 'Sopas',
    time: '35 min',
    emoji: '🍲',
    description: 'Refogue cebola e alho. Adicione cenoura, batata, abobrinha e caldo de legumes. Cozinhe por 20 min. Bata metade da sopa para engrossar. Tempere e sirva com torradas.',
  },
];

function RecipeCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.cardEmoji}>{item.emoji}</Text>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTime}>⏱ {item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Saudação */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Olá, Chef! 👋</Text>
        <Text style={styles.greetingSub}>O que vamos cozinhar hoje?</Text>
      </View>

      {/* Lista de receitas */}
      <FlatList
        data={MOCK_RECIPES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
            onPress={() => navigation.navigate('Detail', { recipe: item })}
          />
        )}
      />

      {/* FAB — botão flutuante para nova receita */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddItem')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greeting: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  greetingSub: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
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
  cardEmoji: {
    fontSize: 42,
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  cardTime: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    backgroundColor: colors.primary,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.white,
    lineHeight: 32,
  },
});