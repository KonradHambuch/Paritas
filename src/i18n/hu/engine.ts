/**
 * Calculator OUTPUT strings, Hungarian.
 *
 * Hungarian has a single plural form and takes no plural after a numeral, so
 * several of these functions are simpler than their English counterparts —
 * "2 ügylet", never "2 ügyletek". That is exactly why the engine emits keys
 * and params rather than assembled sentences.
 */

export const engine = {
  category: {
    tp: 'Transzferár',
    usFiling: 'USA bevallás',
    governance: 'Szabályozás',
  },

  flow: {
    dev: 'Fejlesztési szolgáltatások',
    mgmt: 'Menedzsmentszolgáltatások',
    loan: 'Kölcsönök',
    ip: 'Szellemitulajdon-jogdíj',
  },

  flowIndicative: {
    dev: 'Fejlesztési szolgáltatások (tájékoztató)',
    mgmt: 'Menedzsmentszolgáltatások (tájékoztató)',
    loan: 'Kölcsönök (kamat ≈5%, tájékoztató)',
    ip: 'Szellemitulajdon-jogdíj (tájékoztató)',
  },

  tag: {
    localFileMandatory: 'Helyi dokumentum + benchmark kötelező',
    roFileMandatory: 'Dokumentáció kötelező / felszólításra',
    planDocumentation: 'Közelít — tervezd a dokumentációt',
    armsLengthStillApplies: 'A szokásos piaci ár így is kötelező',
    manualVerification: 'Kézi ellenőrzés szükséges',
    defenseFileRecommended: 'Védelmi dokumentáció ajánlott',
    irsPenaltyPerFormYear: 'Fix IRS-bírság nyomtatványonként / évente',
    planWithFlip: 'Tervezd az áthelyezéssel együtt',
    fixFirst: 'Először ezt — napok, nem hetek',
    verifyOnCall: 'Ellenőrizzük az egyeztetésen',
    setUpBeforeFlow: 'Állítsd be, mielőtt pénz mozdul',
    youSaveTheBenchmark: 'Megspórolod a benchmark díját',
  },

  oblig: {
    overThreshold: (p: { country: string; flow: string; value: string; pct: string }) =>
      `${p.country} · ${p.flow} — ${p.value} = az értékhatár ${p.pct}-a`,
    overThresholdIndicative: (p: {
      country: string;
      flow: string;
      value: string;
      pct: string;
    }) => `${p.country} · ${p.flow} — ${p.value} = az értékhatár ${p.pct}-a`,
    approaching: (p: { country: string; flow: string; pct: string }) =>
      `${p.country} · ${p.flow} — az értékhatár ${p.pct}-a`,
    underThreshold: (p: { country: string; flow: string; pct: string }) =>
      `${p.country} · ${p.flow} — az értékhatár ${p.pct}-a`,
    roFramework2026:
      'RO · a 2026-os dokumentációs szabályok adózóra, illetve ügyletre szabott ellenőrzést kívánnak',
    czBurdenOfProof:
      'CZ · Nincs jogszabályi helyi dokumentum — ellenőrzéskor viszont rád száll a bizonyítási teher',
    usFormsUnfiled: (p: { years: number }) =>
      `5471/5472-es nyomtatványok — ${p.years} év beadatlan`,
    usFormsAfterFlip:
      'Az 5471/5472 az áthelyezés utáni első bevallással együtt esedékes',
    noAgreement:
      'Nincs aláírt, kapcsolt vállalkozások közötti szerződés az élő pénzmozgások mögött',
    masterFileTrigger:
      'A cégcsoport mérete indokolja a fődokumentum (Master File) küszöbeinek ellenőrzését (PL: 200 M PLN konszolidált; HU: 500 M HUF dokumentált összesített érték)',
    noFlows:
      'Nincs élő kapcsolt ügylet — a kötelezettségek az első átutalt euróval kezdődnek',
    plSmallExempt:
      'Lengyel mikro-/kisvállalkozás — mentesül a kötelező összehasonlító elemzés alól. A helyi dokumentum továbbra is kötelező, a benchmark nem.',
  },

  exp: {
    plAdjustment: (p: { amount: string }) => `PL korrekciós kockázat ${p.amount}`,
    plFiscal: (p: { amount: string }) => `PL adóbüntetőjogi kockázat kb. ${p.amount}`,
    huPenalty: (p: { count: number; amount: string }) =>
      `HU mulasztási bírság ${p.count} nyilvántartásra ${p.amount}`,
    roAssessment: (p: { amount: string }) => `RO megállapítási kockázat ${p.amount}`,
    czAudit: (p: { amount: string }) => `CZ ellenőrzési kockázat kb. ${p.amount}`,
    usForms: (p: { amount: string }) => `USA 5471/5472 bírságok ${p.amount}`,
    noAgreement: (p: { amount: string }) =>
      `dokumentálatlan finanszírozás átminősítése kb. ${p.amount}`,
  },

  deadline: {
    'pl.localFile': 'PL helyi dokumentum',
    'pl.tpr': 'PL TPR-bevallás',
    'hu.localFile': 'HU helyi dokumentum + társaságiadó-bevallási adatok',
    'ro.onRequest': 'RO dokumentáció — felszólításra, 30–60 nap',
    'us.forms': 'USA bevallás + 5471/5472-es nyomtatványok',
    onRequest: 'már most készen kell állnia',
    daysLeft: (p: { days: number }) => `${p.days} nap van hátra`,
    daysOverdue: (p: { days: number }) => `${p.days} napja lejárt`,
  },

  quote: {
    localFile: (p: { country: string; count: number }) =>
      `${p.country} helyi dokumentum (${p.count} ügylet)`,
    czDefense: 'CZ ellenőrzés-védelmi dokumentáció',
    benchmark: (p: { count: number }) =>
      `Összehasonlító elemzés (${p.count} db, közép-kelet-európai adatbázisból, átfedések nélkül)`,
    benchmarkNotRequired: 'Benchmark — a méretedhez nem kötelező (kihagytuk)',
    firstYearSetup: 'Első évi beállítás (szerződések, funkcionális elemzés)',
    starter: 'TP Starter — szerződés, árazási politika és haszonkulcs',
    starterLight: 'Transzferár-politika + adatbázisos benchmark (Starter-light)',
    pack5471: '5471/5472 adatcsomag (1. év)',
    flipReady: 'Flip-Ready TP — szellemitulajdon-útvonal és első napi szerződések',
    midTierTypically: (p: { range: string }) => `közepes cégnél jellemzően ${p.range}`,
    bundleWithDd: 'az imént futtatott átvilágítási ajánlat',
    bundleWithTp: 'az imént futtatott transzferár-ajánlat',
    bundleSuffix: '— a két termék együtt, −15%',
  },

  reco: {
    flipPlanned: {
      title: 'Ajánlott: Áthelyezés utáni csomag — 13 500 €',
      body: 'Az áthelyezésed még nem zárult le: ez a legolcsóbb pillanat, amikor a szellemitulajdon-útvonalat, az első napi szerződéseket és az amerikai bevallásokat rendezni tudod. Az ablak egy árazott befektetési kör után véglegesen szűkül.',
    },
    localFile: {
      title: 'Ajánlott: helyi dokumentum csomag + nyomonkövetés',
      body: 'Legalább egy ügylet átlépte az értékhatárt — a dokumentáció kötelező, és a fenti kockázat a díj többszöröse. A nyomonkövetés minden további ügyletet figyel, hogy a következő értékhatár ne érjen meglepetésként.',
    },
    czDefense: {
      title: 'Ajánlott: cseh védelmi dokumentáció + nyomonkövetés',
      body: 'Csehországban nincs benyújtási értékhatár, ami két irányban is vág: ellenőrzésig semmi nem esedékes, az ellenőrzés napján viszont minden. A védelmi dokumentáció visszafordítja a bizonyítási terhet a te javadra.',
    },
    starter: {
      title: 'Ajánlott: TP Starter — 3 500 €-tól',
      body: 'Minden értékhatár alatt vagy, de a szokásos piaci ár elve az első eurótól alkalmazandó. A Starter akkor teszi helyére a szerződést, az árazási politikát és a haszonkulcsot, amikor ez még olcsó és nyugodt.',
    },
    preSetup: {
      title: 'Ajánlott: állítsd be az első átutalás előtt',
      body: 'Ha még nincs ügylet, kockázat sincs — a legolcsóbb megfelelés az, amelyet még a pénzmozgás előtt terveznek meg.',
    },
  },

  method: {
    dev: {
      name: 'Fejlesztési / K+F szolgáltatások',
      method: 'TNMM (költség plusz)',
      party: 'Közép-kelet-európai leányvállalat',
      pli: 'Teljes költségre vetített haszonkulcs (jellemzően 5–10%)',
    },
    mgmt: {
      name: 'Menedzsment / adminisztratív szolgáltatások',
      method:
        'Költség plusz (vizsgáld az alacsony hozzáadott értékű szolgáltatások mentesülését)',
      party: 'Szolgáltatásnyújtó',
      pli: 'Költségekre vetített haszonkulcs (kb. 5%)',
    },
    loan: {
      name: 'Kapcsolt vállalkozásnak nyújtott kölcsön',
      method: 'CUP — kamatbenchmark (először a lengyel safe harbour)',
      party: 'Adós / hitelező',
      pli: 'Kamatfelár',
    },
    ip: {
      name: 'Szellemitulajdon-jogdíj / licenc',
      method: 'CUT/CUP, ha elérhető, egyébként TNMM/reziduális',
      party: 'Licencbe vevő',
      pli: 'Jogdíj az árbevétel %-ában',
    },
  },

  ddScopeName: {
    rf: 'Red-Flag átvilágítás',
    a: 'Pénzügyi átvilágítás (A-kör)',
    b: 'Teljes körű FDD (B-kör)',
  },

  dd: {
    factor: {
      entities: (p: { count: number }) => `× gazdálkodó egységek (${p.count})`,
      revenue: '× árbevételi sáv',
      accounts: '× beszámoló minősége',
      dataRoom: '× adatszoba',
      model: '× bevételi modell',
      consolidation: '× konszolidáció újraépítése',
      capTable: (p: { count: number }) =>
        `× tulajdonosi instrumentumrétegek (${p.count})`,
      rush: '× sürgősség (<2 hét)',
    },
    addon: {
      tpModule: '+ Transzferár mélyelemzési modul',
      taxDd: '+ Teljes körű adóátvilágítás (partner adótanácsadók, országonként)',
      taxDdPrice: '4 000–8 000 €',
      recognizedFirm: '+ Elismert cég általi felülvizsgálat',
    },
  },
};
