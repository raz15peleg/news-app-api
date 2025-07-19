import { NewsArticle } from '@/types/news';

export const mockArticles: NewsArticle[] = [
  // English articles
  {
    id: '1',
    title: 'Global Climate Summit Reaches Historic Agreement',
    excerpt: 'World leaders unite on ambitious climate targets as scientists warn of accelerating environmental changes worldwide.',
    content: 'In a landmark decision that could reshape global environmental policy, world leaders at the International Climate Summit have reached a historic agreement on carbon reduction targets. The comprehensive deal, negotiated over three intense days, commits 195 countries to achieving net-zero emissions by 2040, five years ahead of previous projections. The agreement includes specific provisions for developing nations, with wealthy countries pledging $500 billion in climate adaptation funding over the next decade. Environmental scientists have praised the deal as a crucial step forward, though many emphasize that implementation will be the real test of its effectiveness.',
    source: 'CNN',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb8ba444?w=800&h=400&fit=crop',
    url: 'https://cnn.com/climate-summit-agreement',
    category: 'Environment',
    language: 'English'
  },
  {
    id: '2',
    title: 'Revolutionary AI Breakthrough in Medical Diagnosis',
    excerpt: 'Scientists develop AI system that can detect early-stage diseases with 99% accuracy, potentially saving millions of lives.',
    content: 'Researchers at leading medical institutions have unveiled an artificial intelligence system capable of detecting early-stage diseases with unprecedented accuracy. The breakthrough technology, developed over five years of intensive research, uses advanced machine learning algorithms to analyze medical imaging data and identify potential health issues before symptoms appear. Clinical trials involving over 100,000 patients showed the system achieved 99.2% accuracy in detecting various cancers, cardiovascular conditions, and neurological disorders. The FDA has fast-tracked the approval process, with the technology expected to be available in major hospitals within the next 18 months.',
    source: 'BBC',
    author: 'Dr. Michael Chen',
    publishedAt: '2024-01-15T14:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    url: 'https://bbc.com/ai-medical-breakthrough',
    category: 'Technology',
    language: 'English'
  },
  {
    id: '3',
    title: 'Space Mission Discovers Signs of Ancient Life on Mars',
    excerpt: 'NASA rover finds compelling evidence of microbial life that existed billions of years ago on the Red Planet.',
    content: 'In a discovery that could rewrite our understanding of life in the universe, NASA\'s Perseverance rover has uncovered what scientists believe to be definitive evidence of ancient microbial life on Mars. The rover\'s sophisticated instruments detected organic compounds and mineral formations in Martian rocks that are consistent with biological processes that occurred approximately 3.5 billion years ago. Dr. Elena Rodriguez, lead scientist on the mission, described the findings as "the most significant discovery in the history of planetary science." The samples will be brought back to Earth in 2028 for further analysis, but preliminary results suggest that Mars once harbored a thriving ecosystem of microorganisms.',
    source: 'CNN',
    author: 'James Peterson',
    publishedAt: '2024-01-15T09:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
    url: 'https://cnn.com/mars-life-discovery',
    category: 'Science',
    language: 'English'
  },
  // Spanish articles
  {
    id: '4',
    title: 'Cumbre Climática Global Alcanza Acuerdo Histórico',
    excerpt: 'Los líderes mundiales se unen en objetivos climáticos ambiciosos mientras los científicos advierten sobre cambios ambientales acelerados.',
    content: 'En una decisión histórica que podría remodelar la política ambiental global, los líderes mundiales en la Cumbre Climática Internacional han alcanzado un acuerdo histórico sobre objetivos de reducción de carbono. El acuerdo integral, negociado durante tres días intensos, compromete a 195 países a lograr emisiones netas cero para 2040, cinco años antes de las proyecciones anteriores.',
    source: 'CNN',
    author: 'María González',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb8ba444?w=800&h=400&fit=crop',
    url: 'https://cnn.com/cumbre-climatica-acuerdo',
    category: 'Ambiente',
    language: 'Spanish'
  },
  {
    id: '5',
    title: 'Avance Revolucionario de IA en Diagnóstico Médico',
    excerpt: 'Los científicos desarrollan un sistema de IA que puede detectar enfermedades en etapa temprana con 99% de precisión.',
    content: 'Investigadores en instituciones médicas líderes han presentado un sistema de inteligencia artificial capaz de detectar enfermedades en etapa temprana con una precisión sin precedentes. La tecnología revolucionaria, desarrollada durante cinco años de investigación intensiva, utiliza algoritmos avanzados de aprendizaje automático para analizar datos de imágenes médicas.',
    source: 'BBC',
    author: 'Dr. Carlos López',
    publishedAt: '2024-01-15T14:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    url: 'https://bbc.com/avance-ia-medico',
    category: 'Tecnología',
    language: 'Spanish'
  },
  // French articles
  {
    id: '6',
    title: 'Sommet Climatique Mondial Atteint un Accord Historique',
    excerpt: 'Les dirigeants mondiaux s\'unissent sur des objectifs climatiques ambitieux alors que les scientifiques avertissent de changements environnementaux accélérés.',
    content: 'Dans une décision historique qui pourrait remodeler la politique environnementale mondiale, les dirigeants mondiaux au Sommet Climatique International ont atteint un accord historique sur les objectifs de réduction du carbone. L\'accord complet, négocié pendant trois jours intenses, engage 195 pays à atteindre zéro émission nette d\'ici 2040.',
    source: 'BBC',
    author: 'Sophie Dubois',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb8ba444?w=800&h=400&fit=crop',
    url: 'https://bbc.com/sommet-climatique-accord',
    category: 'Environnement',
    language: 'French'
  },
  {
    id: '7',
    title: 'Percée Révolutionnaire de l\'IA dans le Diagnostic Médical',
    excerpt: 'Les scientifiques développent un système d\'IA qui peut détecter les maladies à un stade précoce avec 99% de précision.',
    content: 'Des chercheurs d\'institutions médicales de premier plan ont dévoilé un système d\'intelligence artificielle capable de détecter les maladies à un stade précoce avec une précision sans précédent. Cette technologie révolutionnaire, développée au cours de cinq années de recherche intensive, utilise des algorithmes d\'apprentissage automatique avancés.',
    source: 'CNN',
    author: 'Dr. Pierre Martin',
    publishedAt: '2024-01-15T14:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    url: 'https://cnn.com/percee-ia-medicale',
    category: 'Technologie',
    language: 'French'
  },
  // German articles
  {
    id: '8',
    title: 'Globaler Klimagipfel Erreicht Historisches Abkommen',
    excerpt: 'Weltführer vereinen sich bei ehrgeizigen Klimazielen, während Wissenschaftler vor beschleunigten Umweltveränderungen warnen.',
    content: 'In einer wegweisenden Entscheidung, die die globale Umweltpolitik umgestalten könnte, haben die Weltführer beim Internationalen Klimagipfel ein historisches Abkommen über Kohlenstoffreduktionsziele erreicht. Das umfassende Abkommen, das über drei intensive Tage verhandelt wurde, verpflichtet 195 Länder dazu, bis 2040 Netto-Null-Emissionen zu erreichen.',
    source: 'BBC',
    author: 'Dr. Klaus Weber',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb8ba444?w=800&h=400&fit=crop',
    url: 'https://bbc.com/klimagipfel-abkommen',
    category: 'Umwelt',
    language: 'German'
  },
  // Additional English articles
  {
    id: '9',
    title: 'Economic Recovery Accelerates as Global Markets Surge',
    excerpt: 'Stock markets worldwide experience their best performance in decades as economic indicators show robust growth.',
    content: 'Global financial markets are experiencing their strongest rally in over two decades as economic indicators point to sustained recovery and growth. The S&P 500 has gained 15% this quarter alone, while European and Asian markets have posted similarly impressive gains.',
    source: 'BBC',
    author: 'Emma Thompson',
    publishedAt: '2024-01-15T16:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    url: 'https://bbc.com/economic-recovery',
    category: 'Business',
    language: 'English'
  },
  {
    id: '10',
    title: 'Revolutionary Gene Therapy Cures Rare Childhood Disease',
    excerpt: 'Groundbreaking treatment offers hope for thousands of children affected by genetic disorders worldwide.',
    content: 'Medical researchers have achieved a remarkable breakthrough in gene therapy, successfully treating a rare genetic disorder that affects thousands of children worldwide. The innovative treatment uses modified viruses to deliver healthy genes directly to affected cells.',
    source: 'CNN',
    author: 'Dr. Lisa Wang',
    publishedAt: '2024-01-15T11:55:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
    url: 'https://cnn.com/gene-therapy-breakthrough',
    category: 'Health',
    language: 'English'
  },
  {
    id: '11',
    title: 'Historic Peace Agreement Signed in Regional Conflict',
    excerpt: 'After decades of tension, neighboring countries reach comprehensive peace deal with international support.',
    content: 'In a ceremony attended by world leaders and diplomats, two neighboring countries have signed a comprehensive peace agreement, ending decades of territorial disputes and armed conflict.',
    source: 'BBC',
    author: 'Robert Martinez',
    publishedAt: '2024-01-15T13:25:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
    url: 'https://bbc.com/peace-agreement',
    category: 'Politics',
    language: 'English'
  },
  // Additional Spanish articles
  {
    id: '12',
    title: 'Misión Espacial Descubre Signos de Vida Antigua en Marte',
    excerpt: 'El rover de la NASA encuentra evidencia convincente de vida microbiana que existió hace miles de millones de años en el Planeta Rojo.',
    content: 'En un descubrimiento que podría reescribir nuestra comprensión de la vida en el universo, el rover Perseverance de la NASA ha descubierto lo que los científicos creen que es evidencia definitiva de vida microbiana antigua en Marte.',
    source: 'CNN',
    author: 'Diego Fernández',
    publishedAt: '2024-01-15T09:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
    url: 'https://cnn.com/vida-marte-descubrimiento',
    category: 'Ciencia',
    language: 'Spanish'
  },
  {
    id: '13',
    title: 'Recuperación Económica se Acelera con Alza de Mercados Globales',
    excerpt: 'Los mercados bursátiles mundiales experimentan su mejor rendimiento en décadas mientras los indicadores económicos muestran crecimiento robusto.',
    content: 'Los mercados financieros globales están experimentando su rally más fuerte en más de dos décadas mientras los indicadores económicos apuntan a una recuperación y crecimiento sostenidos.',
    source: 'BBC',
    author: 'Ana Rodríguez',
    publishedAt: '2024-01-15T16:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    url: 'https://bbc.com/recuperacion-economica',
    category: 'Negocios',
    language: 'Spanish'
  },
  {
    id: '14',
    title: 'Terapia Génica Revolucionaria Cura Enfermedad Infantil Rara',
    excerpt: 'Tratamiento innovador ofrece esperanza para miles de niños afectados por trastornos genéticos en todo el mundo.',
    content: 'Los investigadores médicos han logrado un avance notable en la terapia génica, tratando con éxito un trastorno genético raro que afecta a miles de niños en todo el mundo.',
    source: 'CNN',
    author: 'Dra. Isabel Morales',
    publishedAt: '2024-01-15T11:55:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
    url: 'https://cnn.com/terapia-genica-avance',
    category: 'Salud',
    language: 'Spanish'
  },
  // Additional French articles
  {
    id: '15',
    title: 'Mission Spatiale Découvre des Signes de Vie Ancienne sur Mars',
    excerpt: 'Le rover de la NASA trouve des preuves convaincantes de vie microbienne qui existait il y a des milliards d\'années sur la Planète Rouge.',
    content: 'Dans une découverte qui pourrait réécrire notre compréhension de la vie dans l\'univers, le rover Perseverance de la NASA a découvert ce que les scientifiques croient être des preuves définitives de vie microbienne ancienne sur Mars.',
    source: 'CNN',
    author: 'Jean-Luc Moreau',
    publishedAt: '2024-01-15T09:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
    url: 'https://cnn.com/vie-mars-decouverte',
    category: 'Science',
    language: 'French'
  },
  {
    id: '16',
    title: 'La Récupération Économique s\'Accélère avec la Montée des Marchés Mondiaux',
    excerpt: 'Les marchés boursiers mondiaux connaissent leur meilleure performance depuis des décennies alors que les indicateurs économiques montrent une croissance robuste.',
    content: 'Les marchés financiers mondiaux connaissent leur plus forte reprise depuis plus de deux décennies alors que les indicateurs économiques pointent vers une récupération et une croissance soutenues.',
    source: 'BBC',
    author: 'Claire Leroy',
    publishedAt: '2024-01-15T16:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    url: 'https://bbc.com/recuperation-economique',
    category: 'Économie',
    language: 'French'
  },
  {
    id: '17',
    title: 'Thérapie Génique Révolutionnaire Guérit une Maladie Infantile Rare',
    excerpt: 'Un traitement révolutionnaire offre de l\'espoir à des milliers d\'enfants affectés par des troubles génétiques dans le monde entier.',
    content: 'Les chercheurs médicaux ont réalisé une percée remarquable en thérapie génique, traitant avec succès un trouble génétique rare qui affecte des milliers d\'enfants dans le monde.',
    source: 'CNN',
    author: 'Dr. Marie Lacroix',
    publishedAt: '2024-01-15T11:55:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
    url: 'https://cnn.com/therapie-genique-percee',
    category: 'Santé',
    language: 'French'
  },
  // Additional German articles
  {
    id: '18',
    title: 'Weltraummission Entdeckt Zeichen Alten Lebens auf dem Mars',
    excerpt: 'NASA-Rover findet überzeugende Beweise für mikrobielles Leben, das vor Milliarden von Jahren auf dem Roten Planeten existierte.',
    content: 'In einer Entdeckung, die unser Verständnis des Lebens im Universum neu schreiben könnte, hat der NASA-Rover Perseverance das entdeckt, was Wissenschaftler für definitive Beweise für altes mikrobielles Leben auf dem Mars halten.',
    source: 'CNN',
    author: 'Dr. Hans Mueller',
    publishedAt: '2024-01-15T09:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
    url: 'https://cnn.com/mars-leben-entdeckung',
    category: 'Wissenschaft',
    language: 'German'
  },
  {
    id: '19',
    title: 'Wirtschaftserholung Beschleunigt sich mit Globalen Marktanstiegen',
    excerpt: 'Aktienmärkte weltweit erleben ihre beste Performance seit Jahrzehnten, während Wirtschaftsindikatoren robustes Wachstum zeigen.',
    content: 'Globale Finanzmärkte erleben ihre stärkste Rallye seit über zwei Jahrzehnten, während Wirtschaftsindikatoren auf nachhaltige Erholung und Wachstum hinweisen.',
    source: 'BBC',
    author: 'Ingrid Schmidt',
    publishedAt: '2024-01-15T16:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    url: 'https://bbc.com/wirtschaftserholung',
    category: 'Wirtschaft',
    language: 'German'
  },
  {
    id: '20',
    title: 'Revolutionäre Gentherapie Heilt Seltene Kinderkrankheit',
    excerpt: 'Bahnbrechende Behandlung bietet Hoffnung für Tausende von Kindern, die weltweit von genetischen Störungen betroffen sind.',
    content: 'Medizinische Forscher haben einen bemerkenswerten Durchbruch in der Gentherapie erzielt und erfolgreich eine seltene genetische Störung behandelt, die Tausende von Kindern weltweit betrifft.',
    source: 'CNN',
    author: 'Dr. Petra Hoffmann',
    publishedAt: '2024-01-15T11:55:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
    url: 'https://cnn.com/gentherapie-durchbruch',
    category: 'Gesundheit',
    language: 'German'
  }
];

export const newsLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
];