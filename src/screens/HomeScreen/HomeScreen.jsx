import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card/Card';
import colors from '../../constants/colors';

const CATEGORIES = ['Todas', 'Massas', 'Carnes', 'Saladas', 'Sopas', 'Sobremesa', 'Outros'];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('Todas');

  const fetchRecipes = async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setRecipes(data ?? []);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [user?.id])
  );

  const filtered =
    selected === 'Todas'
      ? recipes
      : recipes.filter((r) => r.category === selected);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Olá, Chef!</Text>
        <Text style={styles.greetingSub}>
          {recipes.length > 0
            ? `${recipes.length} receita(s) salva(s)`
            : 'Adicione sua primeira receita!'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selected === cat && styles.chipActive]}
            onPress={() => setSelected(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍳</Text>
            <Text style={styles.emptyText}>
              {selected === 'Todas'
                ? 'Nenhuma receita ainda'
                : `Nenhuma receita em "${selected}"`}
            </Text>
            <Text style={styles.emptySubText}>Toque no + para adicionar!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            emoji={item.emoji}
            title={item.title}
            category={item.category}
            time={item.time}
            onPress={() => navigation.navigate('Detail', { recipe: item })}
          />
        )}
      />

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
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  greeting: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  greetingSub: { fontSize: 14, color: colors.textLight, marginTop: 2 },
  filterBar: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  chipTextActive: {
    color: colors.white,
  },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySubText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
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