# AssociaVal - Portal das Associações de Valongo

## Descrição do Projeto

O **AssociaVal** é um portal web desenvolvido para a Associação das Colectividades do Concelho de Valongo (ACCV), com o objetivo de divulgar as atividades das associações locais de forma simples, inclusiva e acessível.

## Características Principais

### Design e Usabilidade
- **Design responsivo** adaptado a computadores, tablets e telemóveis
- **Interface simples e intuitiva** para utilizadores de todas as idades
- **Acessibilidade** com suporte para leitores de ecrã e navegação por teclado
- **Cores contrastantes** para melhor legibilidade

### Funcionalidades

#### Homepage
- Cabeçalho com logo, barra de pesquisa e menu de navegação
- Secção "Associações em Destaque" com 4 cartões informativos
- Secção "Atividades em Destaque" com eventos próximos
- Calendário interativo com datas de atividades futuras
- Rodapé com informações de contacto e links úteis

#### Página de Atividades
- Lista completa de atividades por ordem cronológica
- **Filtros avançados** por:
  - Freguesia (Alfena, Valongo, Ermesinde, Campo, Sobrado)
  - Tipo de atividade (teatro, música, dança, desporto, etc.)
  - Período temporal
- Pesquisa em tempo real
- Informações detalhadas de cada evento

#### Páginas de Associações
- Página individual para cada associação com:
  - Nome e descrição
  - Morada e contactos
  - Lista de atividades dinamizadas
  - Informações adicionais
  - Botão "Próxima Atividade"

#### Página de Documentos
- Magazine ACCV (edições trimestrais)
- Documentos oficiais (estatutos, regulamentos)
- Relatórios e atas
- Formulários para download
- Reportagens sobre eventos
- Sistema de pré-visualização de documentos

#### Página Sobre
- Informação sobre a ACCV
- Missão e valores da organização
- Objetivos do projeto AssociaVal
- Formulário de contacto
- Informações de contacto completas

## Estrutura Técnica

### Tecnologias Utilizadas
- **HTML5** semântico e acessível
- **CSS3** com variáveis personalizadas e Flexbox/Grid
- **JavaScript** vanilla para interatividade
- **SVG** para ícones e logo

### Estrutura de Ficheiros
```
AssociaVal/
├── index.html                 # Homepage
├── css/
│   ├── reset.css             # CSS reset
│   └── style.css             # Estilos principais
├── js/
│   ├── script.js             # JavaScript principal
│   ├── activities.js         # Funcionalidades da página de atividades
│   └── documents.js          # Funcionalidades da página de documentos
├── pages/
│   ├── atividades.html       # Página de atividades
│   ├── documentos.html       # Página de documentos
│   ├── sobre.html            # Página sobre
│   └── associacoes/          # Páginas individuais das associações
│       └── grupo-folclorico-valongo.html
└── images/
    ├── logo-associaval.svg   # Logo do projeto
    ├── gallery/              # Imagens das atividades
    ├── magazine/             # Capas da magazine
    └── reportages/           # Imagens das reportagens
```

## Funcionalidades Implementadas

### Navegação
- [x] Menu de navegação responsivo
- [x] Breadcrumbs nas páginas internas
- [x] Links entre páginas funcionais
- [x] Menu móvel com hamburger

### Pesquisa e Filtros
- [x] Barra de pesquisa global
- [x] Filtros por freguesia na página de atividades
- [x] Filtros por tipo de atividade
- [x] Filtros por período temporal
- [x] Pesquisa em tempo real
- [x] Filtros de documentos por tipo e ano

### Interatividade
- [x] Calendário interativo
- [x] Botões de ação (Participar, Mais Informações)
- [x] Formulário de contacto funcional
- [x] Pré-visualização de documentos
- [x] Animações suaves de entrada

### Responsividade
- [x] Layout adaptativo para desktop (1200px+)
- [x] Layout para tablets (768px - 1024px)
- [x] Layout para telemóveis (até 768px)
- [x] Imagens responsivas
- [x] Tipografia escalável

## Público-Alvo

- **População do concelho** de Valongo
- **Escolas** locais
- **Empresas** da região
- **Autarquia** e entidades públicas
- **Associações** membros da ACCV

## Objetivos Alcançados

1. **Centralização da informação** sobre atividades associativas
2. **Facilidade de acesso** para todos os utilizadores
3. **Promoção da participação** comunitária
4. **Apoio às associações** na divulgação das suas atividades
5. **Preservação da cultura** local

## Instruções de Utilização

### Para Visitantes
1. Aceda à homepage em `index.html`
2. Navegue pelas secções usando o menu superior
3. Use a barra de pesquisa para encontrar atividades específicas
4. Aplique filtros na página de atividades para refinar resultados
5. Consulte o calendário para datas importantes

### Para Administradores
1. Atualize o conteúdo editando os ficheiros HTML
2. Adicione novas atividades na secção correspondente
3. Carregue documentos na pasta `documents/`
4. Atualize imagens na pasta `images/`

## Compatibilidade

### Browsers Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivos
- Computadores desktop
- Tablets (iPad, Android)
- Smartphones (iOS, Android)

## Acessibilidade

- Navegação por teclado completa
- Suporte para leitores de ecrã
- Contraste adequado (WCAG 2.1 AA)
- Texto alternativo em imagens
- Estrutura semântica HTML5
- Labels descritivos em formulários

## Contacto e Suporte

**ACCV - Associação das Colectividades do Concelho de Valongo**
- **E-mail:** geral@accv.pt
- **Telefone:** 224 211 445
- **Morada:** Rua das Associações, 45, 4440-503 Valongo

---

*Desenvolvido em 2024 para a ACCV*

