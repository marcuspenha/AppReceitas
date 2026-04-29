import { View, Text, FlatList, TouchableOpacity,
         StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';

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
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setRecipes(data);
    }
    setLoading(false);
  };

  // Recarrega a lista toda vez que a tela recebe foco
  // Ex: ao voltar do AddItemScreen após salvar
  useFocusEffect(useCallback(() => { fetchRecipes(); }, []));

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
        <Text style={styles.greetingText}>Olá, Chef! 👋</Text>
        <Text style={styles.greetingSub}>
          {recipes.length > 0
            ? `Você tem ${recipes.length} receita(s) salva(s)`
            : 'Adicione sua primeira receita!'}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍳</Text>
            <Text style={styles.emptyText}>Nenhuma receita ainda</Text>
            <Text style={styles.emptySubText}>
              Toque no botão + para adicionar a primeira!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
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
  container:      { flex: 1, backgroundColor: colors.background },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: colors.background },
  greeting:       { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  greetingText:   { fontSize: 24, fontWeight: 'bold', color: colors.text },
  greetingSub:    { fontSize: 14, color: colors.textLight, marginTop: 2 },
  list:           { paddingHorizontal: 16, paddingBottom: 100 },
  card:           { flexDirection: 'row', backgroundColor: colors.white,
                    borderRadius: 14, padding: 16, marginBottom: 12,
                    alignItems: 'center', elevation: 2,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.07, shadowRadius: 6 },
  cardEmoji:      { fontSize: 42, marginRight: 14 },
  cardBody:       { flex: 1 },
  cardTitle:      { fontSize: 16, fontWeight: '700', color: colors.text },
  cardCategory:   { fontSize: 12, color: colors.primary,
                    fontWeight: '600', marginTop: 2 },
  cardTime:       { fontSize: 12, color: colors.textLight, marginTop: 4 },
  empty:          { alignItems: 'center', paddingTop: 80 },
  emptyEmoji:     { fontSize: 56, marginBottom: 16 },
  emptyText:      { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySubText:   { fontSize: 14, color: colors.textLight,
                    marginTop: 8, textAlign: 'center' },
  fab:            { position: 'absolute', bottom: 28, right: 24,
                    backgroundColor: colors.primary,
                    width: 58, height: 58, borderRadius: 29,
                    alignItems: 'center', justifyContent: 'center',
                    elevation: 6, shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.4, shadowRadius: 6 },
  fabIcon:        { fontSize: 28, color: colors.white, lineHeight: 32 },
});