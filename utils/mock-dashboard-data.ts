/** Dados estáticos apenas para mockup visual da Home — prontos para troca por API. */

export interface ShowcaseTicker {
  id: string;
  symbol: string;
  name: string;
  price: string;
  changePct: number;
  highlight?: string;
}

export interface RankedItem {
  symbol: string;
  name: string;
  metric: string;
  detail: string;
  /** Logo do ativo (URL). Cripto: CoinGecko; empresas: Clearbit — mock visual. */
  avatarUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  features: string[];
  emphasized?: boolean;
}

/** Categorias da vitrine “Todos os ativos” (mock — ícones no componente). */
export interface AssetCategoryCard {
  id: string;
  label: string;
  subtitle: string;
}

export type FeaturedNewsCategory =
  | "internacional"
  | "mercado"
  | "acoes"
  | "fii"
  | "cripto"
  | "economia";

export interface FeaturedNewsItem {
  id: string;
  imageUrl: string;
  category: FeaturedNewsCategory;
  title: string;
  excerpt: string;
  source: string;
  timeLabel: string;
}

export interface MostReadNewsItem {
  id: string;
  title: string;
  readsLabel: string;
  imageUrl: string;
}

export const FEATURED_NEWS_CATEGORY_LABELS: Record<FeaturedNewsCategory, string> = {
  internacional: "Internacional",
  mercado: "Mercado",
  acoes: "Ações",
  fii: "FIIs",
  cripto: "Cripto",
  economia: "Economia",
};

export const NAV_TOOL_LABELS = [
  { id: "calc", label: "Calculadora" },
  { id: "indices", label: "Índices" },
  { id: "sim", label: "Simulador" },
] as const;

export const SHOWCASE_TICKERS: ShowcaseTicker[] = [
  { id: "1", symbol: "PETR4", name: "Petrobras PN", price: "R$ 38,42", changePct: 1.82, highlight: "Alta do dia" },
  { id: "2", symbol: "VALE3", name: "Vale ON", price: "R$ 62,10", changePct: -0.45 },
  { id: "3", symbol: "ITUB4", name: "Itaú Unibanco", price: "R$ 36,88", changePct: 0.92 },
  { id: "4", symbol: "WEGE3", name: "WEG ON", price: "R$ 42,15", changePct: 2.31, highlight: "Destaque" },
  { id: "5", symbol: "BBDC4", name: "Bradesco PN", price: "R$ 15,22", changePct: -0.18 },
  { id: "6", symbol: "HAPV3", name: "Hapvida", price: "R$ 18,05", changePct: 3.12 },
];

export type RankingAssetClass = "fiis" | "acoes" | "etf" | "cripto";

export interface MarketTopicRankingsBundle {
  dividendYield: RankedItem[];
  marketCap: RankedItem[];
  revenue: RankedItem[];
}

export const RANKING_ASSET_CLASSES: RankingAssetClass[] = ["fiis", "acoes", "etf", "cripto"];

export const RANKING_ASSET_LABELS: Record<RankingAssetClass, string> = {
  fiis: "FIIs",
  acoes: "Ações",
  etf: "ETFs",
  cripto: "Cripto",
};

