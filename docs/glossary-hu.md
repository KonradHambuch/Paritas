# Magyar szakmai szószedet

A fordítás során végig ezeket a megfeleltetéseket használtuk. Ha bármelyiket
megváltoztatod, keresd meg minden előfordulását a `src/i18n/hu/` alatt — a
következetlen terminológia egy transzferár-cégnél önmagát cáfolja.

| Angol | Magyar | Megjegyzés |
|---|---|---|
| transfer pricing | transzferárazás | a szolgáltatás neve |
| transfer pricing documentation | transzferár-nyilvántartás | a Tao. tv. és a 32/2017. NGM rendelet szóhasználata |
| Local File | helyi dokumentum (Local File) | első előforduláskor zárójelben az angol |
| Master File | fődokumentum (Master File) | |
| arm's length principle | a szokásos piaci ár elve | **nem** „karnyújtásnyi távolság" |
| benchmark study / comparability analysis | összehasonlító elemzés | a „benchmark" megtartható, mert a piac így ismeri |
| related party | kapcsolt vállalkozás | |
| controlled transaction | ellenőrzött ügylet | |
| intercompany agreement | kapcsolt vállalkozások közötti szerződés | |
| due diligence | átvilágítás | a kockázatitőke-közönség az angolt is érti; a címekben magyar |
| financial due diligence | pénzügyi átvilágítás | |
| threshold | értékhatár | a „küszöbérték" is helyes, de következetesen az „értékhatár" van használva |
| tax authority audit | adóhatósági ellenőrzés | |
| data room | adatszoba (data room) | |
| cost-plus | költség plusz (cost-plus) | |
| markup | haszonkulcs | |
| fixed fee | fix díj | |
| exposure | kockázati kitettség / kockázat | rövid formában „kockázat" |
| filing | bevallás / benyújtás | a TPR-nél „bevallás" |
| licensed tax advisor | nyilvántartásba vett adótanácsadó | **jogilag terhelt** — lásd lentebb |
| cap table | tulajdonosi szerkezet | |
| US flip / Delaware flip | (amerikai) cégstruktúra-áthelyezés, Delaware flip | az angol megtartva, mert a magyar startupközeg így hívja |

## Amit át kell nézetni

A `src/i18n/hu/common.ts` **`footer.disclaimer`** bekezdése kijelenti, hogy a
Paritas *nem* nyilvántartásba vett adótanácsadó és nem ügyvédi iroda.
Magyarországon az adótanácsadói / okleveles adószakértői tevékenység
nyilvántartáshoz kötött, ezért egy pontatlan megfogalmazás akár a
nyilvántartásba vételt sugallhatja. Ezt a bekezdést nézesd át azzal, aki a
felelősségi megfogalmazásért felel — lehetőleg magyar jogásszal.

Ugyanitt szerepel a `footer.governingLanguage` sor:

> A magyar fordítás tájékoztató jellegű; eltérés esetén az angol változat az irányadó.

Ez angolul szándékosan üres string, így csak a magyar oldalon jelenik meg.
