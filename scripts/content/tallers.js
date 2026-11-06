/**
 * CONTINGUT DELS TALLERS — font única de dades per a les fitxes
 * (tallers/*.html), les landings i els blocs de "tallers relacionats".
 *
 * Després de canviar qualsevol text d'aquest fitxer, regenera les pàgines:
 *   node scripts/build-pages.js
 *
 * Criteris:
 * - Destinataris, durada i modalitat: dades originals de la Griselda
 *   (document "WEB Griselda.pdf"). No s'han de canviar sense confirmar-ho.
 * - `consisteix`: descripció original de cada taller (la de la web anterior).
 * - `intro`, `topics`, `objective`: proposta de la fase 1 SEO.
 * - `method` i `faqs`: redacció proposada, pendent de validar amb la
 *   Griselda (vegeu PENDENTS.md).
 */

const tallers = [
  // =========================================================================
  // TALLERS PER A FAMÍLIES
  // =========================================================================
  {
    slug: 'caixa-eines-adolescencia-mode-on',
    group: 'families',
    name: "Caixa d'eines: Adolescència Mode ON",
    formName: "Caixa d'eines: Adolescència Mode ON",
    eyebrow: 'Taller per a famílies',
    seoTitle: 'Taller sobre adolescència per a famílies | Griselda',
    description:
      "Taller per a famílies amb fills adolescents. Comprèn els canvis d'aquesta etapa i descobreix recursos per acompanyar-la amb confiança.",
    subtitle: "Un taller per comprendre l'adolescència i acompanyar els fills i filles.",
    image: 'caixa-eines.webp',
    imageAlt:
      "Il·lustració d'una caixa d'eines oberta amb un cor, una bombeta, una brúixola i una bafarada de diàleg",
    cardSummary:
      "Un espai per entendre millor què viuen els fills i filles a l'adolescència i acompanyar-los amb més calma.",
    introTitle: "Comprendre l'adolescència per acompanyar-la",
    intro: [
      "L'adolescència és una etapa de canvis físics, emocionals, socials i personals. Els fills i filles comencen a construir la seva identitat, busquen més autonomia i necessiten trobar el seu lloc al món.",
      'Per a les famílies, aquests canvis poden generar dubtes, desconcert o noves situacions de convivència.',
      "Aquest taller proposa un espai per comprendre millor què passa durant l'adolescència, revisar algunes idees preconcebudes i descobrir recursos per viure aquesta etapa amb més confiança i proximitat.",
    ],
    consisteix:
      "Quan entenem millor el que viuen els nostres fills i filles, és més fàcil acompanyar-los. Un taller per comprendre l'adolescència i cuidar el benestar emocional de tota la família.",
    topics: [
      "Els principals canvis de l'adolescència",
      'La construcció de la identitat',
      "La necessitat d'autonomia",
      'Les emocions i les relacions familiars',
      'Les expectatives de les persones adultes',
      "La comunicació i l'acompanyament",
    ],
    objective:
      "Afavorir una mirada comprensiva sobre l'adolescència i oferir un espai perquè les famílies puguin reflexionar sobre la seva manera d'acompanyar els fills i filles.",
    method:
      "Una sessió participativa que combina explicacions breus i accessibles sobre l'adolescència amb espais de reflexió i de conversa entre les famílies. El punt de partida són els dubtes i les situacions que porten les persones participants.",
    facts: {
      audience:
        'Famílies amb fills i filles preadolescents i adolescents, AMPAs, AFAs, centres educatius, ajuntaments i entitats.',
      duration: '1 sessió de 2 hores (adaptable a 90 minuts).',
      modality: 'Presencial.',
    },
    audienceShort: 'Famílies',
    durationShort: '1 sessió de 2 h',
    faqs: [
      {
        q: 'Per què canvia la relació amb els fills durant l’adolescència?',
        a: "Perquè els fills i filles necessiten guanyar autonomia i construir la seva pròpia identitat. És habitual que busquin més espai, qüestionin algunes normes i donin més pes al grup d'amistats. Això no vol dir que la família deixi de ser important: canvia la manera d'acompanyar-los, i entendre aquests canvis ajuda a viure'ls amb menys desconcert.",
      },
      {
        q: 'Aquest taller és adequat per a famílies amb preadolescents?',
        a: "Sí. Està adreçat a famílies amb fills i filles preadolescents i adolescents, de manera que també és útil per anticipar-se als canvis abans que arribin.",
      },
      {
        q: 'És necessari assistir-hi amb els fills?',
        a: "No. El taller està pensat per a les persones adultes que acompanyen els fills i filles: mares, pares i altres referents familiars.",
      },
      {
        q: 'Es pot organitzar des d’una AFA?',
        a: "Sí. Les AFAs i AMPAs són entre els destinataris d'aquest taller, igual que els centres educatius, els ajuntaments i les entitats. Pots demanar-ne informació des del formulari de contacte.",
      },
    ],
    ctaText: 'Vols organitzar aquest taller per a les famílies del teu centre?',
    related: ['acompanyar-fills-adolescents', 'converses-addiccions'],
  },

  {
    slug: 'acompanyar-fills-adolescents',
    group: 'families',
    name: 'Com acompanyar els fills i filles adolescents?',
    formName: 'Com acompanyar els fills i filles adolescents?',
    eyebrow: 'Programa per a famílies',
    seoTitle: 'Com acompanyar els fills adolescents | Taller per a famílies',
    description:
      "Programa de dues sessions per a famílies sobre comunicació, límits, autoestima i acompanyament durant l'adolescència.",
    subtitle: 'Entendre, comunicar-nos i acompanyar amb respecte.',
    image: 'com-acompanyar.webp',
    imageAlt: "Il·lustració d'un camí que avança entre turons, amb un indicador de direcció",
    cardSummary:
      'Programa de dues sessions (Entendre i Acompanyar) per comunicar-se amb més proximitat i posar límits amb respecte.',
    introTitle: 'Un programa en dues sessions',
    intro: [
      "Acompanyar un fill o una filla adolescent no sempre és fàcil. Apareixen noves preguntes, canvien les converses i situacions que abans semblaven senzilles poden convertir-se en motius de desacord.",
      "Com podem posar límits sense trencar la comunicació? Com podem respectar la necessitat d'autonomia sense deixar d'estar presents?",
      "Aquest programa de dues sessions ofereix un espai per reflexionar sobre la relació amb els fills i filles adolescents i descobrir maneres d'acompanyar-los des de la comprensió, el respecte i el vincle.",
    ],
    consisteix:
      "Entendre és el primer pas per poder acompanyar. Un programa de dues sessions per ajudar les famílies a comprendre millor aquesta etapa, comunicar-se amb més proximitat, posar límits amb respecte i reforçar l'autoestima i el vincle familiar.",
    sessions: [
      {
        label: 'Sessió 1',
        title: 'Entendre',
        items: [
          "Què passa durant l'adolescència?",
          'Canvis emocionals i socials',
          "Necessitat d'autonomia",
          'Construcció de la identitat',
          'Com influeixen les expectatives familiars',
        ],
      },
      {
        label: 'Sessió 2',
        title: 'Acompanyar',
        items: [
          'Escolta i comunicació',
          'Validació emocional',
          'Límits i convivència',
          'Gestió dels desacords',
          'Autoestima i confiança',
          'Construcció de vincles',
        ],
      },
    ],
    objective:
      'Reflexionar sobre les necessitats dels adolescents i les eines que poden ajudar les famílies a mantenir una relació propera, respectuosa i ajustada a aquesta etapa.',
    method:
      "Dues sessions participatives que combinen explicacions accessibles, reflexió i conversa en grup. La primera se centra a entendre l'adolescència i la segona, a traslladar aquesta comprensió a l'acompanyament del dia a dia.",
    facts: {
      audience:
        'Famílies amb fills i filles preadolescents i adolescents, AMPAs, AFAs, centres educatius, ajuntaments i entitats.',
      duration: '2 sessions de 2 hores (adaptables a 90 minuts). Sessió 1: Entendre · Sessió 2: Acompanyar.',
      modality: 'Presencial.',
    },
    audienceShort: 'Famílies',
    durationShort: '2 sessions de 2 h',
    faqs: [
      {
        q: 'Com podem comunicar-nos amb un adolescent que no vol parlar?',
        a: "No hi ha una fórmula única. Sovint ajuda triar bons moments, escoltar sense jutjar ni interrogar i mostrar interès pel seu món, encara que la conversa sigui breu. A la segona sessió es treballen l'escolta, la comunicació i la validació emocional per afavorir aquestes converses.",
      },
      {
        q: 'Posar límits és compatible amb respectar la seva autonomia?',
        a: "Sí. Els límits donen seguretat i formen part de l'acompanyament. La clau és ajustar-los a l'edat, explicar-ne el sentit i deixar espai perquè l'adolescent vagi assumint responsabilitats. Aquest equilibri és un dels temes centrals del programa.",
      },
      {
        q: "Què diferencia aquest programa del taller Caixa d'eines?",
        a: "Caixa d'eines: Adolescència Mode ON és una sessió única que ofereix una primera mirada comprensiva sobre l'etapa. Aquest programa té dues sessions i permet aprofundir-hi més: la primera se centra a entendre l'adolescència i la segona, en la comunicació, els límits, l'autoestima i el vincle.",
      },
      {
        q: 'Cal assistir a totes dues sessions?',
        a: "Les dues sessions estan pensades com un recorregut: la segona parteix del que es treballa a la primera. Per això es recomana assistir-hi a totes dues.",
      },
    ],
    ctaText: 'Organitza aquest programa per a les famílies del teu centre o entitat.',
    related: ['caixa-eines-adolescencia-mode-on', 'converses-addiccions'],
  },

  {
    slug: 'converses-addiccions',
    group: 'families',
    name: 'Converses que transformen: Addiccions',
    formName: 'Converses que transformen: Addiccions',
    eyebrow: 'Taller per a famílies',
    seoTitle: "Prevenció d'addiccions en adolescents | Taller per a famílies",
    description:
      "Taller de prevenció d'addiccions per a famílies. Comunicació, vincles i recursos per parlar sobre drogues amb adolescents.",
    subtitle: 'Parlar de drogues i adolescència des de la prevenció, la confiança i el diàleg.',
    byline: 'Amb Sergi Garcia i Ariadna Busqué',
    collab:
      "Aquest taller s'imparteix en col·laboració amb Sergi Garcia i Ariadna Busqué.",
    image: 'addiccions.webp',
    imageAlt:
      "Il·lustració d'un escut amb un cor, envoltat d'icones d'alcohol, tabac, mòbil, videojocs i apostes",
    cardSummary:
      'Amb Sergi Garcia i Ariadna Busqué. Estratègies per obrir converses honestes sobre addiccions amb fills i filles adolescents.',
    introTitle: 'La prevenció comença a casa, amb converses',
    intro: [
      "Parlar de drogues amb els fills i filles adolescents pot generar incomoditat, por o molts interrogants. De vegades no sabem quan començar la conversa, quina informació donar o com reaccionar davant de determinades situacions.",
      "La prevenció no consisteix únicament a transmetre informació sobre els riscos del consum. També implica construir relacions de confiança, fomentar el pensament crític i afavorir espais on els adolescents puguin expressar dubtes i inquietuds.",
      'Aquest taller convida les famílies a reflexionar sobre el seu paper preventiu i a descobrir maneres d’abordar el tema des del diàleg.',
    ],
    consisteix:
      "La prevenció comença molt abans del primer consum. Un taller per ajudar les famílies a comprendre la realitat actual de les drogues i descobrir com la comunicació, el vincle i les habilitats parentals poden esdevenir els principals factors de protecció.",
    topics: [
      'Adolescència i percepció del risc',
      'Informació i creences sobre les drogues',
      'Comunicació familiar',
      'Factors de risc i de protecció',
      'Escolta i confiança',
      'Com obrir converses sobre consums',
      'Com abordar situacions que generen preocupació',
    ],
    objective:
      "Promoure la prevenció de les addiccions a través del coneixement, la comunicació familiar i l'enfortiment dels factors de protecció.",
    method:
      "Una sessió participativa que combina informació sobre la realitat actual dels consums amb espais de diàleg i reflexió entre famílies, per pensar com obrir aquestes converses a casa.",
    facts: {
      audience:
        'Famílies amb fills i filles preadolescents i adolescents, AMPAs, AFAs, centres educatius, ajuntaments i entitats.',
      duration: '1 sessió de 2 hores (adaptable a 90 minuts).',
      modality: 'Presencial i/o en línia.',
    },
    audienceShort: 'Famílies',
    durationShort: '1 sessió de 2 h',
    faqs: [
      {
        q: 'Quan és convenient començar a parlar de drogues?',
        a: "Abans que el consum sigui una possibilitat propera. La prevenció comença molt abans del primer consum: parlar-ne ja a la preadolescència, adaptant la conversa a l'edat, ajuda que els fills i filles tinguin informació i sàpiguen que poden comptar amb la família.",
      },
      {
        q: 'Què podem fer si sospitem que un adolescent consumeix?',
        a: "Intentar mantenir la calma, buscar un moment adequat per parlar-ne i escoltar abans de jutjar. Si la preocupació es manté o la situació us supera, és recomanable consultar professionals o serveis especialitzats. El taller ajuda a preparar aquestes converses, però no substitueix una valoració individual.",
      },
      {
        q: 'Com parlar-ne sense generar confrontació?',
        a: "Partint de preguntes obertes, interessant-se per la seva opinió i evitant els sermons o les amenaces. Al taller es treballen maneres d'obrir aquestes converses des de la confiança.",
      },
      {
        q: 'És un taller preventiu o terapèutic?',
        a: "És una proposta formativa i preventiva adreçada a famílies. No és un tractament ni una intervenció clínica, i no substitueix l'atenció d'un servei especialitzat quan hi ha un consum problemàtic.",
      },
    ],
    ctaText: "Vols organitzar un taller de prevenció d'addiccions per a famílies?",
    related: ['acompanyar-fills-adolescents', 'caixa-eines-adolescencia-mode-on'],
  },

  // =========================================================================
  // TALLERS PER A ALUMNAT (INFANTS I ADOLESCENTS)
  // =========================================================================
  {
    slug: 'adolescencia-mode-on',
    group: 'alumnat',
    stages: ['primaria', 'secundaria'],
    name: 'Adolescència: Mode ON',
    formName: 'Adolescència: Mode ON',
    eyebrow: 'Taller per a alumnat',
    seoTitle: 'Adolescència Mode ON | Taller emocional per a alumnes',
    description:
      "Taller per a alumnes de 6è i 1r d'ESO sobre els canvis de l'adolescència, les emocions, l'autoconeixement i el benestar.",
    subtitle: "Un espai per descobrir què canvia durant l'adolescència i conèixer-nos millor.",
    image: 'adolescencia-mode-on.webp',
    imageAlt:
      "Il·lustració d'un adolescent davant d'un tauler de control amb botons d'emocions",
    cardSummary: "Un espai per explorar què passa \"per dins\" durant l'adolescència.",
    introTitle: 'Créixer, canviar i conèixer-se',
    intro: [
      'Créixer significa descobrir noves emocions, experimentar canvis i començar a fer-nos preguntes sobre qui som i qui volem ser.',
      "L'inici de l'adolescència és una etapa de transformacions en què les relacions, la imatge personal i la necessitat de pertànyer al grup adquireixen una importància especial.",
      "Aquest taller ofereix a l'alumnat un espai per parlar dels canvis que viu, posar paraules a les emocions i reflexionar sobre la pròpia identitat, les relacions i el benestar emocional.",
    ],
    consisteix:
      "Comprendre què ens passa és el primer pas per poder-ho transformar. Aquest taller acompanya els i les adolescents en una etapa plena de canvis, oferint-los eines per conèixer-se millor, cuidar el seu benestar emocional i créixer amb confiança.",
    topics: [
      "Els canvis de l'adolescència",
      'Autoconeixement i identitat',
      'Reconeixement de les emocions',
      'Autoestima i imatge personal',
      "Relacions amb el grup d'iguals",
      'Respecte a les diferències',
      'Necessitats personals i emocionals',
    ],
    objective:
      "Afavorir l'autoconeixement i la comprensió dels canvis de l'adolescència, promovent una mirada respectuosa cap a un mateix i cap als altres.",
    method:
      "Tres sessions amb dinàmiques participatives, preguntes de reflexió i activitats en grup. L'alumnat parteix de les seves pròpies vivències i preguntes, en un espai on es pot parlar de les emocions amb respecte i sense judicis.",
    facts: {
      audience: "Alumnes de 6è de primària i/o 1r d'ESO.",
      duration: '3 sessions de 2 hores (adaptables a 90 minuts).',
      modality: 'Presencial.',
    },
    audienceShort: "6è de primària i 1r d'ESO",
    durationShort: '3 sessions de 2 h',
    faqs: [
      {
        q: 'Per què treballar l’adolescència a 6è de primària?',
        a: "Perquè és el moment en què molts infants comencen a viure els primers canvis de l'adolescència i s'acosta el pas a l'institut. Parlar-ne abans o just a l'inici ajuda a entendre què els passa i a viure-ho amb més tranquil·litat.",
      },
      {
        q: 'Quins aspectes emocionals es poden abordar?',
        a: "El reconeixement de les emocions, l'autoestima i la imatge personal, la identitat i les relacions amb el grup d'iguals, entre d'altres. El taller treballa des del grup: no aprofundeix en situacions individuals.",
      },
      {
        q: 'El taller s’adapta al grup classe?',
        a: "Sí. Les dinàmiques s'ajusten a les característiques del grup i al curs (6è de primària o 1r d'ESO).",
      },
      {
        q: 'Cal preparar alguna activitat prèvia?',
        a: "No és necessari. Abans del taller és útil parlar amb el centre sobre el grup i els temes que més els preocupen, per ajustar-ne el contingut.",
      },
    ],
    ctaText: 'Porta aquest taller al teu centre educatiu.',
    related: ['educar-la-mirada', 'resolucio-conflictes'],
  },

  {
    slug: 'educar-la-mirada',
    group: 'alumnat',
    stages: ['primaria', 'secundaria'],
    name: 'Educar la mirada',
    formName: 'Educar la mirada - amb Steph Watson',
    eyebrow: 'Taller per a alumnat',
    seoTitle: 'Educar la mirada | Taller de pensament crític per a joves',
    description:
      "Taller per a alumnes de 6è i 1r d'ESO sobre imatges, estereotips, cossos i relacions. Una mirada més crítica i respectuosa.",
    subtitle: 'Aprendre a mirar-nos i mirar els altres amb consciència i respecte.',
    byline: 'Amb Steph Watson',
    collab: 'Aquest taller s’imparteix en col·laboració amb Steph Watson.',
    image: 'mirada.webp',
    imageAlt:
      "Il·lustració d'una noia amb ulleres que observa fotografies i imatges de xarxes socials",
    cardSummary:
      'Amb Steph Watson. Un taller col·laboratiu per aprendre a mirar-nos i mirar els altres amb més consciència.',
    introTitle: 'Què ens mostren les imatges?',
    intro: [
      "Cada dia rebem centenars d'imatges a través de les pantalles, la publicitat i les xarxes socials. Aquestes imatges influeixen en la manera com entenem els cossos, la bellesa, les relacions i allò que considerem normal.",
      'Però fins a quin punt ens parem a pensar què ens mostren i què deixen fora?',
      'Educar la mirada és un taller que convida els infants i adolescents a observar, qüestionar i reflexionar sobre els missatges visuals que els envolten, afavorint una mirada crítica, respectuosa i conscient.',
    ],
    consisteix:
      "Vivim envoltats d'imatges que influeixen en la manera com entenem els cossos, les relacions i el món. Aquest taller convida els i les joves a qüestionar els missatges que reben, desenvolupar una mirada crítica i construir una manera de relacionar-se més conscient, lliure i respectuosa.",
    topics: [
      'La influència de les imatges',
      'Els estereotips',
      'La diversitat corporal',
      'La comparació social',
      'Les expectatives sobre la pròpia imatge',
      "El respecte i l'empatia",
      'El pensament crític davant dels continguts visuals',
    ],
    objective:
      'Afavorir el pensament crític davant dels missatges visuals i promoure una relació més respectuosa amb la pròpia imatge i amb les altres persones.',
    method:
      "Tres sessions participatives en què el grup observa imatges i missatges visuals propers a la seva realitat, en comparteix lectures diferents i reflexiona sobre com l'afecten.",
    facts: {
      audience: "Alumnes de 6è de primària i/o 1r d'ESO.",
      duration: '3 sessions de 2 hores (adaptables a 90 minuts).',
      modality: 'Presencial.',
    },
    audienceShort: "6è de primària i 1r d'ESO",
    durationShort: '3 sessions de 2 h',
    faqs: [
      {
        q: 'Per què és important educar la mirada?',
        a: "Perquè les imatges que veiem cada dia —a les xarxes, a la publicitat o a les sèries— influeixen en com entenem els cossos, la bellesa i les relacions. Aprendre a mirar-les amb sentit crític ajuda a no prendre-les com a model únic.",
      },
      {
        q: 'Com influeixen les imatges en l’autoestima?',
        a: "La comparació constant amb imatges idealitzades o retocades pot fer que algunes persones valorin negativament el seu cos o la seva vida. Reconèixer aquest mecanisme és un primer pas per relacionar-se amb la pròpia imatge des de més respecte.",
      },
      {
        q: 'Aquest taller és adequat per a la transició a secundària?',
        a: "Sí. Està adreçat a alumnes de 6è de primària i 1r d'ESO, una etapa en què la imatge personal i les relacions amb el grup guanyen molt de pes.",
      },
      {
        q: 'Quina relació té amb l’educació emocional?',
        a: "Treballar la mirada implica parlar d'autoestima, de comparació, d'empatia i de respecte, que són aspectes centrals de l'educació emocional.",
      },
    ],
    ctaText: 'Vols treballar la mirada crítica amb el teu alumnat?',
    related: ['adolescencia-mode-on', 'neurodiversitat-aula'],
  },

  {
    slug: 'neurodiversitat-aula',
    group: 'alumnat',
    stages: ['primaria', 'secundaria'],
    name: "La neurodiversitat dins de l'aula",
    formName: "La neurodiversitat dins de l'aula",
    eyebrow: 'Taller per a alumnat',
    seoTitle: "Taller de neurodiversitat a l'aula | Griselda Psicòloga",
    description:
      'Taller sobre neurodiversitat per a primària i secundària. Activitats per fomentar l’empatia, el respecte i una escola més inclusiva.',
    subtitle: 'Comprendre les diferències per construir entorns més inclusius.',
    image: 'neurodiversitat.webp',
    imageAlt:
      "Il·lustració d'un grup divers d'infants i adolescents asseguts junts, amb icones d'un cervell, un trencaclosques i el símbol de l'infinit",
    cardSummary:
      "Comprendre què és la neurodiversitat i com construir espais més inclusius i accessibles per a tothom.",
    introTitle: 'Maneres diferents de pensar, aprendre i sentir',
    intro: [
      'No totes les persones pensem, aprenem, sentim o ens relacionem de la mateixa manera. Aquesta diversitat també és present a les nostres aules.',
      'La neurodiversitat ens convida a reconèixer que existeixen diferents maneres de processar la informació, comunicar-nos i experimentar el món.',
      'Aquest taller proposa un espai de sensibilització perquè infants i adolescents puguin reflexionar sobre les diferències individuals, qüestionar estereotips i descobrir la importància de construir entorns on tothom pugui participar i sentir-se respectat.',
    ],
    consisteix:
      "Cada persona aprèn, pensa i es relaciona amb el món d'una manera diferent. Aquest taller convida els infants i adolescents a comprendre què és la neurodiversitat, desenvolupar una mirada més empàtica i descobrir com construir espais més inclusius, respectuosos i accessibles per a tothom.",
    topics: [
      'Què és la neurodiversitat?',
      "Diferents maneres d'aprendre i comunicar-nos",
      'Necessitats i fortaleses individuals',
      'Estereotips i prejudicis',
      'Empatia i respecte',
      'Barreres a la participació',
      'Convivència i inclusió',
    ],
    objective:
      'Promoure el respecte a la diversitat de funcionaments neurològics i afavorir actituds inclusives dins del grup classe.',
    method:
      "Una sessió participativa que combina activitats de reflexió, exemples i situacions quotidianes de l'aula. És una proposta de sensibilització per a tot el grup: no és una activitat diagnòstica ni terapèutica.",
    facts: {
      audience: 'Alumnes de primària i secundària (s’adapten els continguts segons el curs).',
      duration: '1 sessió de 2 hores (adaptable a 90 minuts).',
      modality: 'Presencial.',
    },
    audienceShort: 'Primària i secundària',
    durationShort: '1 sessió de 2 h',
    faqs: [
      {
        q: 'Què és la neurodiversitat?',
        a: "És la idea que hi ha maneres diferents de funcionar del cervell: de processar la informació, d'aprendre, de comunicar-se i de relacionar-se. Aquesta diversitat forma part de la variabilitat humana.",
      },
      {
        q: 'Per què treballar-la a l’escola?',
        a: "Perquè a totes les aules hi conviuen maneres diferents d'aprendre i de relacionar-se. Entendre-les ajuda a reduir prejudicis i a afavorir un clima de grup on tothom pugui participar.",
      },
      {
        q: 'És un taller només per a alumnes neurodivergents?',
        a: "No. S'adreça a tot el grup classe. L'objectiu és sensibilitzar i promoure actituds inclusives, no identificar ni diagnosticar ningú.",
      },
      {
        q: 'Es pot adaptar a primària i secundària?',
        a: 'Sí. Està pensat per a alumnes de primària i de secundària, i els continguts s’adapten segons el curs.',
      },
      {
        q: 'Com ajuda a reflexionar sobre la convivència?',
        a: "En posar paraules a les diferències i a les barreres que poden dificultar la participació, el grup pot pensar què pot fer perquè l'aula sigui un espai més respectuós per a tothom.",
      },
    ],
    ctaText: 'Promou una mirada més inclusiva al teu centre educatiu.',
    related: ['resolucio-conflictes', 'educar-la-mirada'],
  },

  {
    slug: 'resolucio-conflictes',
    group: 'alumnat',
    stages: ['secundaria'],
    name: 'Resolució de conflictes',
    formName: 'Resolució de conflictes',
    eyebrow: 'Taller per a alumnat',
    seoTitle: "Taller de resolució de conflictes a l'ESO | Griselda",
    description:
      "Taller per a alumnes de 3r i 4t d'ESO sobre comunicació assertiva, límits, convivència i resolució constructiva de conflictes.",
    subtitle: 'Aprendre a comunicar-nos, escoltar i gestionar els desacords.',
    image: 'conflictes.webp',
    imageAlt:
      "Il·lustració de dos adolescents estirant una corda amb un nus al mig, amb bafarades de diàleg i idees",
    cardSummary:
      'Eines per comunicar-se de manera assertiva, posar límits amb respecte i gestionar els desacords des del diàleg.',
    introTitle: 'Els conflictes també ensenyen',
    intro: [
      "Els conflictes formen part de les relacions humanes. A l'adolescència, les amistats, les diferències d'opinió, la pressió del grup i les dificultats de comunicació poden generar situacions de tensió.",
      "Però tenir un conflicte no significa necessàriament tenir una mala relació. També pot ser una oportunitat per aprendre a escoltar, expressar necessitats i buscar alternatives.",
      'Aquest taller proposa eines per reflexionar sobre la manera com ens relacionem i explorar estratègies per gestionar els desacords de forma respectuosa i constructiva.',
    ],
    consisteix:
      "Els conflictes formen part del dia a dia. Aquest taller ofereix eines perquè els adolescents aprenguin a comunicar-se de manera assertiva, posar límits amb respecte i gestionar els desacords des del diàleg i la cooperació.",
    topics: [
      'Què és un conflicte?',
      'Emocions davant dels desacords',
      'Diferents maneres de reaccionar',
      'Comunicació assertiva',
      'Escolta activa',
      'Límits personals',
      'Empatia',
      "Cerca d'alternatives i acords",
    ],
    objective:
      'Afavorir habilitats de comunicació i convivència que ajudin els adolescents a gestionar els desacords des del respecte, el diàleg i la responsabilitat.',
    method:
      "Una sessió participativa basada en l'anàlisi de situacions quotidianes, el debat i la reflexió en grup, per pensar junts maneres diferents de respondre davant d'un desacord.",
    facts: {
      audience: "Alumnes de 3r i 4t d'ESO.",
      duration: '1 sessió de 2 hores (adaptable a 90 minuts).',
      modality: 'Presencial.',
    },
    audienceShort: "3r i 4t d'ESO",
    durationShort: '1 sessió de 2 h',
    faqs: [
      {
        q: 'Quina diferència hi ha entre un conflicte i una situació d’assetjament?',
        a: "Un conflicte és un desacord entre persones que, en principi, estan en una posició semblant, i es pot abordar parlant. L'assetjament implica conductes de dany repetides en el temps i un desequilibri de poder entre qui les fa i qui les rep. Les situacions d'assetjament s'han d'abordar seguint els protocols del centre; aquest taller no els substitueix.",
      },
      {
        q: 'Per què treballar l’assertivitat amb adolescents?',
        a: "Perquè ajuda a expressar opinions, necessitats i límits sense agredir ni callar. A l'adolescència, quan la pressió del grup pesa molt, és una habilitat clau per relacionar-se des del respecte.",
      },
      {
        q: 'Es pot adaptar el taller a les necessitats d’un grup?',
        a: "Sí. Abans del taller es pot parlar amb el centre sobre les característiques del grup per ajustar-ne els exemples i el focus.",
      },
      {
        q: 'És un taller per prevenir o per intervenir en conflictes?',
        a: "És un taller preventiu i formatiu: treballa habilitats de comunicació i convivència amb tot el grup. No és una intervenció en un conflicte concret ni substitueix els protocols escolars d'actuació.",
      },
    ],
    ctaText: 'Vols treballar la convivència i la gestió de conflictes al teu centre?',
    related: ['neurodiversitat-aula', 'adolescencia-mode-on'],
  },
];