/** Rankings por classe de ativo — 3 tópicos (DY, valor de mercado, receitas). Mock. */
export const MARKET_TOPIC_RANKINGS: Record<RankingAssetClass, MarketTopicRankingsBundle> = {
  fiis: {
    dividendYield: [
      { symbol: "KNCR11", name: "Kinea Rendimentos", metric: "9,8% a.a.", detail: "DY estimado · papel" },
      { symbol: "HGLG11", name: "CSHG Logística", metric: "8,9% a.a.", detail: "DY 12m · tijolo" },
      { symbol: "XPML11", name: "XP Malls", metric: "8,1% a.a.", detail: "Shopping · IFIX" },
      { symbol: "VISC11", name: "Vinci Shopping", metric: "7,9% a.a.", detail: "Vacância 4,2%" },
    ],
    marketCap: [
      { symbol: "HGLG11", name: "CSHG Logística", metric: "R$ 14,2 bi", detail: "Valor de mercado" },
      { symbol: "XPML11", name: "XP Malls", metric: "R$ 11,8 bi", detail: "Valor de mercado" },
      { symbol: "XPLG11", name: "XP Log", metric: "R$ 9,4 bi", detail: "Valor de mercado" },
      { symbol: "KNCR11", name: "Kinea Rendimentos", metric: "R$ 8,1 bi", detail: "Valor de mercado" },
    ],
    revenue: [
      { symbol: "XPML11", name: "XP Malls", metric: "R$ 1,82 bi", detail: "Receita 12m (mock)" },
      { symbol: "VISC11", name: "Vinci Shopping", metric: "R$ 1,54 bi", detail: "Receita 12m (mock)" },
      { symbol: "HGLG11", name: "CSHG Logística", metric: "R$ 980 mi", detail: "Receita 12m (mock)" },
      { symbol: "XPLG11", name: "XP Log", metric: "R$ 910 mi", detail: "Receita 12m (mock)" },
    ],
  },
  acoes: {
    dividendYield: [
      { symbol: "PETR4", name: "Petrobras PN", metric: "14,2% a.a.", detail: "DY proventos 12m" },
      { symbol: "VALE3", name: "Vale ON", metric: "8,4% a.a.", detail: "DY histórico" },
      { symbol: "ITUB4", name: "Itaú Unibanco", metric: "7,1% a.a.", detail: "Pagamento trimestral" },
      { symbol: "BBAS3", name: "Banco do Brasil", metric: "9,5% a.a.", detail: "DY política de dividendos" },
    ],
    marketCap: [
      { symbol: "PETR4", name: "Petrobras PN", metric: "R$ 502 bi", detail: "Valor de mercado" },
      { symbol: "VALE3", name: "Vale ON", metric: "R$ 278 bi", detail: "Valor de mercado" },
      { symbol: "ITUB4", name: "Itaú Unibanco", metric: "R$ 168 bi", detail: "Valor de mercado" },
      { symbol: "BBDC4", name: "Bradesco PN", metric: "R$ 142 bi", detail: "Valor de mercado" },
    ],
    revenue: [
      { symbol: "PETR4", name: "Petrobras PN", metric: "R$ 638 bi", detail: "Receita 12m (mock)" },
      { symbol: "VALE3", name: "Vale ON", metric: "R$ 210 bi", detail: "Receita 12m (mock)" },
      { symbol: "ABEV3", name: "Ambev", metric: "R$ 98 bi", detail: "Receita 12m (mock)" },
      { symbol: "MGLU3", name: "Magazine Luiza", metric: "R$ 31 bi", detail: "Receita 12m (mock)" },
    ],
  },
  etf: {
    dividendYield: [
      { symbol: "BOVA11", name: "iShares Ibovespa", metric: "2,8% a.a.", detail: "Proventos subjacentes" },
      { symbol: "DIVO11", name: "Smart Dividendos", metric: "6,2% a.a.", detail: "Estratégia DY" },
      { symbol: "SMAL11", name: "Small Caps", metric: "1,9% a.a.", detail: "Ibovespa small" },
      { symbol: "IVVB11", name: "S&P 500", metric: "1,2% a.a.", detail: "USD · distribuição" },
    ],
    marketCap: [
      { symbol: "BOVA11", name: "iShares Ibovespa", metric: "R$ 18,4 bi", detail: "PL do fundo" },
      { symbol: "IVVB11", name: "S&P 500", metric: "R$ 12,1 bi", detail: "PL do fundo" },
      { symbol: "SMAL11", name: "Small Caps", metric: "R$ 4,8 bi", detail: "PL do fundo" },
      {
        symbol: "HASH11",
        name: "Criptoativos",
        metric: "R$ 2,2 bi",
        detail: "PL do fundo",
        avatarUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      },
    ],
    revenue: [
      { symbol: "BOVA11", name: "iShares Ibovespa", metric: "R$ 420 mi", detail: "Taxa admin. estimada (mock)" },
      { symbol: "IVVB11", name: "S&P 500", metric: "R$ 310 mi", detail: "Taxa admin. estimada (mock)" },
      { symbol: "SMAL11", name: "Small Caps", metric: "R$ 95 mi", detail: "Taxa admin. estimada (mock)" },
      { symbol: "DIVO11", name: "Smart Dividendos", metric: "R$ 72 mi", detail: "Taxa admin. estimada (mock)" },
    ],
  },
  cripto: {
    dividendYield: [
      {
        symbol: "ETH",
        name: "Ethereum",
        metric: "3,8% a.a.",
        detail: "Staking · referência (mock)",
        avatarUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      },
      {
        symbol: "SOL",
        name: "Solana",
        metric: "6,1% a.a.",
        detail: "Delegação (mock)",
        avatarUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      },
      {
        symbol: "ADA",
        name: "Cardano",
        metric: "4,2% a.a.",
        detail: "Staking (mock)",
        avatarUrl: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
      },
      {
        symbol: "ATOM",
        name: "Cosmos",
        metric: "12,4% a.a.",
        detail: "Rede · mock",
        avatarUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
      },
    ],
    marketCap: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        metric: "US$ 1,92 tri",
        detail: "Valor de mercado global",
        avatarUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        metric: "US$ 420 bi",
        detail: "Valor de mercado",
        avatarUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      },
      {
        symbol: "BNB",
        name: "BNB",
        metric: "US$ 98 bi",
        detail: "Valor de mercado",
        avatarUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      },
      {
        symbol: "SOL",
        name: "Solana",
        metric: "US$ 82 bi",
        detail: "Valor de mercado",
        avatarUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      },
    ],
    revenue: [
      {
        symbol: "COIN",
        name: "Coinbase",
        metric: "US$ 5,6 bi",
        detail: "Receita 12m (mock)",
        avatarUrl: "https://logo.clearbit.com/coinbase.com",
      },
      {
        symbol: "MSTR",
        name: "MicroStrategy",
        metric: "US$ 2,1 bi",
        detail: "Receita 12m (mock)",
        avatarUrl: "https://logo.clearbit.com/microstrategy.com",
      },
      {
        symbol: "RIOT",
        name: "Riot Platforms",
        metric: "US$ 410 mi",
        detail: "Receita 12m (mock)",
        avatarUrl: "https://logo.clearbit.com/riotplatforms.com",
      },
      {
        symbol: "MARA",
        name: "MARA",
        metric: "US$ 380 mi",
        detail: "Receita 12m (mock)",
        avatarUrl: "https://logo.clearbit.com/mara.com",
      },
    ],
  },
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "start",
    name: "Essencial",
    priceLabel: "Grátis",
    description: "Acompanhe o mercado com dados básicos e alertas limitados.",
    features: ["Cotações com delay", "1 lista personalizada", "News resumidas"],
  },
  {
    id: "pro",
    name: "Investidor",
    priceLabel: "R$ 49,90/mês",
    description: "Ferramentas completas para decisões com mais contexto.",
    features: ["Cotações em tempo real", "Calculadora e simulador", "Relatórios Top rankings", "Suporte prioritário"],
    emphasized: true,
  },
  {
    id: "max",
    name: "Profissional",
    priceLabel: "R$ 129/mês",
    description: "Para quem precisa de profundidade e API futura.",
    features: ["Tudo do Investidor", "Exportação de dados", "Alertas ilimitados", "Onboarding dedicado"],
  },
];

