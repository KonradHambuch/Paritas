export const tpCalc = {
  tag: '1. kalkulátor · Transzferárazás',
  heading: 'A transzferár-kötelezettségeid, kockázatod és árad — most azonnal.',
  lede: 'Válaszolj őszintén; semmit nem tárolunk, amíg nem kéred a jelentést. Az eredmények közzétett értékhatárokon alapuló, tájékoztató jellegű becslések — nem adótanácsadás; a végleges ajánlat egy 20 perces hívás után rögzül.',

  step1: '1 · A cégcsoport anyavállalata',
  parent: {
    us: 'USA (Delaware flip)',
    foreign: 'Egyéb külföldi',
    cee: 'Közép-kelet-európai / belföldi',
    planned: 'Tervezett amerikai áthelyezés',
  },
  flipYears: 'Hány éve jött létre az amerikai anyavállalat',

  step2: '2 · Országok, ahol a cégcsoport tagjai működnek',
  countries: { PL: 'Lengyelország', HU: 'Magyarország', CZ: 'Csehország', RO: 'Románia' },

  step3: '3 · Kapcsolt ügyletek — éves érték, EUR',
  flows: {
    dev: 'Fejlesztési / K+F szolgáltatások',
    mgmt: 'Menedzsment / adminisztratív szolgáltatások',
    loan: 'Kapcsolt vállalkozásnak nyújtott kölcsön (tőkeösszeg)',
    ip: 'Szellemitulajdon-jogdíj / licenc',
  },
  flowsHint:
    'Az értékhatárokat ügyletenként és országonként vizsgáljuk — Lengyelországban ráadásul külön a beszerzési és az értékesítési oldalon, ezért ha ugyanazt a szolgáltatástípust nyújtod is és igénybe is veszed, add meg mindkét irányt külön összegként. A romániai kölcsönvizsgálat becsült éves kamattal számol (a tőkeösszeg kb. 5%-a).',

  step4: '4 · A legnagyobb közép-kelet-európai társaság éves árbevétele',
  revenue: { a: '< 2 M€', b: '2–10 M€', c: '10–25 M€', d: '> 25 M€' },

  step5: '5 · Vállalkozásméret (Lengyelország — befolyásolja, kötelező-e a benchmark)',
  smallCo: {
    yes: '50 főnél kevesebb és 10 M€ alatti árbevétel',
    no: 'Nagyobb, vagy nem tudom',
  },
  smallCoHint:
    'A lengyel mikro- és kisvállalkozások mentesülnek a kötelező összehasonlító elemzés alól — a helyi dokumentum továbbra is kötelező, de a benchmark nem. Ha ez rád igaz, ezt kimondjuk, és az ár csökken.',

  step6: '6 · Mi létezik már papíron?',
  have: {
    agreement: 'Aláírt, kapcsolt vállalkozások közötti szerződés',
    benchmark: 'Összehasonlító (benchmark) elemzés',
    localFile: 'Helyi dokumentum (aktuális)',
    forms5471: 'Beadott 5471/5472-es amerikai nyomtatványok',
    dataRoom: 'Rendezett adatszoba',
  },

  step7: '7 · Időzítés',
  fyEnd: 'Üzleti év vége (az az év, amelyet dokumentálni kell)',
  urgency: {
    rush: 'Határidő / befektetési kör < 6 hét',
    quarter: 'Ebben a negyedévben',
    none: 'Nem sürgős',
  },

  run: 'Transzferár-kötelezettségek és ajánlat kiszámítása →',

  results: {
    obligationsTitle: 'Feltételezett kötelezettségek — kategóriánként jelölve',
    obligationsEmpty:
      'Indítsd el a kalkulátort, és megmutatjuk, mit jeleznek a közzétett szabályok országonként — transzferár-dokumentáció, amerikai bevallási kötelezettségek és szabályozási hiányosságok, mindegyik megjelölve.',
    deadlinesTitle: 'A határidőid',
    deadlinesEmpty: 'A határidők az üzleti év végéből számolódnak.',
    deadlinesNone:
      'Ezekből az adatokból nem keletkezik benyújtási határidő — a szokásos piaci ár elve azonban egész évben alkalmazandó.',
    exposureTitle: 'Szemléltető kockázati sáv mai ellenőrzés vagy átvilágítás esetén',
    exposureSub:
      'Transzferár-korrekciós kockázat + dokumentációs bírságok + fix amerikai nyomtatványbírságok',
    exposureSubEmpty:
      'a kockázat az első dokumentálatlan ügylettel kezd halmozódni',
    exposureNone: '0 € — egyelőre',
    exposureManual: 'Egyedi felmérés szükséges',
    quoteTitle: 'Transzferár-ajánlat — fix díj, a közepes cégek árszintje alatt',
    quoteEmpty:
      'A tételes transzferár-ajánlatod itt jelenik meg, mellette az ugyanerre a hatókörre jellemző közepes céges díjjal.',
    quoteNoScope: 'A megadott adatokból nem azonosítható transzferár-feladat.',
    quoteOutOfScope:
      'Az ügyleteid értéke meghaladja azt a sávot, amelyet ez az önkiszolgáló becslő megbízhatóan áraz — ilyen méretnél egyedileg felmért ajánlat kell, nem kalkulátorszám. A fenti kötelezettségek és határidők ettől még érvényesek; küldd el őket nekünk, és egy munkanapon belül fix díjat kapsz.',
    quoteTotal: 'Transzferárazás — összesen',
    footnote:
      'Az összehasonlító sáv közzétett díjsávokat és olyan ajánlatokat tükröz, amelyeket ügyfeleink azonos hatókörre kapnak nemzetközi, közepes méretű cégektől. Ez tájékoztatás, nem az ő nevükben tett ajánlat — mindig kérj sajátot.',
    cta: 'Foglalom a 20 perces egyeztetést',
    methodTitle: 'Benchmarkolási módszer ügyletenként',
    methodFootnote:
      'Az alkalmazandó módszer, a vizsgált fél és a jövedelmezőségi mutató ügyletenként — ezt fogja alkalmazni az összehasonlító elemzésed. Tájékoztató jellegű; az egyeztetésen véglegesítjük.',
    failure:
      'Valami hiba történt a számítás közben — módosítsd az adatokat, vagy küldd el nekünk emailben a számokat, és kézzel adunk ajánlatot.',
    status:
      '{obligations} kötelezettség, {deadlines} határidő. Tájékoztató ajánlat: {quote}. A részletek alább következnek.',
    statusNoQuote:
      '{obligations} kötelezettség, {deadlines} határidő. Nincs beárazható transzferár-feladat.',
  },
};

