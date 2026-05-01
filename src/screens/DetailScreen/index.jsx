import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../services/supabase';
import Button from '../../components/Button';
import colors from '../../constants/colors';

export default function DetailScreen({ route, navigation }) {
  const { recipe }          = route.params;
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      '🗑️ Excluir receita',
      `Deseja excluir "${recipe.title}" permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase
              .from('recipes')
              .delete()
              .eq('id', recipe.id);

            setLoading(false);

            if (error) {
              Alert.alert('Erro', error.message);
            } else {
              // Volta para Home — useFocusEffect vai recarregar a lista
              navigation.navigate('Home');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // Passa a receita para o AddItemScreen operar em modo edição
    navigation.navigate('AddItem', { recipe });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🍽 {recipe.category}</Text>
          </View>
          <View style={[styles.badge, styles.badgeTime]}>
            <Text style={styles.badgeText}>⏱ {recipe.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Modo de preparo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        <Text style={styles.description}>{recipe.description}</Text>
      </View>

      {/* Ações — usando componente Button reutilizável */}
      <Button label="✏️  Editar Receita"    onPress={handleEdit}   variant="primary"  />
      <Button label="🗑️  Excluir Receita"   onPress={handleDelete} variant="danger"   />
      <Button label="← Voltar"              onPress={() => navigation.goBack()}
              variant="outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background },
  centered:     { flex: 1, justifyContent: 'center',
                  alignItems: 'center', backgroundColor: colors.background },
  content:      { padding: 24, paddingBottom: 48 },
  hero:         { alignItems: 'center', marginBottom: 24 },
  emoji:        { fontSize: 80, marginBottom: 12 },
  title:        { fontSize: 26, fontWeight: 'bold', color: colors.text,
                  textAlign: 'center', marginBottom: 14 },
  badges:       { flexDirection: 'row', gap: 10 },
  badge:        { backgroundColor: colors.primary,
                  paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeTime:    { backgroundColor: colors.secondary },
  badgeText:    { color: colors.white, fontSize: 13, fontWeight: '600' },
  divider:      { height: 1, backgroundColor: colors.border, marginBottom: 24 },
  section:      { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700',
                  color: colors.text, marginBottom: 12 },
  description:  { fontSize: 15, color: colors.textLight, lineHeight: 24 },
});