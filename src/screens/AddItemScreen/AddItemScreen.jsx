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

const CATEGORIES = ['Massas', 'Carnes', 'Saladas', 'Sopas', 'Sobremesas', 'Outros'];

const EMOJIS = [
  '🍝', '🍗', '🥗', '🍰', '🍕', '🍲',
  '🥩', '🥘', '🍜', '🥚', '🍞', '🍳',
];

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
    title.trim() && category && time.trim() && description.trim()
  );

  const handleAfterSave = () => {
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
          { text: 'OK', onPress: handleAfterSave },
        ]);
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert({ user_id: user.id, ...payload });

        if (error) throw error;

        Alert.alert('Receita salva!', `${title.trim()} adicionada com sucesso.`, [
          { text: 'OK', onPress: handleAfterSave },
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>
            {isEditing ? '✏️ Editar Receita' : '🍳 Nova Receita'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isEditing
              ? 'Atualize os dados da sua receita'
              : 'Adicione uma nova receita ao seu caderno'}
          </Text>
        </View>

        {/* Seletor de emoji */}
        <View style={styles.section}>
          <Text style={styles.label}>Escolha um ícone</Text>
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
        </View>

        {/* Input: Nome */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Nome da receita <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Frango ao molho pesto"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Categoria <Text style={styles.required}>*</Text>
          </Text>
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
        </View>

        {/* Input: Tempo */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Tempo de preparo <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 30 min"
            placeholderTextColor={colors.textMuted}
            value={time}
            onChangeText={setTime}
            editable={!loading}
          />
        </View>

        {/* Textarea: Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Modo de preparo <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva o passo a passo da receita..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />
        </View>

        {/* Ações */}
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
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 6,
  },

  // Seções
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  required: {
    color: colors.danger,
  },

  // Input
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 140,
    paddingTop: 14,
  },

  // Emoji selector
  emojiBar: {
    gap: 10,
    paddingVertical: 4,
  },
  emojiBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  emojiBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  emojiItem: {
    fontSize: 28,
  },

  // Category chips
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },

  // Ações
  actions: {
    marginTop: 16,
  },
});
