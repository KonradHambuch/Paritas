# Magyar szakmai szószedet

Ezeket a megfeleltetéseket használjuk végig. Ha bármelyiket megváltoztatod,
keresd meg minden előfordulását a `src/i18n/hu/` alatt — a következetlen
terminológia egy transzferár- és tranzakciós tanácsadónál önmagát cáfolja.

| Angol | Magyar | Megjegyzés |
|---|---|---|
| transfer pricing | transzferár / transzferárazás | |
| transfer pricing documentation | transzferár-nyilvántartás | a Tao. tv. és az NGM rendelet szóhasználata |
| local file | helyi dokumentum (local file) | első előforduláskor zárójelben az angol |
| master file | fődokumentum (master file) | |
| arm's length | szokásos piaci ár | nem „karnyújtásnyi távolság" |
| benchmark study | összehasonlító elemzés | a „benchmark" megtartható, a piac így ismeri |
| related party | kapcsolt vállalkozás | |
| aggregated transaction | összevont ügylet | |
| threshold | értékhatár | |
| default penalty | mulasztási bírság | |
| tax base adjustment | adóalap-korrekció | |
| late payment interest | késedelmi pótlék | |
| due diligence | átvilágítás | a csapat-szekcióban megmarad angolul, mert a piac így hívja |
| data room | adatszoba | |
| information memorandum | információs memorandum | |
| teaser | teaser | bevett angol kifejezés |
| cap table | tulajdonosi és részesedési nyilvántartás | rövidebb helyen „tulajdonosi szerkezet" |
| enterprise value | vállalati érték (EV) | |
| equity value | tulajdonosi érték | |
| net debt | nettó adósság | hitelek mínusz készpénz |
| EBITDA multiple | EBITDA-szorzó | |
| working capital | forgótőke | |
| revenue quality | bevételi minőség | |
| customer concentration | ügyfélkoncentráció | |
| owner dependence | tulajdonosi függőség | |
| warranties | garanciák | szerződéses garanciák értelemben |
| closing | zárás | |
| integration | integráció | |

## Amit át kell nézetni

A `src/i18n/hu/content.ts` **`footer.fine`** bekezdése rögzíti, hogy a
kalkulátorok nem minősülnek adó-, jogi vagy befektetési tanácsadásnak, és hogy
engedélyhez kötött tevékenységet megfelelő engedéllyel rendelkező szakértő
végez. Magyarországon az adótanácsadói tevékenység nyilvántartáshoz kötött,
ezért ezt a bekezdést érdemes átnézetnie annak, aki a felelősségi
megfogalmazásért felel.

Ha a magyar és az angol változat között eltérés maradna, a
`footer.governingLanguage` kulcs erre való — jelenleg mindkét nyelven üres,
tehát nem jelenik meg.

## A forrásfájlokban talált és javított hibák

A küldött referencia-HTML-ekből a portolás során ezeket javítottuk:

- **Kettősen kódolt UTF-8** a kalkulátorok szövegeiben
  (`DokumentÃ¡ciÃ³s kÃ¶telezettsÃ©g`, `Ã¼gyletenkÃ©nt`, és a gondolatjel
  helyén `â`). A `tests/i18n.test.ts` mostantól elbukik, ha ilyen visszakerül.
- **Cirill karakter latin szóban** a magyar oldalon: `val&oacute;szÃ­n&#369;`,
  `a jÃ³ szerz&#337;d&eacute;s`, `AdÃ³&aacute;raz&aacute;s`.
- **Elgépelés:** „az &uuml;glete" → „az ügylete".
- **Nyelvenként eltérő horgonyok** (`#services` kontra `#szolgaltatasok`),
  amitől a nyelvváltó nem tudta volna megőrizni az olvasó helyét.
- **Mobilon eltűnő navigáció** — a `nav{display:none}` 820 px alatt menü nélkül
  hagyta az oldalt.
- **Nem használt konstansok:** a `TP_MASTER` és a `TP_RECHARGE` deklarálva volt,
  de a szövegbe kézzel volt beírva az 500 millió forint. Most mindkettő a
  konfigurációból jön.
