import { View, Text, TextInput, TouchableOpacity, ScrollView,
         KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import colors from '../../constants/colors';

const CATEGORIES = ['Massas', 'Carnes', 'Saladas', 'Sopas', 'Sobremesa', 'Outros'];

const EMOJIS = ['🍝', '🍗', '🥗', '🍰', '🍕', '🍲',
                '🥩', '🥘', '🍜', '🥚', '🍞', '🥗'];

export default function AddItemScreen({ route, navigation }) {
  const { user }              = useAuth();
  const editingRecipe         = route.params?.recipe ?? null; // null = modo criar
  const isEditing             = !!editingRecipe;

  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState('');
  const [time,        setTime]        = useState('');
  const [description, setDescription] = useState('');
  const [emoji,       setEmoji]       = useState('🍽️');
  const [loading,     setLoading]     = useState(false);

  // Pré-preenche os campos quando está em modo edição
  useEffect(() => {
    if (isEditing) {
      setTitle(editingRecipe.title);
      setCategory(editingRecipe.category);
      setTime(editingRecipe.time);
      setDescription(editingRecipe.description);
      setEmoji(editingRecipe.emoji);
    }
  }, []);

  const isFormValid = title.trim() && category && time.trim() && description.trim();

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // UPDATE
        const { error } = await supabase
          .from('recipes')
          .update({ title, category, time, description, emoji })
          .eq('id', editingRecipe.id);

        if (error) throw error;
        Alert.alert('✅ Receita atualizada!', '', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        // INSERT
        const { error } = await supabase
          .from('recipes')
          .insert({ user_id: user.id, title, category, time, description, emoji });

        if (error) throw error;
        Alert.alert('✅ Receita salva!', `"${title}" adicionada com sucesso.`, [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>
          {isEditing ? '✏️ Editar Receita' : '🍳 Nova Receita'}
        </Text>

        {/* Seletor de emoji */}
        <Text style={styles.label}>Ícone da receita</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.emojiBar}>
          {EMOJIS.map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiBtn, emoji === e && styles.emojiBtnActive]}
              onPress={() => setEmoji(e)}
            >
              <Text style={styles.emojiItem}>{e}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nome */}
        <Text style={styles.label}>Nome da receita *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Frango ao molho pesto"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tempo */}
        <Text style={styles.label}>Tempo de preparo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 30 min"
          placeholderTextColor={colors.textLight}
          value={time}
          onChangeText={setTime}
        />

        {/* Modo de preparo */}
        <Text style={styles.label}>Modo de preparo *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o passo a passo..."
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Botões — componente reutilizável */}
        <View style={{ marginTop: 32 }}>
          <Button
            label={isEditing ? 'Salvar alterações' : 'Salvar Receita'}
            onPress={handleSave}
            variant="primary"
            loading={loading}
            disabled={!isFormValid}
          />
          <Button
            label="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: colors.background },
  content:          { padding: 24, paddingBottom: 48 },
  pageTitle:        { fontSize: 24, fontWeight: 'bold',
                      color: colors.text, marginBottom: 24 },
  label:            { fontSize: 13, fontWeight: '700',
                      color: colors.text, marginBottom: 8, marginTop: 16 },
  input:            { backgroundColor: colors.white, borderWidth: 1,
                      borderColor: colors.border, borderRadius: 10,
                      paddingHorizontal: 14, paddingVertical: 12,
                      fontSize: 15, color: colors.text },
  textArea:         { height: 130, paddingTop: 12 },
  emojiBar:         { gap: 8, paddingVertical: 4 },
  emojiBtn:         { width: 48, height: 48, borderRadius: 12,
                      borderWidth: 2, borderColor: colors.border,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: colors.white },
  emojiBtnActive:   { borderColor: colors.primary,
                      backgroundColor: colors.background },
  emojiItem:        { fontSize: 26 },
  categoryGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:             { borderWidth: 1.5, borderColor: colors.border,
                      borderRadius: 20, paddingHorizontal: 16,
                      paddingVertical: 8, backgroundColor: colors.white },
  chipActive:       { backgroundColor: colors.primary,
                      borderColor: colors.primary },
  chipText:         { fontSize: 13, color: colors.textLight, fontWeight: '600' },
  chipTextActive:   { color: colors.white },
});