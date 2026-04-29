// Paleta culinária — base quente e caseira
// Regra 60/30/10: neutros dominam, cores quentes só onde importa

const colors = {
  // ─── Primárias (10% da interface — botões, CTAs, destaques) ───
  primary:       '#ED6E3A',  // Laranja culinário — botões principais
  primaryDark:   '#A4330D',  // Terracota — estado pressionado/hover
  secondary:     '#6C9E4F',  // Verde ervas — categorias, selos frescos

  // ─── Neutros (60% da interface — fundos e superfícies) ───
  background:    '#FFF8F1',  // Creme quente — fundo geral das telas
  surface:       '#DBCDB5',  // Bege claro — cards, modais, inputs
  accent:        '#E9B08E',  // Pêssego — destaques suaves, bordas ativas

  // ─── Textos (30% da interface) ───
  text:          '#5E3C2C',  // Marrom escuro — texto principal
  textLight:     '#7A6255',  // Marrom acinzentado — subtítulos, placeholders

  // ─── Utilitários ───
  danger:        '#C0392B',  // Vermelho — deletar, alertas
  success:       '#6C9E4F',  // Verde — confirmações (reutiliza secondary)
  border:        '#DBCDB5',  // Bege — bordas de inputs e cards
  white:         '#FFFFFF',
  headerText:    '#FFFFFF',  // Texto no header (contraste sobre primary)
};

export default colors;