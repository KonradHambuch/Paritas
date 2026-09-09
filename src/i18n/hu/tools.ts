export const tools = {
  eyebrow: 'Eszközök',
  heading: 'Négy ingyenes kalkulátor.',
  lede: 'Regisztráció nélkül, azonnal. Tájékoztató jellegűek — de valós számokkal dolgoznak.',

  mail: {
    lead: 'Bővebben, PDF-ben',
    placeholder: 'e-mail cím',
    send: 'Küldés',
    pending: 'Hamarosan — az útmutatók készülnek.',
    docs: {
      tp: { title: 'Transzferár útmutató', pages: '4 oldal' },
      valuation: { title: 'Cégeladási útmutató', pages: '3 oldal' },
      readiness: { title: 'Átvilágítási útmutató', pages: '3 oldal' },
      tax: { title: 'Adóvisszaszerzési útmutató', pages: '3 oldal' },
    },
  },

  /* ── 01 · transzferár ──────────────────────────────────────── */
  tp: {
    num: '01 — Transzferár',
    h: 'Van dokumentációs kötelezettsége?',
    p: 'A magyar transzferár-dokumentációt ügylettípusonként, adóévenként, {threshold} felett kell elkészíteni.',
    rowsLabel:
      'Vigye fel a kapcsolt vállalkozásokkal kötött ügyleteit — típusonként, éves értékkel',
    add: '+ Ügylet hozzáadása',
    remove: 'Sor törlése',
    valuePlaceholder: 'éves érték, Ft',
    types: {
      loan: 'Kölcsön / finanszírozás',
      management: 'Vezetői / menedzsment szolgáltatás',
      products: 'Termékértékesítés',
      otherService: 'Egyéb szolgáltatás',
      royalty: 'Jogdíj / licencdíj',
      costRecharge: 'Költségátterhelés',
      intangibles: 'Immateriális javak átadása',
    },
    disclaimerLead: 'Ezek a példák magyar vállalkozásokra vonatkoznak.',
    disclaimerBody:
      'A CEE-régió többi országában és Európa más részein más értékhatárok, más határidők és más bírságtételek érvényesek. Brazíliában és Szaúd-Arábiában a transzferár-szabályozást nemrég vezették be, és a bírságolás már elkezdődött — egy magyar anyacég leányvállalata ott is kötelezett lehet.',
    disclaimerTail:
      'Az értékhatár összevont ügyletenként, adóévenként, szokásos piaci áron, áfa nélkül értendő. A szabályok változnak — ellenőrizze a hatályos jogszabályt.',
    result: {
      required: 'Dokumentációs kötelezettség',
      notRequired: 'Nincs dokumentációs kötelezettség',
      thresholdNote: 'Értékhatár: {threshold} összevont ügyletenként',
      colTransaction: 'Összevont ügylet',
      colValue: 'Éves érték',
      colDocumentation: 'Dokumentáció',
      yes: 'Kell',
      no: 'Nem kell',
      total: 'Összes kapcsolt ügylet',
      masterYes: 'Fődokumentum is kell ({masterFile} felett)',
      masterNo: 'Fődokumentum nem kell ({masterFile} alatt)',
      penalty: 'Bírságkockázat',
      penaltyNote:
        'ügyletenként és dokumentumonként, ismételt mulasztásnál {penaltyRepeat} — a tételek összeadódnak',
      deadline:
        'Határidő: a társasági adóbevallás benyújtásáig, naptári éves adózónál május 31.',
      aggregationNote:
        'Az azonos típusú ügyletek értékét össze kell adni. A kalkulátor ezt automatikusan megteszi.',
      armsLength:
        'Dokumentumot nem kell készíteni, de a szokásos piaci árat így is alkalmazni kell, és igazolni kell tudni.',
      empty: 'Adjon meg legalább egy ügyletet.',
    },
  },

  /* ── 02 · cégérték ─────────────────────────────────────────── */
  valuation: {
    num: '02 — Cégérték',
    h: 'Mennyit ér a cége?',
    p: 'Válasszon ágazatot, és a kalkulátor megmutatja, milyen logika szerint érdemes értékelni — nem minden céget az eredménye alapján áraznak.',
    sectorLabel: 'Ágazat',
    selectSector: 'Válasszon ágazatot',
    debtLabel: 'Nettó adósság (hitelek mínusz készpénz, Ft)',
    sectors: {
      svc: 'Szolgáltatás',
      prod: 'Gyártás',
      trade: 'Kereskedelem',
      it: 'IT / szoftver',
      saas: 'SaaS / előfizetéses',
      constr: 'Építőipar',
      health: 'Egészségügy',
      realest: 'Ingatlan / eszközintenzív',
      holding: 'Holding / vagyonkezelés',
      other: 'Egyéb',
    },
    methodLabel: {
      ebitda: 'EBITDA-alapú értékelés',
      revenue: 'Árbevétel-alapú értékelés',
      asset: 'Eszközalapú értékelés',
    },
    methodWhy: {
      ebitda: 'Ennél az ágazatnál a vevők a fenntartható éves eredményt árazzák.',
      revenue:
        'Előfizetéses modellnél a visszatérő árbevétel a mérvadó, mert az eredmény még növekedésbe van forgatva.',
      asset:
        'Eszközintenzív cégnél a mérleg dönt, nem az eredmény: az érték az eszközök piaci értékéből indul.',
    },
    baseLabel: {
      ebitda: 'Éves EBITDA (Ft)',
      revenue: 'Éves visszatérő árbevétel (Ft)',
      asset: 'Eszközök becsült piaci értéke (Ft)',
    },
    unit: {
      ebitda: '× EBITDA',
      revenue: '× árbevétel',
      asset: '× eszközérték',
    },
    result: {
      heading: 'Indikatív cégérték-tartomány',
      multiple: 'Alkalmazott szorzó',
      enterprise: 'Vállalati érték',
      equity: 'Tulajdonosi érték',
      note: 'Tulajdonosi érték = vállalati érték − nettó adósság',
      negativeNote:
        'A tartomány alsó szélén a nettó adósság meghaladja a vállalati értéket, így a tulajdonosi érték negatív. Egy eladásnál ez rendszerint azt jelenti, hogy az adósságot a vételárból rendezik, vagy változtatni kell a struktúrán.',
      adjusts: 'Ami ezt jelentősen mozgatja',
      f1: '<b>Ügyfélkoncentráció.</b> Ha egy vevő adja az árbevétel több mint 30%-át, a szorzó tipikusan egy egész ponttal csökken.',
      f2: '<b>Tulajdonosi függőség.</b> Ha a cég a tulajdonos nélkül nem működik, akkor nem céget ad el, hanem állást. Ez a legnagyobb egyedi árcsökkentő tényező.',
      f3: '<b>A bevétel megismételhetősége.</b> Szerződött, visszatérő bevétel felfelé húz. Projektről projektre élő üzlet lefelé.',
      f4: '<b>A számok valódisága.</b> Ha az eredmény adóoptimalizálás miatt lejjebb van, mint a valóság, azt bizonyítani kell — különben a vevő azt árazza, amit lát.',
      f5: '<b>Rendezettség.</b> Hiányzó szerződés, személyes tulajdonban lévő céges eszköz, dokumentálatlan kapcsolt ügylet — mind az árban jelenik meg.',
      demo: 'Ez a kalkulátor egy leegyszerűsített demonstráció arról, hogy milyen logika mentén lehet egy első becslést adni. A valós cégérték a cég részletes megismerésével állapítható meg: a pénzügyi kimutatások, a szerződések, az ügyfélszerkezet és a piac vizsgálatával.',
    },
  },

  /* ── 03 · átvilágítási felkészültség ───────────────────────── */
  readiness: {
    num: '03 — Átvilágítás',
    h: 'Kibírná a cége egy átvilágítást?',
    p: 'Tíz kérdés, amit egy vevő vagy befektető úgyis feltesz — súlyozva aszerint, hogy melyik mennyit számít az árban.',
    yes: 'Igen',
    no: 'Nem',
    disclaimer:
      'Ez nem átvilágítás, hanem önellenőrzés. A valós folyamat dokumentumok vizsgálatán alapul.',
    questions: {
      accountsReal:
        'Az elmúlt három év beszámolója elkészült, és a kimutatott eredmény a valós működést tükrözi?',
      ownerIndependence: 'Működne a cég három hónapig a tulajdonos nélkül?',
      concentration:
        'Tudja, hogy a legnagyobb vevője az árbevétel hány százalékát adja?',
      customerContracts: 'A legnagyobb öt vevővel írásos, hatályos szerződés van?',
      assetsOwned:
        'A cég működéséhez szükséges eszközök és a márkanév a cég tulajdonában vannak, nem a tulajdonoséban?',
      employmentContracts:
        'Minden munkavállalóval és tartós alvállalkozóval rendezett, írásos szerződés van?',
      relatedParty: 'A kapcsolt vállalkozásokkal kötött ügyletek dokumentálva vannak?',
      loans: 'Naprakész a hitel-, kezesség-, garancia- és zálognyilvántartás?',
      ownership:
        'Rendezett és naprakész a tulajdonosi szerkezet, nincs vitatott részesedés?',
      disputes:
        'Nincs folyamatban lévő vagy fenyegető per, illetve hatósági eljárás — vagy ha van, dokumentált?',
    },
    why: {
      accountsReal:
        'Ha az eredmény adóoptimalizálás miatt alacsonyabb a valóságosnál, azt bizonyítani kell. Amit nem tud bizonyítani, azt a vevő nem fizeti meg.',
      ownerIndependence:
        'Ez a legnagyobb egyedi árcsökkentő tényező. Ha a cég a tulajdonoson múlik, akkor nem céget ad el, hanem állást.',
      concentration:
        '30% felett a szorzó tipikusan egy egész ponttal csökken. A vevő ezt öt perc alatt kiszámolja.',
      customerContracts:
        'Szerződés nélküli bevétel a vevő szemében nem átvihető bevétel.',
      assetsOwned:
        'Magyar KKV-knál ez a leggyakoribb rejtett probléma: az ingatlan, az autó vagy a védjegy magánszemély nevén van.',
      employmentContracts:
        'A bújtatott munkaviszony visszamenőleges járulékkockázat, és a vevő ezt le fogja árazni.',
      relatedParty:
        'Dokumentálatlan kapcsolt ügylet egyszerre adókockázat és tranzakciós kockázat.',
      loans:
        'A rejtett kötelezettség az egyetlen dolog, ami egy már megkötött ügyletet is fel tud bontani.',
      ownership: 'Egy tisztázatlan tulajdonrész hónapokkal tolja el a zárást.',
      disputes: 'Nem az a baj, ha van. Az a baj, ha az átvilágításon derül ki.',
    },
    result: {
      score: 'Átvilágítási felkészültség',
      ready: 'Átvilágításra kész',
      mostly: 'Nagyrészt rendben, néhány hiánnyal',
      gaps: 'Jelentős hiányok — érdemes ezekkel kezdeni',
      costly: 'Jelen állapotban az átvilágítás árat fog csökkenteni',
      gapHeading: 'Amin dolgozni kell — súlyosság szerint',
      none: 'Nincs feltárt hiány. Ez ritka.',
      points: 'pont',
      note: 'A hiányzó tételek ritkán akadályozzák meg az ügyletet. De lassítják, és tipikusan az árban vagy a szerződéses garanciákban jelennek meg — vagyis a hiányt így is kifizeti, csak drágábban.',
      progress: '{answered} / {total} megválaszolva',
    },
  },

  /* ── 04 · adóvisszaszerzés ─────────────────────────────────── */
  tax: {
    num: '04 — Adóvisszaszerzés',
    h: 'Mennyi adót fizetett feleslegesen?',
    p: 'Az iparűzési adó alapjából több tétel is levonható — de csak szigorú feltételekkel. Ami emiatt bennragadt, öt évre visszamenőleg visszahozható.',
    revenueLabel: 'Éves nettó árbevétel (Ft)',
    revenuePlaceholder: 'pl. 1 200 000 000',
    sizeLabel: 'A cég mérete',
    sizes: { sme: 'KKV (250 fő alatt)', large: 'Nagyvállalat (250 fő felett)' },
    subLabel: 'Ebből alvállalkozói és továbbszámlázott költség (Ft)',
    subPlaceholder: 'pl. 300 000 000',
    rdLabel: 'Éves K+F jellegű ráfordítás (Ft)',
    rdPlaceholder: 'pl. 40 000 000',
    disclaimer:
      'Magyar iparűzési adóra és innovációs járulékra vonatkozó becslés. A tényleges visszaszerezhető összeg a szerződések és a számlázás vizsgálatától függ — a levonás feltételei szigorúak, és pontosan ezért marad bent a pénz.',
    result: {
      heading: 'Becsült visszaszerezhető összeg',
      base: 'Adóalap-csökkentési lehetőség évente',
      capped:
        'Korlátozva: a megadott költségek meghaladják azt, ami ehhez az árbevételhez hihető.',
      rate: 'Alkalmazott adókulcs',
      annual: 'Éves megtakarítás',
      total: '{years} évre visszamenőleg',
      note: 'Az önellenőrzés Magyarországon öt évre visszamenőleg lehetséges. A tartomány azt tükrözi, hogy a tételek egy része dokumentációs okból nem érvényesíthető.',
      what: 'Hol szokott bennragadni a pénz',
      w1: '<b>Alvállalkozói teljesítés.</b> Levonható az iparűzési adó alapjából — de csak akkor, ha a megrendelővel és az alvállalkozóval is írásos vállalkozási szerződés van. Ez a feltétel bukik el a leggyakrabban.',
      w2: '<b>Közvetített szolgáltatás.</b> Szintén levonható — de a szerződésből a közvetítés lehetőségének, a számlából a tényének ki kell derülnie. Ha a számlán nem szerepel, hogy közvetített szolgáltatást tartalmaz, a levonás elveszik.',
      w3: '<b>K+F ráfordítás.</b> Csökkenti az iparűzési adó alapját, és külön társasági adókedvezmény is kapcsolódhat hozzá. Sok cég végez K+F-nek minősülő fejlesztést anélkül, hogy annak nevezné.',
      w4: '<b>Innovációs járulék.</b> Ugyanazon az adóalapon ül, mint az iparűzési adó. Ha az alap csökken, ez is csökken — a legtöbben erről elfeledkeznek.',
      w5: '<b>Anyagköltség és ELÁBÉ.</b> Rosszul besorolt tételek, amelyek levonhatók lennének.',
      empty: 'Adja meg az árbevételt és a levonható jellegű költségeket.',
    },
  },
};
