# AppReceitas

Aplicativo móvel de gerenciamento de receitas culinárias desenvolvido com React Native e Expo, como projeto final da disciplina de Desenvolvimento para Dispositivos Móveis.

---

## Integrante

| Nome | Responsabilidades |
|------|-------------------|
| Marcus Gutierrez Vieira Penha | Todas as telas (Login, Home, AddItem, Detail, Settings), componentes reutilizáveis (Button, Card), navegação, autenticação e integração com Supabase |

---

## Telas do Aplicativo

### Login

<img width="738" height="1600" alt="WhatsApp Image 2026-05-15 at 10 51 12" src="https://github.com/user-attachments/assets/e253328b-95e3-4ac7-b1ab-63445cb9afd7" />
<!-- Substitua pelo caminho real: ![Login](./screenshots/login.png) -->

---

### Principal (Home)

<!-- Substitua pelo caminho real: ![Home](./screenshots/home.png) -->

---

### Adicionar Receita

<!-- Substitua pelo caminho real: ![Adicionar](./screenshots/add.png) -->

---

### Detalhes da Receita

<!-- Substitua pelo caminho real: ![Detalhes](./screenshots/detail.png) -->

---

### Configurações

<!-- Substitua pelo caminho real: ![Configurações](./screenshots/settings.png) -->

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React Native | 0.81.5 | Framework principal |
| Expo | ~54.0 | Ambiente de desenvolvimento e build |
| React Navigation | ^7.2 | Navegação entre telas (Native Stack) |
| Supabase | ^2.105 | Banco de dados e autenticação |
| expo-secure-store | ~15.0 | Armazenamento seguro do token de sessão |

---

## Componentes React Native Utilizados

| Componente | Aplicação no projeto |
|------------|----------------------|
| `View` | Estrutura de layout em todas as telas |
| `Text` | Títulos, descrições, labels e badges |
| `TextInput` | Campos de e-mail, senha, nome e modo de preparo |
| `TouchableOpacity` | Botões de ação em todas as telas |
| `FlatList` | Listagem de receitas na tela Home |
| `ScrollView` | Rolagem nas telas de adição e detalhes |
| `Image` | Logo na tela de login e ícones na tela de configurações |
| `ActivityIndicator` | Feedback visual de carregamento |
| Flexbox | Layout responsivo em todas as telas |
| React Navigation | Navegação em pilha com 5 telas registradas |

---

## Instalação e Execução

### Pré-requisitos

- Node.js versão 20 ou superior
- Expo Go instalado no dispositivo Android ou iOS (ou emulador configurado)

### Passos

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/meu-app.git
cd meu-app
```

**2. Instale as dependências**

```bash
npm install
```

**3. Inicie o servidor de desenvolvimento**

```bash
npx expo start
```

**4. Abra no dispositivo**

Escaneie o QR code exibido no terminal com o aplicativo Expo Go (Android) ou com a câmera do iPhone (iOS). Para emuladores, pressione `a` (Android) ou `i` (iOS).

---

## Banco de Dados

O projeto utiliza o Supabase como backend. A tabela principal é `recipes`:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | Chave primária gerada automaticamente |
| `user_id` | `uuid` | Referência ao usuário autenticado |
| `title` | `text` | Nome da receita |
| `category` | `text` | Categoria (Massas, Carnes, Saladas, etc.) |
| `time` | `text` | Tempo de preparo |
| `description` | `text` | Modo de preparo |
| `emoji` | `text` | Ícone selecionado para a receita |
| `created_at` | `timestamp` | Data de criação |

---

## Estrutura do Projeto

```
meu-app/
├── assets/                      # Imagens, ícones e logo
├── src/
│   ├── components/
│   │   ├── Button/              # Componente de botão reutilizável (variantes: primary, outline, danger)
│   │   └── Card/                # Card de receita utilizado na FlatList
│   ├── constants/
│   │   └── colors.js            # Paleta de cores do design system
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto global de autenticação
│   ├── navigation/
│   │   └── AppNavigator.jsx     # Configuração de rotas e navegação
│   ├── screens/
│   │   ├── LoginScreen/         # Tela de login e cadastro de conta
│   │   ├── HomeScreen/          # Listagem de receitas com filtro por categoria
│   │   ├── AddItemScreen/       # Criação e edição de receitas
│   │   ├── DetailScreen/        # Visualização detalhada, edição e exclusão
│   │   └── SettingsScreen/      # Configurações do usuário e logout
│   └── services/
│       └── supabase.js          # Configuração do cliente Supabase
├── App.js                       # Ponto de entrada da aplicação
├── index.js                     # Registro do componente raiz
└── package.json
```

---

## Apresentação

Link do vídeo no YouTube: _em breve_