export const ddCalc = {
  tag: '2. kalkulátor · Átvilágítás',
  heading: 'Árazz be egy pénzügyi átvilágítást hatvan másodperc alatt.',
  lede: 'Alapoknak, akik élő ügyletet áraznak, és alapítóknak, akik az eladóoldali felkészülést tervezik. A pénzügyi átvilágítást beépített transzferár-vizsgálattal végig mi végezzük; a teljes körű adóátvilágítást partner adótanácsadókkal mérjük fel, és külön soron jelenik meg.',

  step1: '1 · Melyik oldalon állsz?',
  side: { buy: 'Vevőoldal (befektető)', sell: 'Eladóoldal (cég)' },

  step2: '2 · Hatókör',
  scope: {
    rf: 'Red-Flag átvilágítás (magvető kör)',
    a: 'Pénzügyi átvilágítás (A-kör)',
    b: 'Teljes körű FDD (B-kör)',
  },

  step3: '3 · A célpont',
  entities: 'Gazdálkodó egységek száma a csoportban',
  revenue: {
    a: 'Árbevétel < 1 M€',
    b: '1–3 M€',
    c: '3–10 M€',
    d: '10–25 M€',
    e: '> 25 M€',
  },

  step4: '4 · Adatminőség',
  accounts: {
    audited: 'Auditált beszámoló',
    reviewed: 'Átvilágított',
    neither: 'Egyik sem',
  },
  dataRoom: { organized: 'Rendezett adatszoba', partial: 'Részleges', none: 'Nincs' },

  step5: '5 · Összetettség',
  consolidation: 'A konszolidációt újra kell építeni',
  rush: 'A jelentés < 2 héten belül kell',
  layers:
    'Tulajdonosi szerkezet instrumentumrétegei (SAFE-ek, kölcsönök, opciók, fantom ESOP)',
  model: {
    saas: 'SaaS / tiszta ARR',
    usage: 'Használatalapú / piactér',
    hardware: 'Hardver / vegyes',
  },

  step6: '6 · Kiegészítők',
  addOns: {
    tp: 'Transzferár mélyelemzési modul (+2 500 €)',
    tax: 'Teljes körű adóátvilágítás partnerrel (+4–8 e€, országonként árazva)',
    stamp: 'Elismert cég általi felülvizsgálat (+40–70%)',
  },

  run: 'Átvilágítási ajánlat kiszámítása →',

  results: {
    quoteTitle: 'Átvilágítási ajánlat — tényezőnkénti bontás',
    quoteEmpty:
      'Az átvilágítási ajánlatod itt jelenik meg, minden árazási tényezővel láthatóan — nincs fekete doboz.',
    feeLabel: '{scope} — a mi díjunk',
    baseLabel: '{scope} — alapdíj',
    floorNote: 'minimumdíj alkalmazva',
    footnote:
      'Az összehasonlító sáv közzétett díjsávokat és olyan ajánlatokat tükröz, amelyeket ügyfeleink azonos hatókörre kapnak. Ez tájékoztatás, nem más cég nevében tett ajánlat.',
    cta: 'Kérem a fix ajánlatot és az ütemtervet',
    failure:
      'Valami hiba történt a számítás közben — módosítsd az adatokat, vagy küldd el nekünk emailben az ügylet vázlatát kézi ajánlatért.',
    status: 'Tájékoztató {scope} díj: {quote}. A tényezőnkénti bontás alább következik.',
    buyNote:
      '<b>Függetlenség:</b> vevőoldali megbízásnál nem járunk el egyidejűleg a célpont javára. Ha már készítjük az adott cég transzferár-dokumentációját, ezt a felmérés előtt feltárjuk, és te döntesz — általában visszalépünk az átvilágítástól, és inkább átadjuk a transzferár-dokumentációnkat, ami neked amúgy is gyorsabb és olcsóbb. <b>Ki fizet:</b> a vevőoldali átvilágítást az alapnak számlázzuk, alapköltségként.',
    sellNote:
      '<b>Az eladóoldali felkészítés</b> előkészítés, nem bizonyosságot nyújtó szolgáltatás: felépítjük és megterheljük az adatszobádat azokkal az ellenőrzőlistákkal, amelyeket a befektetők ténylegesen használnak, és kijavítjuk, amit találunk. A cégnek számlázzuk, és nem helyettesíti a befektető saját átvilágítását.',
  },
};
