import { View, Text, TouchableOpacity,
         ScrollView, StyleSheet, Alert } from 'react-native';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const SETTINGS_ITEMS = [
  { id: '1', icon: '👤', label: 'Meu perfil',         description: 'Nome, foto e e-mail' },
  { id: '2', icon: '🔒', label: 'Alterar senha',       description: 'Segurança da conta' },
  { id: '3', icon: '🌙', label: 'Tema',                description: 'Claro / Escuro' },
  { id: '4', icon: '🔔', label: 'Notificações',        description: 'Preferências de aviso' },
  { id: '5', icon: '🗑️', label: 'Limpar receitas',     description: 'Remove todos os dados locais' },
  { id: '6', icon: '📄', label: 'Termos de uso',       description: 'Política de privacidade' },
];

function SettingItem({ icon, label, description, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.itemIcon}>
        <Text style={styles.itemEmoji}>{icon}</Text>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Text style={styles.itemArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { signOut } = useAuth(); // adicione import no topo

const handleLogout = () => {
  Alert.alert(
    'Sair da conta',
    'Tem certeza que deseja sair?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
      // signOut limpa a sessão → AuthContext atualiza user para null
      // → Navigator redireciona para Login automaticamente
    ]
  );
};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar / perfil resumido */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👨‍🍳</Text>
        </View>
        <Text style={styles.profileName}>Chef do App</Text>
        <Text style={styles.profileEmail}>chef@receitas.com</Text>
      </View>

      {/* Lista de opções */}
      <View style={styles.card}>
        {SETTINGS_ITEMS.map((item, index) => (
          <View key={item.id}>
            <SettingItem
              icon={item.icon}
              label={item.label}
              description={item.description}
              onPress={() => Alert.alert(item.label, 'Em breve disponível!')}
            />
            {index < SETTINGS_ITEMS.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </View>

      {/* Botão de logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutText}>🚪  Sair da conta</Text>
      </TouchableOpacity>

      <Text style={styles.version}>App Receitas v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profile: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemBody: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  itemDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 1,
  },
  itemArrow: {
    fontSize: 22,
    color: colors.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background,
    marginLeft: 68,
  },
  logoutButton: {
    margin: 16,
    marginTop: 20,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#C0392B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#C0392B',
    fontSize: 15,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 32,
  },
});