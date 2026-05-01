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

  if (!safeRecipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Receita não encontrada</Text>
        <Text style={styles.errorText}>
          Não foi possível carregar os detalhes desta receita.
        </Text>
        <View style={styles.errorActions}>
          <Button
            label="Voltar"
            onPress={handleBackToHome}
            variant="outline"
          />
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Processando ação...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.emoji}>{safeRecipe.emoji}</Text>
        <Text style={styles.title}>{safeRecipe.title}</Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🍽 {safeRecipe.category}</Text>
          </View>

          <View style={[styles.badge, styles.badgeTime]}>
            <Text style={styles.badgeText}>⏱ {safeRecipe.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de preparo</Text>
        <Text style={styles.description}>{safeRecipe.description}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="✏️ Editar receita"
          onPress={handleEdit}
          variant="primary"
          disabled={loading}
        />
        <Button
          label="🗑️ Excluir receita"
          onPress={confirmDelete}
          variant="danger"
          disabled={loading}
        />
        <Button
          label="← Voltar"
          onPress={handleBackToHome}
          variant="outline"
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
    paddingHorizontal: 24,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  actions: {
    marginTop: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  errorTitle: {
    fontSize: 20,
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
    marginTop: 24,
  },
});