import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, H2, P, UL } from "@/components/LegalPage";

export const Route = createFileRoute("/aszf")({
  head: () => ({
    meta: [
      { title: "ÁSZF — Top Gun Paintball" },
      {
        name: "description",
        content:
          "Top Gun Paintball Általános Szerződési Feltételek: foglalás menete, lemondási és fizetési feltételek, biztonsági szabályok.",
      },
      { property: "og:title", content: "ÁSZF — Top Gun Paintball" },
      {
        property: "og:description",
        content: "Foglalás, lemondás, fizetés és részvételi feltételek a Top Gun paintball pályán.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AszfPage,
});

function AszfPage() {
  return (
    <LegalPage
      title="Általános Szerződési Feltételek (ÁSZF)"
      subtitle={
        <>
          Top Gun Paintball (topgunpaintball.hu)
          <br />
          Hatályos: 2026. augusztus
        </>
      }
    >
      <H2>1. Szolgáltató adatai</H2>
      <P>Név: Top Gun Paintball</P>
      <P>Székhely / a szolgáltatás helye: Nyírbátor, Bakonyikert, 4300</P>
      <P>Nyilvántartási szám / adószám: [PÓTLANDÓ – az ügyféltől beszerzendő]</P>
      <P>E-mail: paintballtopgun@gmail.com</P>
      <P>Telefon: +36 70 603 3929 / +36 70 603 4088</P>

      <H2>2. A szerződés tárgya és létrejötte</H2>
      <P>
        Jelen ÁSZF a Top Gun Paintball (a továbbiakban: Szolgáltató) által a topgunpaintball.hu
        weboldalon keresztül nyújtott paintball-szolgáltatás (pályahasználat, felszerelés-bérlés)
        igénybevételének feltételeit szabályozza.
      </P>
      <P>
        A szerződés a weboldalon keresztül leadott foglalás visszaigazolásával jön létre a
        Szolgáltató és a foglalást leadó Vendég (a továbbiakban: Vendég) között.
      </P>

      <H2>3. Foglalás menete</H2>
      <P>
        A Vendég a weboldalon elérhető naptárban kiválasztja a kívánt dátumot és időpontot, megadja a
        nevét, telefonszámát, e-mail címét, a választott csomagot és a résztvevők létszámát.
      </P>
      <P>
        A rendszer a foglalás rögzítése után automatikus e-mailes visszaigazolást küld a Vendégnek.
        Ugyanez az időpont más vendég számára a foglalás fennállásáig nem foglalható le.
      </P>
      <P>
        A Szolgáltató fenntartja a jogot, hogy indokolt esetben (pl. időjárási körülmények, technikai
        akadály) a foglalást lemondja – ilyen esetben a Vendéget e-mailben és/vagy telefonon
        értesíti, és lehetőség szerint új időpontot ajánl.
      </P>

      <H2>4. Lemondási feltételek</H2>
      <P>
        A Vendég a foglalás visszaigazoló e-mailjében található linken keresztül, saját maga is
        lemondhatja a foglalást, ezzel az adott időpont más vendégek számára újra foglalhatóvá válik.
      </P>
      <P>
        Javasolt a lemondást legalább 24 órával a foglalt időpont előtt jelezni, hogy a Szolgáltató a
        szabaddá váló időpontot más vendégnek fel tudja ajánlani.
      </P>
      <P>
        A Szolgáltató fenntartja a jogot, hogy ismétlődő, indokolatlanul késői lemondás vagy meg nem
        jelenés (no-show) esetén a jövőbeli foglalásokat előzetes egyeztetéshez kösse.
      </P>

      <H2>5. Fizetési feltételek</H2>
      <P>
        A szolgáltatás díja a helyszínen, a szolgáltatás igénybevétele előtt vagy után fizetendő, a
        weboldalon feltüntetett aktuális árak szerint. A Szolgáltató online előre fizetést jelenleg
        nem alkalmaz.
      </P>
      <P>Az árak forintban (Ft) értendők, és tartalmazzák az általános forgalmi adót.</P>

      <H2>6. Részvételi és biztonsági feltételek</H2>
      <UL
        items={[
          "A paintball fizikai igénybevétellel járó, kontakt jellegű sporttevékenység, amely során a lövedékek okozta becsapódás enyhe fájdalommal, elszíneződéssel járhat.",
          "A pályán kizárólag a Szolgáltató által biztosított, ép védőfelszerelés (maszk) viselete mellett lehet tartózkodni – a védőfelszerelés levétele a pálya területén balesetveszélyes és tilos.",
          "18 év alatti Vendég csak szülő/gondviselő írásos hozzájárulásával és jelenlétében, illetve a Szolgáltató mindenkori korhatár-szabályai szerint vehet részt a játékban (junior részvétel jelenleg 9 éves kortól, kedvezményesen, diákigazolvánnyal).",
          "A Vendég a részvétellel elismeri, hogy a tevékenység sérülésveszéllyel járhat, és a Szolgáltató által adott biztonsági tájékoztatást és utasításokat köteles betartani.",
          "A Szolgáltató a szabályok be nem tartása esetén a Vendéget a játékból kizárhatja, ilyen esetben a szolgáltatás díja nem jár vissza.",
        ]}
      />

      <H2>7. Felelősség</H2>
      <P>
        A Szolgáltató a tőle elvárható gondossággal biztosítja a pálya és a felszerelés biztonságos
        állapotát. A Szolgáltató felelőssége nem terjed ki a Vendég által a biztonsági szabályok
        megszegéséből eredő károkra vagy sérülésekre.
      </P>
      <P>
        A Szolgáltató javasolja, hogy a Vendég a részvétel előtt tájékozódjon saját egészségi
        állapotának a tevékenységre való alkalmasságáról.
      </P>

      <H2>8. Panaszkezelés</H2>
      <P>
        A Vendég a szolgáltatással kapcsolatos panaszát az 1. pontban megadott elérhetőségeken
        jelezheti. A Szolgáltató a panaszt kivizsgálja és 15 napon belül írásban válaszol.
      </P>

      <H2>9. Adatkezelés</H2>
      <P>
        A foglalás során megadott személyes adatok kezeléséről a weboldalon elérhető külön
        Adatkezelési tájékoztató nyújt részletes tájékoztatást.
      </P>

      <H2>10. Egyéb rendelkezések</H2>
      <P>
        A jelen ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyvről szóló 2013. évi V.
        törvény (Ptk.) és a fogyasztóvédelemre vonatkozó mindenkori hatályos jogszabályok
        rendelkezései az irányadók.
      </P>
      <P>
        A Szolgáltató fenntartja a jogot jelen ÁSZF egyoldalú módosítására, a módosítás a weboldalon
        történő közzététellel lép hatályba.
      </P>
    </LegalPage>
  );
}
