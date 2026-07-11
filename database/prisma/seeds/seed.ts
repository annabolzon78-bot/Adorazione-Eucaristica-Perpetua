import {
  PrismaClient,
  AdorationType,
  StreamType,
  StreamStatus,
  MiracleVerificationLevel,
  PilgrimageType,
  MassRite,
  Role,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Adorazione Viva...\n')

  // ── LANGUAGES ────────────────────────────────────────────────
  console.log('  Languages...')
  const langs = await Promise.all([
    prisma.language.upsert({ where: { code: 'it' }, update: {}, create: { code: 'it', name: 'Italiano',    nativeName: 'Italiano',    flagEmoji: '🇮🇹', isActive: true } }),
    prisma.language.upsert({ where: { code: 'en' }, update: {}, create: { code: 'en', name: 'English',     nativeName: 'English',     flagEmoji: '🇬🇧', isActive: true } }),
    prisma.language.upsert({ where: { code: 'es' }, update: {}, create: { code: 'es', name: 'Spagnolo',    nativeName: 'Español',     flagEmoji: '🇪🇸', isActive: true } }),
    prisma.language.upsert({ where: { code: 'fr' }, update: {}, create: { code: 'fr', name: 'Francese',    nativeName: 'Français',    flagEmoji: '🇫🇷', isActive: true } }),
    prisma.language.upsert({ where: { code: 'pt' }, update: {}, create: { code: 'pt', name: 'Portoghese',  nativeName: 'Português',   flagEmoji: '🇵🇹', isActive: true } }),
    prisma.language.upsert({ where: { code: 'de' }, update: {}, create: { code: 'de', name: 'Tedesco',     nativeName: 'Deutsch',     flagEmoji: '🇩🇪', isActive: true } }),
    prisma.language.upsert({ where: { code: 'pl' }, update: {}, create: { code: 'pl', name: 'Polacco',     nativeName: 'Polski',      flagEmoji: '🇵🇱', isActive: true } }),
    prisma.language.upsert({ where: { code: 'la' }, update: {}, create: { code: 'la', name: 'Latino',      nativeName: 'Latina',      isActive: true } }),
  ])

  // ── COUNTRIES ─────────────────────────────────────────────────
  console.log('  Countries...')
  const [italy, ireland, poland, france, portugal, argentina, mexico, india] = await Promise.all([
    prisma.country.upsert({ where: { code: 'IT' }, update: {}, create: { code: 'IT', code3: 'ITA', nameIt: 'Italia',      nameEn: 'Italy',    continent: 'Europe',       flagEmoji: '🇮🇹', callingCode: '+39' } }),
    prisma.country.upsert({ where: { code: 'IE' }, update: {}, create: { code: 'IE', code3: 'IRL', nameIt: 'Irlanda',     nameEn: 'Ireland',  continent: 'Europe',       flagEmoji: '🇮🇪', callingCode: '+353' } }),
    prisma.country.upsert({ where: { code: 'PL' }, update: {}, create: { code: 'PL', code3: 'POL', nameIt: 'Polonia',     nameEn: 'Poland',   continent: 'Europe',       flagEmoji: '🇵🇱', callingCode: '+48' } }),
    prisma.country.upsert({ where: { code: 'FR' }, update: {}, create: { code: 'FR', code3: 'FRA', nameIt: 'Francia',     nameEn: 'France',   continent: 'Europe',       flagEmoji: '🇫🇷', callingCode: '+33' } }),
    prisma.country.upsert({ where: { code: 'PT' }, update: {}, create: { code: 'PT', code3: 'PRT', nameIt: 'Portogallo',  nameEn: 'Portugal', continent: 'Europe',       flagEmoji: '🇵🇹', callingCode: '+351' } }),
    prisma.country.upsert({ where: { code: 'AR' }, update: {}, create: { code: 'AR', code3: 'ARG', nameIt: 'Argentina',   nameEn: 'Argentina',continent: 'South America', flagEmoji: '🇦🇷', callingCode: '+54' } }),
    prisma.country.upsert({ where: { code: 'MX' }, update: {}, create: { code: 'MX', code3: 'MEX', nameIt: 'Messico',     nameEn: 'Mexico',   continent: 'North America', flagEmoji: '🇲🇽', callingCode: '+52' } }),
    prisma.country.upsert({ where: { code: 'IN' }, update: {}, create: { code: 'IN', code3: 'IND', nameIt: 'India',       nameEn: 'India',    continent: 'Asia',         flagEmoji: '🇮🇳', callingCode: '+91' } }),
  ])

  // ── CITIES ────────────────────────────────────────────────────
  console.log('  Cities...')
  const [rome, lanciano, navan, sokolka, lisbon, fatima, buenosaires, tixtla] = await Promise.all([
    prisma.city.upsert({ where: { name_countryId: { name: 'Roma', countryId: italy.id } }, update: {}, create: { name: 'Roma', region: 'Lazio', countryId: italy.id, lat: 41.9, lng: 12.5, timezone: 'Europe/Rome', isCapital: true } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Lanciano', countryId: italy.id } }, update: {}, create: { name: 'Lanciano', region: 'Abruzzo', countryId: italy.id, lat: 42.23, lng: 14.39, timezone: 'Europe/Rome' } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Navan', countryId: ireland.id } }, update: {}, create: { name: 'Navan', region: 'Co. Meath', countryId: ireland.id, lat: 53.655, lng: -6.69, timezone: 'Europe/Dublin' } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Sokółka', countryId: poland.id } }, update: {}, create: { name: 'Sokółka', region: 'Podlaskie', countryId: poland.id, lat: 53.41, lng: 23.5, timezone: 'Europe/Warsaw' } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Lisbona', countryId: portugal.id } }, update: {}, create: { name: 'Lisbona', region: 'Lisboa', countryId: portugal.id, lat: 38.72, lng: -9.14, timezone: 'Europe/Lisbon', isCapital: true } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Fátima', countryId: portugal.id } }, update: {}, create: { name: 'Fátima', region: 'Santarém', countryId: portugal.id, lat: 39.62, lng: -8.67, timezone: 'Europe/Lisbon' } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Buenos Aires', countryId: argentina.id } }, update: {}, create: { name: 'Buenos Aires', countryId: argentina.id, lat: -34.61, lng: -58.37, timezone: 'America/Argentina/Buenos_Aires', isCapital: true } }),
    prisma.city.upsert({ where: { name_countryId: { name: 'Tixtla', countryId: mexico.id } }, update: {}, create: { name: 'Tixtla', region: 'Guerrero', countryId: mexico.id, lat: 17.57, lng: -99.39, timezone: 'America/Mexico_City' } }),
  ])

  // ── RELIGIOUS ORDERS ──────────────────────────────────────────
  console.log('  Religious Orders...')
  const [salesiani, comboniani, carmelitani, francescani, domenicani] = await Promise.all([
    prisma.religiousOrder.upsert({ where: { name: 'Salesiani di Don Bosco' }, update: {}, create: { name: 'Salesiani di Don Bosco', abbreviation: 'SDB', founder: 'San Giovanni Bosco', foundedYear: 1859, charism: 'Educazione dei giovani', websiteUrl: 'https://www.sdb.org' } }),
    prisma.religiousOrder.upsert({ where: { name: 'Missionari Comboniani' }, update: {}, create: { name: 'Missionari Comboniani', abbreviation: 'MCCJ', founder: 'San Daniele Comboni', foundedYear: 1867, charism: 'Missione in Africa' } }),
    prisma.religiousOrder.upsert({ where: { name: 'Carmelitani Scalzi' }, update: {}, create: { name: 'Carmelitani Scalzi', abbreviation: 'OCD', foundedYear: 1568, charism: 'Contemplazione e missione' } }),
    prisma.religiousOrder.upsert({ where: { name: 'Frati Minori' }, update: {}, create: { name: 'Frati Minori', abbreviation: 'OFM', founder: 'San Francesco d\'Assisi', foundedYear: 1209, charism: 'Povertà e fraternità evangelica' } }),
    prisma.religiousOrder.upsert({ where: { name: 'Frati Predicatori (Domenicani)' }, update: {}, create: { name: 'Frati Predicatori (Domenicani)', abbreviation: 'OP', founder: 'San Domenico di Guzmán', foundedYear: 1216, charism: 'Predicazione e studio' } }),
  ])

  // ── ADMIN USER ────────────────────────────────────────────────
  console.log('  Admin user...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@adorazioneviva.com' },
    update: {},
    create: {
      email:        'admin@adorazioneviva.com',
      passwordHash: await bcrypt.hash('Admin1234!', 12),
      name:         'Admin',
      displayName:  'Adorazione Viva',
      role:         Role.SUPER_ADMIN,
      isEmailVerified: true,
      languageId:   langs[0].id,
      countryId:    italy.id,
    },
  })

  // ── PARISH & CHAPEL — Navan ───────────────────────────────────
  console.log('  Parish & Chapel (Navan)...')
  const parishNavan = await prisma.parish.upsert({
    where: { id: 'parish-navan' },
    update: {},
    create: {
      id:            'parish-navan',
      name:          "St Mary's Parish",
      address:       'Fair Green',
      lat:           53.655,
      lng:           -6.69,
      countryId:     ireland.id,
      cityId:        navan.id,
      pastorName:    'Fr. Michael',
      email:         'info@navanparish.ie',
      websiteUrl:    'https://www.navanparish.ie',
      hasAdoration:  true,
      hasPerpetualAdoration: true,
      hasLiveStream: true,
      hasConfessions: true,
      status:        'VERIFIED',
      verifiedAt:    new Date(),
    },
  })

  const chapelNavan = await prisma.chapel.upsert({
    where: { id: 'chapel-navan' },
    update: {},
    create: {
      id:           'chapel-navan',
      name:         "Cappella dell'Adorazione",
      address:      'Fair Green, Navan, Co. Meath',
      lat:          53.655,
      lng:          -6.69,
      countryId:    ireland.id,
      cityId:       navan.id,
      parishId:     parishNavan.id,
      adorationType: AdorationType.PERPETUA,
      status:       'VERIFIED',
      verifiedAt:   new Date(),
      is24h:        true,
      isOpenNow:    true,
      hasLiveStream: true,
      hasConfessions: true,
      isAccessible:  true,
    },
  })

  await prisma.liveStream.upsert({
    where: { id: 'stream-navan-1' },
    update: {},
    create: {
      id:         'stream-navan-1',
      chapelId:   chapelNavan.id,
      type:       StreamType.YOUTUBE_LIVE,
      status:     StreamStatus.ACTIVE,
      name:       'St Mary\'s Navan — Cappella 1',
      url:        'https://www.youtube.com/live/hMNLrStmcTs',
      embedUrl:   'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1',
      channelId:  'UCrVO5c08f7Y3sRUtwhaNmow',
      isDefault:  true,
      isActive:   true,
    },
  })

  await prisma.liveStream.upsert({
    where: { id: 'stream-navan-2' },
    update: {},
    create: {
      id:       'stream-navan-2',
      chapelId: chapelNavan.id,
      type:     StreamType.YOUTUBE_LIVE,
      status:   StreamStatus.ACTIVE,
      name:     'St Mary\'s Navan — Cappella 2',
      url:      'https://www.youtube.com/live/GlGkFWPKomU',
      embedUrl: 'https://www.youtube.com/embed/GlGkFWPKomU?autoplay=1',
      isDefault: false,
      isActive:  true,
    },
  })

  // ── EUCHARISTIC MIRACLES ──────────────────────────────────────
  console.log('  Eucharistic Miracles...')
  await Promise.all([
    prisma.eucharisticMiracle.upsert({
      where: { slug: 'lanciano' },
      update: {},
      create: {
        title: 'Miracolo Eucaristico di Lanciano',
        slug: 'lanciano',
        location: 'Lanciano',
        city: 'Lanciano',
        countryId: italy.id,
        year: 750,
        yearCa: 'VIII secolo d.C.',
        lat: 42.23,
        lng: 14.39,
        verificationLevel: MiracleVerificationLevel.SCIENTIFICO,
        summary: 'Il più antico e studiato miracolo eucaristico. Il pane si trasformò in carne e il vino in sangue.',
        fullDescription: 'Durante la Santa Messa, un monaco basiliano tormentato da dubbi sulla presenza reale di Cristo vide l\'Ostia trasformarsi visibilmente in carne e il vino coagularsi in cinque globuli di sangue di diversa grandezza.',
        scientificAnalysis: 'Analisi del 1970 dal Prof. Odoardo Linoli: tessuto muscolare cardiaco umano (miocardio), sangue tipo AB, struttura intatta dopo 12 secoli. 500 scienziati ONU: nessuna spiegazione naturale.',
        tissueType: 'Miocardio — ventricolo sinistro del cuore umano',
        bloodType: 'AB',
        analyzedBy: 'Prof. Odoardo Linoli, OMS',
        analysisYear: 1970,
        isVisitableToday: true,
        conservedAt: 'Santuario del Miracolo Eucaristico, Lanciano (CH)',
        featuredOrder: 1,
        isPublished: true,
      },
    }),
    prisma.eucharisticMiracle.upsert({
      where: { slug: 'buenos-aires' },
      update: {},
      create: {
        title: 'Miracolo Eucaristico di Buenos Aires',
        slug: 'buenos-aires',
        location: 'Buenos Aires',
        countryId: argentina.id,
        year: 1996,
        yearCa: '1992, 1994, 1996',
        lat: -34.61,
        lng: -58.37,
        verificationLevel: MiracleVerificationLevel.SCIENTIFICO,
        summary: 'Tre episodi distinti. Un\'Ostia si trasformò in carne viva con globuli bianchi ancora in movimento.',
        fullDescription: 'In tre occasioni distinte, Ostie cadute e messe in acqua si trasformarono in frammenti di carne sanguinante. Il Cardinal Jorge Bergoglio (futuro Papa Francesco) autorizzò le analisi scientifiche.',
        scientificAnalysis: 'Prof. Frederick Zugibe (cardiologo NY): miocardio umano ventricolo sinistro, globuli bianchi vivi in movimento, sangue AB. DNA identico ai campioni di Lanciano.',
        tissueType: 'Miocardio umano — ventricolo sinistro',
        bloodType: 'AB',
        analyzedBy: 'Prof. Frederick Zugibe, Columbia University',
        analysisYear: 1999,
        isVisitableToday: false,
        featuredOrder: 2,
        isPublished: true,
      },
    }),
    prisma.eucharisticMiracle.upsert({
      where: { slug: 'sokolka' },
      update: {},
      create: {
        title: 'Miracolo Eucaristico di Sokółka',
        slug: 'sokolka',
        location: 'Sokółka',
        city: 'Sokółka',
        countryId: poland.id,
        year: 2008,
        lat: 53.41,
        lng: 23.5,
        verificationLevel: MiracleVerificationLevel.SCIENTIFICO,
        summary: 'Un\'Ostia caduta si fusè con il pane. Il miocardio era intrecciato con la fibra dell\'Ostia.',
        fullDescription: 'Un\'Ostia caduta durante la distribuzione della comunione fu posta in acqua. Settimane dopo apparve una sostanza rossastra che si fuse con il tessuto dell\'Ostia, rendendola inseparabile.',
        scientificAnalysis: 'Università di Białystok: miocardio umano strettamente intrecciato con il pane, impossibile separarlo. Prof. Sulkowski: "Non ho spiegazioni scientifiche per questo."',
        tissueType: 'Miocardio — fuso con il pane eucaristico',
        bloodType: 'AB',
        analyzedBy: 'Università Medica di Białystok',
        analysisYear: 2009,
        isVisitableToday: true,
        conservedAt: 'Chiesa di Sant\'Antonio, Sokółka',
        officialRecognition: 'Approvato dalla Conferenza Episcopale Polacca',
        featuredOrder: 3,
        isPublished: true,
      },
    }),
  ])

  // ── PILGRIMAGES ───────────────────────────────────────────────
  console.log('  Pilgrimages...')
  await prisma.pilgrimage.upsert({
    where: { slug: 'fatima' },
    update: {},
    create: {
      name: 'Santuario di Nostra Signora di Fátima',
      slug: 'fatima',
      type: PilgrimageType.MARIANO,
      description: 'Il più grande santuario mariano del mondo. La Vergine apparve a tre pastorelli nel 1917. Adorazione eucaristica perpetua nella Cappella delle Apparizioni.',
      location: 'Fátima',
      countryId: portugal.id,
      cityId: fatima.id,
      lat: 39.62,
      lng: -8.67,
      websiteUrl: 'https://www.fatima.pt',
      apparitionYear: 1917,
      feastDay: '05-13',
      annualVisitors: 8_000_000,
      hasAdoration: true,
      hasLiveStream: true,
      streamUrl: 'https://www.youtube.com/c/SantuarioFatima',
      isPublished: true,
    },
  })

  // ── PRAYER CATEGORIES ─────────────────────────────────────────
  console.log('  Prayer Categories...')
  const [catAdorazione, catSuffragio, catRiparazione, catLiturgiche, catSanti] = await Promise.all([
    prisma.prayerCategory.upsert({ where: { slug: 'adorazione' }, update: {}, create: { name: 'Adorazione', slug: 'adorazione', description: 'Preghiere di adorazione davanti al Santissimo', icon: '❤️‍🔥', color: '#8b1a2a', sortOrder: 1 } }),
    prisma.prayerCategory.upsert({ where: { slug: 'suffragio' }, update: {}, create: { name: 'Suffragio', slug: 'suffragio', description: 'Preghiere per le Anime del Purgatorio', icon: '🕊️', color: '#6b3a8a', sortOrder: 2 } }),
    prisma.prayerCategory.upsert({ where: { slug: 'riparazione' }, update: {}, create: { name: 'Riparazione', slug: 'riparazione', description: 'Atti di riparazione al Sacro Cuore', icon: '💛', color: '#92400e', sortOrder: 3 } }),
    prisma.prayerCategory.upsert({ where: { slug: 'liturgiche' }, update: {}, create: { name: 'Preghiere Liturgiche', slug: 'liturgiche', description: 'Preghiere dalla tradizione liturgica della Chiesa', icon: '✝️', color: '#1e40af', sortOrder: 4 } }),
    prisma.prayerCategory.upsert({ where: { slug: 'santi' }, update: {}, create: { name: 'Preghiere dei Santi', slug: 'santi', description: 'Preghiere composte dai santi della Chiesa', icon: '🌟', color: '#166534', sortOrder: 5 } }),
  ])

  // ── PRAYERS ───────────────────────────────────────────────────
  console.log('  Prayers...')
  await Promise.all([
    prisma.prayer.upsert({ where: { slug: 'atto-adorazione' }, update: {}, create: {
      title: 'Atto di Adorazione', slug: 'atto-adorazione', categoryId: catAdorazione.id,
      originalText: 'O Gesù, vero Dio e vero uomo, presente nel Santissimo Sacramento dell\'altare, ti adoro con profonda riverenza. Credo fermamente che sei qui presente. Ti amo sopra ogni cosa e desidero riceverti nella mia anima. Rimani con me, Signore.',
      isLiturgical: false, sortOrder: 1, isPublished: true,
    }}),
    prisma.prayer.upsert({ where: { slug: 'anima-christi' }, update: {}, create: {
      title: 'Anima Christi', slug: 'anima-christi', categoryId: catSanti.id,
      author: 'Attribuita a San Ignazio di Loyola', century: 'XIV',
      originalText: 'Anima di Cristo, santificami.\nCorpo di Cristo, salvami.\nSangue di Cristo, inebriami.\nAcqua del costato di Cristo, lavami.\nPassione di Cristo, confortami.\nO buon Gesù, esaudiscimi.\nNascondimi nelle tue piaghe.\nNon permettere che mi separi da te.\nDifendimi dal nemico maligno.\nNell\'ora della mia morte chiamami,\ne comanda che io venga a te,\naffinché con i tuoi santi ti lodi nei secoli dei secoli. Amen.',
      latinText: 'Anima Christi, sanctifica me.\nCorpus Christi, salva me.\nSanguis Christi, inebria me...',
      isLiturgical: false, sortOrder: 2, isPublished: true,
    }}),
    prisma.prayer.upsert({ where: { slug: 'tantum-ergo' }, update: {}, create: {
      title: 'Tantum Ergo', slug: 'tantum-ergo', categoryId: catLiturgiche.id,
      author: 'San Tommaso d\'Aquino', century: 'XIII',
      originalText: 'Adoriamo dunque prostrati\nun sì grande Sacramento,\ne l\'antica figura\nlasci il posto alla novità;\nla fede supplisca\nai sensi venuti meno.\nAl Padre e al Figlio\nsia data lode e giubilo,\nsalute, onore, virtù\ne sia anche benedizione;\na Colui che procede da entrambi\nuguale lode si innalzi. Amen.',
      isLiturgical: true, sortOrder: 3, isPublished: true,
    }}),
    prisma.prayer.upsert({ where: { slug: 'requiem-aeternam' }, update: {}, create: {
      title: 'Requiem Aeternam', slug: 'requiem-aeternam', categoryId: catSuffragio.id,
      originalText: 'Dona loro il riposo eterno, o Signore,\ne splenda ad essi la luce perpetua.\nRiposino in pace.\nAmen.',
      latinText: 'Requiem aeternam dona eis, Domine,\net lux perpetua luceat eis.\nRequiescant in pace.\nAmen.',
      isLiturgical: true, sortOrder: 1, isPublished: true,
    }}),
    prisma.prayer.upsert({ where: { slug: 'de-profundis' }, update: {}, create: {
      title: 'De Profundis (Salmo 130)', slug: 'de-profundis', categoryId: catSuffragio.id,
      originalText: 'Dal profondo a te grido, o Signore;\nSignore, ascolta la mia voce.\nSiano i tuoi orecchi attenti\nalla voce della mia supplica.\nSe consideri le colpe,\nSignore, chi potrà resistere?\nMa presso di te è il perdono,\ne così avremo il tuo timore.\nIo spero nel Signore,\nl\'anima mia spera nella sua parola.',
      isLiturgical: true, sortOrder: 2, isPublished: true,
    }}),
  ])

  // ── MASS SCHEDULES (Navan) ────────────────────────────────────
  console.log('  Mass Schedules...')
  for (const [day, time] of [[0,'09:00'],[0,'11:30'],[6,'18:00'],[1,'08:00'],[3,'08:00'],[5,'08:00']]) {
    await prisma.massSchedule.create({
      data: { parishId: parishNavan.id, dayOfWeek: day as number, time: time as string, rite: MassRite.ROMANO },
    }).catch(() => {})
  }

  console.log('\n✅ Seed completato!')
  console.log('   - 8 lingue')
  console.log('   - 8 nazioni')
  console.log('   - 8 città')
  console.log('   - 5 ordini religiosi')
  console.log('   - 1 parrocchia (Navan)')
  console.log('   - 1 cappella con 2 live stream')
  console.log('   - 3 miracoli eucaristici')
  console.log('   - 1 pellegrinaggio (Fátima)')
  console.log('   - 5 categorie preghiere')
  console.log('   - 5 preghiere')
  console.log('   - 6 orari messe')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
