import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

/**
 * Botão reutilizável com 3 variantes: primary | outline | danger
 * Props:
 *   label    string   — texto do botão
 *   onPress  func     — ação ao tocar
 *   variant  string   — 'primary' | 'outline' | 'danger'  (default: primary)
 *   loading  bool     — exibe spinner e desabilita
 *   disabled bool     — desabilita sem spinner
 */
export default function Button({
  label,
  onPress,
  variant  = 'primary',
  loading  = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
        : <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  // Variante primary
  primary:      { backgroundColor: colors.primary },
  primaryLabel: { color: colors.white, fontSize: 15, fontWeight: 'bold' },

  // Variante outline
  outline:      { borderWidth: 1.5, borderColor: colors.border,
                  backgroundColor: 'transparent' },
  outlineLabel: { color: colors.textLight, fontSize: 14, fontWeight: '600' },

  // Variante danger
  danger:       { borderWidth: 1.5, borderColor: colors.danger,
                  backgroundColor: 'transparent' },
  dangerLabel:  { color: colors.danger, fontSize: 15, fontWeight: '700' },

  disabled: { opacity: 0.4 },

  label: { letterSpacing: 0.2 },
});