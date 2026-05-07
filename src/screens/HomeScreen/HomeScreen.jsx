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

const CATEGORIES = [
  { id: 'todas', label: 'Todas', emoji: '🍽️' },
  { id: 'massas', label: 'Massas', emoji: '🍝' },
  { id: 'carnes', label: 'Carnes', emoji: '🥩' },
  { id: 'saladas', label: 'Saladas', emoji: '🥗' },
  { id: 'sobremesas', label: 'Sobremesas', emoji: '🍰' },
  { id: 'sopas', label: 'Sopas', emoji: '🍲' },
];

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
        <Text style={styles.loadingText}>Carregando receitas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com saudação */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>{'Olá, Chef! 👨‍🍳'}</Text>
            <Text style={styles.greetingSub}>
              {recipes.length > 0
                ? `${recipes.length} receita${recipes.length > 1 ? 's' : ''} salva${recipes.length > 1 ? 's' : ''}`
                : 'Adicione sua primeira receita!'}
            </Text>
          </View>
          <View style={styles.recipeCount}>
            <Text style={styles.recipeCountNumber}>{recipes.length}</Text>
            <Text style={styles.recipeCountLabel}>receitas</Text>
          </View>
        </View>
      </View>

      {/* Filtros por categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterBar}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.label;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setSelected(cat.label)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de receitas */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        style={styles.flatList}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyEmoji}>{'🍳'}</Text>
            </View>
            <Text style={styles.emptyText}>
              {selected === 'Todas'
                ? 'Nenhuma receita ainda'
                : `Nenhuma receita em "${selected}"`}
            </Text>
            <Text style={styles.emptySubText}>
              Cadastre sua primeira receita e comece a cozinhar!
            </Text>
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

      {/* FAB - Nova receita */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddItem')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  greetingSub: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  recipeCount: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  recipeCountNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  recipeCountLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
    gap: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  chipEmoji: {
    fontSize: 15,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  chipTextActive: {
    color: colors.white,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});