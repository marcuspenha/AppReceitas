import { View, Text, TextInput, TouchableOpacity,
         ScrollView, KeyboardAvoidingView,
         Platform, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import colors from '../../constants/colors';

const CATEGORIES = ['Massas', 'Carnes', 'Saladas', 'Sopas', 'Sobremesa', 'Outros'];

export default function AddItemScreen({ navigation }) {
  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState('');
  const [time,        setTime]        = useState('');
  const [description, setDescription] = useState('');

  const isFormValid = title.trim() && category && time.trim() && description.trim();

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }
    // Integração com Supabase vem aqui futuramente
    Alert.alert('✅ Receita salva!', `"${title}" foi adicionada com sucesso.`, [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
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
        <Text style={styles.pageTitle}>Nova Receita 🍳</Text>

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
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}
              >
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

        {/* Descrição */}
        <Text style={styles.label}>Modo de preparo *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o passo a passo da receita..."
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Botões */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Salvar Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonOutlineText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonOutlineText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
});