export const ASSET_CATEGORY_CARDS: AssetCategoryCard[] = [
  { id: "acoes", label: "Ações", subtitle: "Empresas na B3 e mercado de capitais local" },
  { id: "fiis", label: "Fundos Imobiliários", subtitle: "FIIs negociados em bolsa" },
  { id: "stocks", label: "Stocks", subtitle: "Ações em bolsas internacionais" },
  { id: "bdrs", label: "BDRs", subtitle: "Recibos de ações estrangeiras em reais" },
  { id: "etfs-int", label: "ETFs Internacionais", subtitle: "Exposição a índices e temas globais" },
  { id: "reits", label: "REITs", subtitle: "Trusts imobiliários no exterior" },
  { id: "etfs", label: "ETFs", subtitle: "Fundos de índice negociados em bolsa" },
  { id: "fundos-invest", label: "Fundos de Investimentos", subtitle: "Multimercado, RF, ações e cambial" },
  { id: "renda-fixa", label: "Renda Fixa", subtitle: "CDB, LC, debêntures, CRA, CRI" },
  { id: "tesouro-direto", label: "Tesouro Direto", subtitle: "Títulos públicos federais" },
  { id: "fiagros", label: "Fiagros", subtitle: "Fundos imobiliários do agronegócio" },
  { id: "cripto", label: "Criptomoedas", subtitle: "Ativos digitais e tokens" },
  { id: "indices", label: "Índices", subtitle: "Ibovespa, IFIX, S&P 500 e benchmarks" },
  { id: "moedas", label: "Moedas", subtitle: "Câmbio e principais pares" },
  { id: "startups", label: "Start-ups", subtitle: "Venture capital e equity privado" },
];

