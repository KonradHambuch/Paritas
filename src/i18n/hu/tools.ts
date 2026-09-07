export const tools = {
  eyebrow: 'Eszközök',
  heading: 'Három ingyenes kalkulátor.',
  lede: 'Regisztráció nélkül, azonnal. Tájékoztató jellegűek — de valós számokkal dolgoznak.',

  /* ── 01 · transzferár ──────────────────────────────────────── */
  tp: {
    num: '01 — Transzferár',
    h: 'Van dokumentációs kötelezettsége?',
    p: 'A magyar transzferár-dokumentációt ügylettípusonként, adóévenként, {threshold} értékhatár felett kell elkészíteni.',
    relatedLabel: 'Kapcsolt vállalkozások a felek?',
    amountLabel: 'Az ügylet éves értéke (HUF)',
    amountPlaceholder: 'pl. 180 000 000',
    select: 'Válasszon',
    yes: 'Igen',
    no: 'Nem',
    disclaimer:
      'Az értékhatár ügylettípusonként, adóévenként, a szokásos piaci áron számított értékre vonatkozik, bizonyos ügyletek összevonásával. A szabályok változnak — kérjük, ellenőrizze a hatályos jogszabályt.',
    result: {
      over: 'Dokumentációs kötelezettség fennáll',
      under: 'Nincs dokumentációs kötelezettség',
      value: 'Ügyleti érték',
      threshold: 'Értékhatár',
      gap: 'Az értékhatár felett',
      remaining: 'Az értékhatárig hátra',
      need: 'Amit el kell készíteni',
      need1: 'Helyi dokumentum (local file) az adott összevont ügyletre',
      need2:
        'Fődokumentum (master file), ha az összes kapcsolt ügylet értéke meghaladja a(z) {masterFile} összeget',
      need3: 'Ügylet szintű adatszolgáltatás a társasági adóbevallásban',
      deadline: 'Határidő',
      deadlineValue:
        'a társasági adóbevallás benyújtásáig — naptári éves adózóknál május 31.',
      penalty: 'Mulasztási bírság kockázata',
      penaltyValue:
        'ügyletenként és dokumentumonként — ismételt mulasztás esetén {penaltyRepeat}. A tételek összeadódnak',
      adjustment: 'Adóalap-korrekció kockázata',
      adjustmentValue:
        'a korrekció utáni társasági adó, adóbírság és késedelmi pótlék',
      meta: 'A NAV a dokumentum létrehozási dátumát is ellenőrizheti. Utólagos elkészítés esetén a bírság automatikusan kiszabható.',
      armsLength: 'A szokásos piaci ár alkalmazása így is kötelező',
      armsLengthNote:
        'Dokumentumot nem kell készíteni, de az árat a szokásos piaci szinten kell tartani, és ezt tudni kell igazolni.',
      note: 'Az értékhatár összevont ügyletenként, szokásos piaci áron, áfa nélkül értendő.',
      simplified:
        'Költségátterhelés esetén {simplified} felett elegendő egyszerűsített helyi dokumentum.',
    },
  },

  /* ── 02 · cégérték ─────────────────────────────────────────── */
  valuation: {
    num: '02 — Cégérték',
    h: 'Mennyit ér a cége?',
    p: 'Indikatív tartomány EBITDA-szorzó alapján, magyar KKV-tranzakciós sávokkal.',
    sectorLabel: 'Ágazat',
    ebitdaLabel: 'Éves EBITDA (HUF)',
    ebitdaPlaceholder: 'pl. 80 000 000',
    debtLabel: 'Nettó adósság (hitelek mínusz készpénz, HUF)',
    debtPlaceholder: 'pl. 30 000 000',
    select: 'Válasszon',
    sectors: {
      svc: 'Szolgáltatás',
      prod: 'Gyártás',
      trade: 'Kereskedelem',
      it: 'IT / szoftver',
      constr: 'Építőipar',
      health: 'Egészségügy',
      other: 'Egyéb',
    },
    disclaimer:
      'Az EBITDA-szorzó ágazattól, mérettől, növekedéstől és a bevétel minőségétől függ. Egy valódi cégértékelés a pénzügyi kimutatások, a szerződések és a piac vizsgálatán alapul.',
    result: {
      heading: 'Indikatív cégérték-tartomány',
      multiple: 'Alkalmazott EBITDA-szorzó',
      enterprise: 'Vállalati érték (EV)',
      equity: 'Tulajdonosi érték',
      note: 'Tulajdonosi érték = vállalati érték − nettó adósság',
      negativeNote:
        'A tartomány alsó szélén a nettó adósság meghaladja a vállalati értéket, így a tulajdonosi érték negatív. Egy eladásnál ez rendszerint azt jelenti, hogy az adósságot a vételárból kell rendezni, vagy változtatni kell a struktúrán.',
      adjusts: 'Ami módosítja',
      f1: 'Ügyfélkoncentráció — ha egy vevő adja a bevétel több mint 30%-át, a szorzó csökken',
      f2: 'Tulajdonosi függőség — ha a cég a tulajdonos nélkül nem működik, a szorzó jelentősen csökken',
      f3: 'Növekedés és megismételhetőség — a visszatérő bevétel felfelé húz',
      f4: 'Rendezett beszámolók és szerződések — a rendetlenség mindig árat csökkent',
    },
  },

  /* ── 03 · átvilágítási felkészültség ───────────────────────── */
  readiness: {
    num: '03 — Átvilágítás',
    h: 'Kibírná a cége egy átvilágítást?',
    p: 'Tíz kérdés, amit egy vevő vagy befektető úgyis feltesz. A hiányzó tételek tipikusan az árban jelennek meg.',
    yes: 'Igen',
    no: 'Nem',
    disclaimer:
      'Ez nem átvilágítás, hanem önellenőrzés. A valós folyamat dokumentumok vizsgálatán alapul.',
    questions: {
      accounts: 'Az elmúlt három év beszámolója elkészült és elfogadták?',
      capTable: 'Van naprakész tulajdonosi és részesedési nyilvántartás?',
      contracts: 'Minden munkavállalóval és alvállalkozóval írásos szerződés van?',
      ip: 'A szellemi tulajdon írásban a cégre lett engedményezve?',
      customerContracts: 'A legnagyobb öt vevővel írásos, hatályos szerződés van?',
      concentration: 'Van kimutatás arról, hogy egy vevő a bevétel hány százalékát adja?',
      relatedParty: 'A kapcsolt vállalkozások közötti ügyletek dokumentálva vannak?',
      loans: 'Van naprakész hitel-, kezesség- és garancianyilvántartás?',
      disputes:
        'Folyamatban lévő vagy fenyegető per, hatósági eljárás nincs, vagy dokumentált?',
      ownerIndependence: 'A cég a tulajdonos nélkül is működne 3 hónapig?',
    },
    result: {
      score: 'Átvilágítási felkészültség',
      ready: 'Átvilágításra kész',
      mostly: 'Nagyrészt rendben, néhány hiánnyal',
      gaps: 'Jelentős hiányok',
      costly: 'Az átvilágítás jelen állapotban árcsökkentő lesz',
      gapHeading: 'Amin dolgozni kell',
      none: 'Nincs feltárt hiány.',
      note: 'A hiányzó tételek nem feltétlenül akadályozzák meg az ügyletet — de lassítják, és tipikusan az árban vagy a szerződéses garanciákban jelennek meg.',
      progress: '{answered} / {total} megválaszolva',
    },
  },
};
