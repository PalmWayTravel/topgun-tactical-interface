import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, H2, H3, P, UL } from "@/components/LegalPage";

export const Route = createFileRoute("/adatkezeles")({
  head: () => ({
    meta: [
      { title: "Adatkezelési tájékoztató — Top Gun Paintball" },
      {
        name: "description",
        content:
          "Top Gun Paintball adatkezelési tájékoztató: milyen adatokat kezelünk foglalás és értékelés során, meddig tároljuk, és milyen jogaid vannak.",
      },
      { property: "og:title", content: "Adatkezelési tájékoztató — Top Gun Paintball" },
      {
        property: "og:description",
        content: "Hogyan kezeljük a foglalás során megadott személyes adataidat.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdatkezelesPage,
});

function AdatkezelesPage() {
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      subtitle={
        <>
          Top Gun Paintball (topgunpaintball.hu)
          <br />
          Hatályos: 2026. augusztus
        </>
      }
    >
      <H2>1. Az adatkezelő adatai</H2>
      <P>Adatkezelő neve: Top Gun Paintball</P>
      <P>Székhely / a tevékenység helye: Nyírbátor, Bakonyikert, 4300</P>
      <P>Nyilvántartási szám: 57929044</P>
      <P>Adószám: 59882617-1-35</P>
      <P>E-mail: paintballtopgun@gmail.com</P>
      <P>Telefon: +36 70 603 3929 / +36 70 603 4088</P>
      <P>
        A weboldal fejlesztését és technikai üzemeltetését közreműködőként Takács Ádám (egyéni
        vállalkozó) végzi, aki e minőségében adatfeldolgozónak minősül.
      </P>

      <H2>2. Milyen adatokat kezelünk és milyen célból</H2>

      <H3>2.1 Foglalás során megadott adatok</H3>
      <P>
        Amikor a weboldalon időpontot foglalsz, az alábbi adatokat kérjük el és tároljuk:
      </P>
      <UL
        items={[
          "Név",
          "Telefonszám",
          "E-mail cím",
          "A foglalás dátuma, időpontja, a választott csomag és a létszám",
        ]}
      />
      <P>
        Az adatkezelés célja: a foglalás nyilvántartása, visszaigazolása, a szolgáltatás
        lebonyolítása, szükség esetén kapcsolatfelvétel (pl. időpont-egyeztetés, lemondás).
      </P>
      <P>
        Jogalap: szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont) – a foglalással létrejövő
        szolgáltatási szerződés teljesítéséhez szükséges.
      </P>

      <H3>2.2 Értékelés (review) során megadott adatok</H3>
      <P>
        A foglalást követően e-mailben felkérünk az élmény értékelésére. Az értékelés (csillagszám,
        opcionális szöveges megjegyzés) a foglalásodhoz kapcsolódóan kerül tárolásra.
      </P>
      <P>
        Jogalap: jogos érdek (GDPR 6. cikk (1) bekezdés f) pont) – szolgáltatásunk minőségének mérése
        és fejlesztése.
      </P>
      <P>
        4-5 csillagos értékelés esetén a rendszer átirányít a Google saját értékelő felületére – az
        ott megadott adatok kezelésére a Google adatkezelési szabályzata vonatkozik, arra nincs
        ráhatásunk.
      </P>

      <H3>2.3 Automatikus technikai adatok</H3>
      <P>
        A weboldal működéséhez szükséges minimális technikai adatokat (pl. a foglalási rendszer
        session-azonosítója) kezelünk, személyes profilalkotásra nem használjuk.
      </P>

      <H2>3. Kik férnek hozzá az adatokhoz</H2>
      <UL
        items={[
          "A Top Gun Paintball munkatársai (adminisztrációs felület, jelszóval védett)",
          "A weboldal technikai üzemeltetője (Takács Ádám e.v.), kizárólag a rendszer karbantartásához szükséges mértékben",
          "Az adatok tárolása felhő alapú adatbázis-szolgáltatón keresztül történik (Lovable Cloud / Supabase)",
          "A foglalási és lemondási értesítéseket automatizált rendszer (Make.com) továbbítja e-mailben – ez a folyamat kizárólag a már megadott adatokat (név, e-mail, telefonszám, foglalás adatai) küldi tovább, harmadik félnek nem adjuk el, nem osztjuk meg reklámcéllal",
        ]}
      />

      <H2>4. Adattárolás időtartama</H2>
      <P>
        A foglalási adatokat a szolgáltatás teljesítésétől számított 5 évig őrizzük meg
        (számviteli/polgári jogi elévülési okokból). Ezt követően törlésre kerülnek, kivéve, ha
        jogszabály hosszabb megőrzést ír elő.
      </P>

      <H2>5. Az érintett jogai</H2>
      <P>A GDPR alapján bármikor jogosult vagy:</P>
      <UL
        items={[
          "tájékoztatást kérni a rólad tárolt adatokról,",
          "kérni az adatok helyesbítését,",
          "kérni az adatok törlését,",
          "kérni az adatkezelés korlátozását,",
          "tiltakozni az adatkezelés ellen,",
          "panaszt tenni a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH), vagy bírósághoz fordulni.",
        ]}
      />
      <P>
        Kérésedet a fent megadott e-mail címen (paintballtopgun@gmail.com) jelezheted.
      </P>

      <H2>6. Adatbiztonság</H2>
      <P>
        Az adminisztrációs felület jelszóval védett, az adatok titkosított kapcsolaton (HTTPS)
        keresztül továbbítódnak. A foglalási rendszer technikai védelmet alkalmaz az illetéktelen
        hozzáférés és az adatok véletlen elvesztése ellen.
      </P>

      <H2>7. Kapcsolat</H2>
      <P>
        Adatkezeléssel kapcsolatos kérdés, kérés esetén fordulj hozzánk bizalommal:
        paintballtopgun@gmail.com
      </P>
    </LegalPage>
  );
}