/**
 * Projectes i col·laboracions: tallers del programa Connecta i Actua
 * (Fundació Salut i Comunitat), on la Griselda hi col·labora com a
 * formadora. No són tallers propis: les seves pàgines internes es mantenen
 * (no es trenquen URLs) però amb `noindex` i fora del sitemap, i la font
 * principal d'informació és el web oficial del programa.
 */
const connecta = [
  {
    slug: 'tothom-mobil-menys-jo',
    name: 'Tothom té mòbil menys jo',
    image: 'tothom-mobil.svg',
    url: 'https://connectaiactua.cat/taller/tothom-te-un-movil-menys-jo/',
    summary:
      'Taller del programa Connecta i Actua, gestionat per la Fundació Salut i Comunitat, per acompanyar les famílies en la decisió sobre el primer mòbil i la pressió social que hi ha al voltant.',
  },
  {
    slug: 'tothom-mobil-menys-jo-online',
    name: 'Tothom té mòbil menys jo (versió en línia)',
    image: 'tothom-mobil.svg',
    url: 'https://connectaiactua.cat/taller/tothom-te-un-movil-menys-jo/',
    summary:
      'Versió en línia del taller "Tothom té mòbil menys jo", dins el programa Connecta i Actua, gestionat per la Fundació Salut i Comunitat, per facilitar-hi l’accés a famílies que no poden assistir-hi presencialment.',
  },
  {
    slug: 'parlem-pantalles',
    name: 'Parlem de pantalles',
    image: 'parlem-pantalles.svg',
    url: 'https://connectaiactua.cat/taller/parlem-de-pantalles/',
    summary:
      "Taller del programa Connecta i Actua que obre un espai de diàleg entre famílies sobre l'ús de les pantalles i com abordar-ne els reptes conjuntament.",
  },
  {
    slug: 'somriu-son-adolescents',
    name: 'Somriu! Són adolescents',
    image: 'somriu.svg',
    url: 'https://connectaiactua.cat/taller/somriu-son-adolescents/',
    summary:
      "Taller del programa Connecta i Actua que convida les famílies a mirar l'adolescència des d'una perspectiva positiva i comprensiva, reduint la conflictivitat quotidiana.",
  },
  {
    slug: 'parlem-i-actua',
    name: 'Parlem i actua',
    image: 'parlem-actua.svg',
    url: 'https://connectaiactua.cat/taller/parlem-i-actua/',
    summary:
      'Darrer taller del cicle de Connecta i Actua, orientat a consolidar els aprenentatges dels tallers anteriors i traduir-los en accions concretes dins la família.',
  },
];

module.exports = { tallers, connecta };
