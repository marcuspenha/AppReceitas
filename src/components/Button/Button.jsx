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
  variant = 'primary',
  loading = false,
  disabled = false,
}) {
  const isDisabled = disabled || loading;

  const getSpinnerColor = () => {
    if (variant === 'primary') return colors.white;
    if (variant === 'danger') return colors.danger;
    return colors.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getSpinnerColor()} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },

  // Variante primary (laranja sólido)
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Variante outline (borda laranja)
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  outlineLabel: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  // Variante danger (vermelho)
  danger: {
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: 'transparent',
  },
  dangerLabel: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },

  disabled: {
    opacity: 0.5,
  },

  label: {
    letterSpacing: 0.3,
  },
});
