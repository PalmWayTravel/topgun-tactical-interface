# TopGun: Tactical Interface

Készíts egy modern, taktikai HUD stílusú, mozgókép-központú weboldal designt egy paintball pálya számára. A pálya neve: TopGun, van kész logója, és ehhez kell illeszkednie a teljes vizuális rendszernek. A koncepció: olyan érzés, mintha egy modern katonai akciójáték célzórendszerének, "mission control" felületének a részei lennénk, ahol minden él és mozog.

KONCEPCIÓ ÉS HANGULAT

A fő közönség szezonban legénybúcsús baráti társaságok és céges csapatok, de gyerekprogramok is vannak. A hangulat akciófilmes, de nem nyers grunge, hanem high-tech, precíz, taktikai interfész. Gondolj egy FPS játék menüjére, egy drón célzórendszerre vagy egy bevetési briefing képernyőre. Hideg precizitás, adrenalin, technológia, és filmszerű mozgás. A weboldal fő élménye a mozgókép és a folyamatos, finom mozgás legyen, ne statikus felület.

SZÍNVILÁG (a logóhoz igazítva)

Alap háttér: mély, majdnem fekete szén (kb. #14110D / #1A1A1A), sötét tech alaphangulat.

Fő akcentus: a logó borostyán narancsa (kb. #F4A11D), mint egy HUD aktív kijelző szín, vékony vonalakon, kereteken, célkereszteken, gombokon, számokon, aktív állapotoknál.

Szöveg és világos elem: a logó krémes csontfehére (kb. #F5E7C8), illetve halványabb szürke árnyalatai a másodlagos szövegnek.

A narancs legyen az "élő rendszer" fénye a sötét felületen, mértékkel adagolva. Tiszta vörös ne kerüljön bele, hogy egységes maradjon a logóval.

INTERFÉSZ ELEMEK

Vékony narancs vonalas keretek, sarokjelek (corner brackets) a kártyák és blokkok sarkain, mintha célkeresztben lennének. Finom rácsháló (grid) háttér, koordináta jellegű apró feliratok, halvány scanline / kijelző textúra. Helyenként monospace "terminál" jellegű kis szövegek, státusz feliratok, mintha rendszerüzenetek lennének.

TIPOGRÁFIA

Címsorokhoz erőteljes, modern, kondenzált technikai display font, geometrikus, határozott karakterrel. Kiegészítésnek monospace betűtípus a HUD jellegű kisebb feliratokhoz, kódokhoz, számokhoz. Törzsszöveghez tiszta, modern sans-serif krém színben. Erős hierarchia, sok nagybetűs, feszes betűközű felirat.

HERO MOZGÓKÉP

A hero szekció háttere egy teljes képernyős, automatikusan és némán induló, folyamatosan ismétlődő (loop) háttérvideó legyen, sötét overlayjel a krém szöveg olvashatóságáért. A videó fölött vékony narancs HUD réteg: célkereszt, sarokjelek, finom rácsháló, mintha egy célzórendszeren keresztül néznénk a pályát. A hero tartalom (hatalmas TopGun címsor krém színben, rövid magabiztos szlogen, és egy domináns narancs fő CTA gomb, ami úgy néz ki, mint egy "DEPLOY" rendszergomb) lassan, határozottan ússzon be. A logó jól láthatóan a tetején. Amíg nincs valódi felvétel, használj sötét, mozgó placeholder hátteret vagy egy lassú, finoman mozgó gradient/füst animációt.

EGÉRKÖVETŐ CÉLKERESZT

Desktopon egyedi kurzor: egy finom narancs célkereszt, ami követi az egeret. Interaktív elemek (gombok, kártyák, képek) fölött a célkereszt "ráközelít" vagy aktiválódik. Mobilon ez nincs, ott marad a sima érintés.

GÖRGETÉSRE INDULÓ ANIMÁCIÓK 

A szekciók ne egyszerűen jelenjenek meg, hanem görgetésre "aktiválódjanak": finom belépés alulról, enyhe elmosódásból élesedés, és a HUD keretek, sarokjelek úgy rajzolódjanak ki, mintha egy rendszer töltené be őket. A háttérben több réteg mozogjon eltérő sebességgel (parallax): háttér, füst/HUD réteg, tartalom külön ütemben. Az interaktív elemeken finom glow és precíz, gyors mikroanimációk, akár enyhe glitch effekt hoverre. A kulcsszó a visszafogottság: az effektek erősítsék a hangulatot, ne tolakodjanak.

OLDAL FELÉPÍTÉS (látványterv, szekciónként)

1. Hero: a fent leírt teljes képernyős mozgóképes HUD hero a fő CTA-val és a logóval.

2. Bemutatkozó / "briefing" sáv: rövid, ütős állítás a pályáról, terminál jellegű kis feliratokkal körítve.

3. Statisztika sáv: kulcsszámok (pl. lejátszott csaták, csapatok, évek a pályán) count-up animációval pörögjenek fel nullától, amikor képbe érnek, nagy, narancs, monospace HUD stílusban.

4. Csomagok / árlista terület: kártyás elrendezés, sötét kártyák narancs sarokjelekkel és vékony kerettel, mintha kiválasztható bevetési opciók lennének. A kiemelt csomag aktív, világító állapotban. A legénybúcsú a vizuálisan domináns opció.

5. Galéria: rácsos képgaléria, a képeken finom HUD overlay és sarokjelek, hover effekttel.

6. Gyerekprogram szekció: vizuálisan elkülönülő, kicsit lágyabb, barátságosabb blokk a tech stíluson belül, saját erős narancs CTA-val, jól látható helyen, prioritással, hogy a családi közönség azonnal megtalálja.

7. Térkép / helymeghatározás szekció: sötét, HUD stílusú keretbe foglalt térkép megjelenés, koordináta jellegű feliratokkal.

8. Vélemények szekció: Google értékelések kártyás megjelenítése, mintha rendszer által visszaigazolt adatok lennének, narancs kiemelésekkel.

9. Kapcsolat / záró CTA: erőteljes sötét záró sáv, nagy narancs "csatlakozz a bevetéshez" jellegű CTA gombbal és elérhetőségekkel.

UX, TELJESÍTMÉNY ÉS HOZZÁFÉRHETŐSÉG (kötelező)

Tökéletesen reszponzív, mobilon is megmarad a tech HUD érzés, de letisztult és gyors. Sticky header, könnyen elérhető fő CTA. A háttérvideó és a galéria legyen lazy load, optimalizált, hogy ne lassítsa a betöltést. Mobilon a videó helyett statikus, sötét akció kép jelenjen meg, és a nehéz effektek egyszerűsödjenek. Tartsd tiszteletben a prefers-reduced-motion beállítást: akinek be van kapcsolva, annál a mozgások minimálisak vagy kikapcsoltak legyenek. Az oldal mozgókép ide vagy oda maradjon gyors és gördülékeny, és sugározzon precizitást, technológiát és adrenalint, miközben mindig olvasható és letisztult.

Egyelőre csak a designra és a vizuális koncepcióra koncentrálj, a funkciók implementálása később jön.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3577abce-f92a-4fd6-a8ef-0c849c93c705).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