export const FEATURED_NEWS: FeaturedNewsItem[] = [
  {
    id: "fn1",
    category: "internacional",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=720&q=80",
    title: "Fed sinaliza cortes graduais e mercados globais ajustam expectativa para juros",
    excerpt:
      "Chair reforça dependência de dados; dólar e Treasuries reagem com volatilidade moderada na abertura dos mercados asiáticos.",
    source: "Bloomberg",
    timeLabel: "há 18 min",
  },
  {
    id: "fn2",
    category: "mercado",
    imageUrl: "https://picsum.photos/seed/gaius-fn2/800/520",
    title: "Ibovespa futuro amplia ganhos com fluxo misto e commodities no radar",
    excerpt:
      "Investidores digerem balanços locais e o cenário externo; volume financeiro permanece concentrado em blue chips e financeiras.",
    source: "Gaius Markets",
    timeLabel: "há 42 min",
  },
  {
    id: "fn3",
    category: "acoes",
    imageUrl: "https://picsum.photos/seed/gaius-fn3/800/520",
    title: "Varejo e energia lideram pregão após revisão de metas e guidance positivo",
    excerpt:
      "Mesas apontam rotação tática para setores com valuation mais atrativo após resultado do 4º trimestre.",
    source: "InvestNews",
    timeLabel: "há 1 h",
  },
  {
    id: "fn4",
    category: "fii",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80",
    title: "FIIs logísticos ganham destaque com spreads acima da média histórica",
    excerpt:
      "Relatórios destacam ocupação estável e repactuação de aluguéis; IFIX acompanha fluxo positivo em papéis de tijolo.",
    source: "Gaius Research",
    timeLabel: "há 2 h",
  },
  {
    id: "fn5",
    category: "cripto",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=720&q=80",
    title: "Bitcoin consolida faixa após leilão de ETFs e leitura de liquidez on-chain",
    excerpt:
      "Analistas monitoram suportes de curto prazo e correlação com índices de risco; stablecoins com volume elevado.",
    source: "CryptoDesk",
    timeLabel: "há 3 h",
  },
  {
    id: "fn6",
    category: "economia",
    imageUrl:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=720&q=80",
    title: "Focus mantém trajetória de Selic e IPCA no horizonte de 12 meses",
    excerpt:
      "Expectativas de mercado para inflação e PIB seguem estáveis na última rodada; Copom permanece no foco dos economistas.",
    source: "BC & Mercado",
    timeLabel: "há 4 h",
  },
];

export const MOST_READ_NEWS: MostReadNewsItem[] = [
  {
    id: "mr1",
    title: "Dividendos: calendário de proventos da semana na B3",
    readsLabel: "18,2 mil leituras",
    imageUrl: "https://picsum.photos/seed/gaius-mr1/168/168",
  },
  {
    id: "mr2",
    title: "O que esperar do Copom e do câmbio no curto prazo",
    readsLabel: "14,9 mil leituras",
    imageUrl: "https://picsum.photos/seed/gaius-mr2/168/168",
  },
  {
    id: "mr3",
    title: "Small caps: lista de papéis com maior giro no mês",
    readsLabel: "11,4 mil leituras",
    imageUrl: "https://picsum.photos/seed/gaius-mr3/168/168",
  },
  {
    id: "mr4",
    title: "Tesouro IPCA+ x prefixado: leitores escolhem favorito",
    readsLabel: "9,8 mil leituras",
    imageUrl: "https://picsum.photos/seed/gaius-mr4/168/168",
  },
  {
    id: "mr5",
    title: "Guia rápido: como ler o relatório gerencial de FIIs",
    readsLabel: "8,1 mil leituras",
    imageUrl: "https://picsum.photos/seed/gaius-mr5/168/168",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Institucional",
    links: ["Sobre a Gaius", "Carreiras", "Compliance", "Política de privacidade"],
  },
  {
    title: "Produto",
    links: ["Preços", "Ferramentas", "Central de ajuda", "Status"],
  },
  {
    title: "Contato",
    links: ["contato@gaius.com.br", "+55 (11) 3000-0000", "São Paulo, SP"],
  },
] as const;

export const SOCIAL_LABELS = ["LinkedIn", "Instagram", "YouTube"] as const;
