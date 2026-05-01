import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import colors from '../../constants/colors';

const CATEGORIES = ['Massas', 'Carnes', 'Saladas', 'Sopas', 'Sobremesa', 'Outros'];
const EMOJIS = ['🍝', '🍗', '🥗', '🍰', '🍕', '🍲', '🥩', '🥘', '🍜', '🥚', '🍞'];

export default function AddItemScreen({ route, navigation }) {
  const { user } = useAuth();
  const editingRecipe = route?.params?.recipe ?? null;
  const isEditing = !!editingRecipe;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && editingRecipe) {
      setTitle(editingRecipe.title ?? '');
      setCategory(editingRecipe.category ?? '');
      setTime(editingRecipe.time ?? '');
      setDescription(editingRecipe.description ?? '');
      setEmoji(editingRecipe.emoji ?? '🍽️');
      return;
    }

    setTitle('');
    setCategory('');
    setTime('');
    setDescription('');
    setEmoji('🍽️');
  }, [isEditing, editingRecipe]);

  const isFormValid = Boolean(
    title.trim() &&
      category &&
      time.trim() &&
      description.trim()
  );

  const handleAfterSave = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Home');
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    if (!isFormValid) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    if (isEditing && !editingRecipe?.id) {
      Alert.alert('Erro', 'Receita inválida para edição.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        category,
        time: time.trim(),
        description: description.trim(),
        emoji,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('recipes')
          .update(payload)
          .eq('id', editingRecipe.id)
          .eq('user_id', user.id);

        if (error) throw error;

        Alert.alert('Receita atualizada!', 'As alterações foram salvas com sucesso.', [
          {
            text: 'OK',
            onPress: handleAfterSave,
          },
        ]);
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            ...payload,
          });

        if (error) throw error;

        Alert.alert('Receita salva!', `${title.trim()} adicionada com sucesso.`, [
          {
            text: 'OK',
            onPress: handleAfterSave,
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', error?.message ?? 'Ocorreu um erro ao salvar a receita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
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

        <Text style={styles.label}>Ícone da receita</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.emojiBar}
        >
          {EMOJIS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.emojiBtn, emoji === item && styles.emojiBtnActive]}
              onPress={() => setEmoji(item)}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.emojiItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Nome da receita *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Frango ao molho pesto"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Tempo de preparo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 30 min"
          placeholderTextColor={colors.textLight}
          value={time}
          onChangeText={setTime}
          editable={!loading}
        />

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
          editable={!loading}
        />

        <View style={styles.actions}>
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
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    height: 130,
    paddingTop: 12,
  },
  emojiBar: {
    gap: 8,
    paddingVertical: 4,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  emojiBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  emojiItem: {
    fontSize: 26,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  actions: {
    marginTop: 32,
  },
});