import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useMemo, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import colors from '../../constants/colors';

export default function DetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const recipe = route?.params?.recipe ?? null;

  const safeRecipe = useMemo(() => {
    if (!recipe) return null;

    return {
      id: recipe.id ?? null,
      title: recipe.title?.trim() || 'Receita sem título',
      category: recipe.category?.trim() || 'Sem categoria',
      time: recipe.time?.trim() || 'Tempo não informado',
      description: recipe.description?.trim() || 'Descrição não informada.',
      emoji: recipe.emoji?.trim() || '🍽️',
      user_id: recipe.user_id ?? null,
    };
  }, [recipe]);

  const handleBackToHome = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  const handleEdit = () => {
    if (!safeRecipe?.id) {
      Alert.alert('Erro', 'Receita inválida para edição.');
      return;
    }
    navigation.navigate('AddItem', { recipe: safeRecipe });
  };

  const confirmDelete = () => {
    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    if (!safeRecipe?.id) {
      Alert.alert('Erro', 'Receita inválida para exclusão.');
      return;
    }

    Alert.alert(
      'Excluir receita',
      `Deseja excluir "${safeRecipe.title}" permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: handleDelete,
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!user?.id || !safeRecipe?.id || loading) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', safeRecipe.id)
        .eq('user_id', user.id);

      if (error) throw error;

      Alert.alert('Receita excluída', 'A receita foi removida com sucesso.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível excluir a receita.');
    } finally {
      setLoading(false);
    }
  };

  // Estado de erro - receita não encontrada
  if (!safeRecipe) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorEmoji}>{'🍽️'}</Text>
        </View>
        <Text style={styles.errorTitle}>Receita não encontrada</Text>
        <Text style={styles.errorText}>
          Não foi possível carregar os detalhes desta receita.
        </Text>
        <View style={styles.errorActions}>
          <Button label="Voltar" onPress={handleBackToHome} variant="outline" />
        </View>
      </View>
    );
  }

  // Estado de loading
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Processando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{safeRecipe.emoji}</Text>
        </View>
        <Text style={styles.title}>{safeRecipe.title}</Text>

        <View style={styles.badges}>
          <View style={[styles.badge, styles.badgeCategory]}>
            <Text style={styles.badgeText}>{'🍽️'} {safeRecipe.category}</Text>
          </View>
          <View style={[styles.badge, styles.badgeTime]}>
            <Text style={styles.badgeText}>{'⏱️'} {safeRecipe.time}</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{'📝'} Modo de preparo</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>{safeRecipe.description}</Text>
      </View>

      {/* Ações */}
      <View style={styles.actions}>
        <Button
          label="Editar receita"
          onPress={handleEdit}
          variant="outline"
          disabled={loading}
        />
        <Button
          label="Excluir receita"
          onPress={confirmDelete}
          variant="danger"
          disabled={loading}
        />
        <Button
          label="Voltar"
          onPress={handleBackToHome}
          variant="primary"
          disabled={loading}
        />
      </View>
    </ScrollView>
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
    paddingHorizontal: 32,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  badges: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  badgeCategory: {
    backgroundColor: colors.primary,
  },
  badgeTime: {
    backgroundColor: colors.secondary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Card de conteúdo
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 26,
  },

  // Ações
  actions: {
    marginTop: 8,
  },

  // Loading
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },

  // Erro
  errorIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorActions: {
    width: '100%',
    marginTop: 32,
  },
});
