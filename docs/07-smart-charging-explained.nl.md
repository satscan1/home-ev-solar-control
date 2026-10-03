# Slim laden uitgelegd

*Een uitleg voor iedereen: wat HESC met je auto doet, waarom, en wat je zelf nog doet.* (English: [Smart charging explained](07-smart-charging-explained.md))

## In het kort

Na ongeveer twee weken werkt HESC bijna helemaal vanzelf. Jouw deel is klein:

1. **Stekker erin** als je thuiskomt.
2. **Zorg dat je planning klopt met je vertrektijd.** Een weekplan voor je vaste dagen (bijvoorbeeld *80% op werkdagen om 07:30*), een eenmalig plan voor al het andere (*100% op zaterdag om 09:00*).

De rest doet HESC. Tussen het moment dat je aansluit en het moment dat je vertrekt, zoekt het de goedkoopste manier om de auto op het gewenste niveau te krijgen. Eerst met gratis zonnestroom, dan met de goedkoopste uren van het net, en altijd met een vangnet zodat de auto op tijd klaar is.

## Waarom de eerste twee weken ertoe doen

Het meeste werkt vanaf de eerste dag: laden op zon, het laadplan, het vangnet en de controle van je doel.

Eén ding wordt beter met de tijd: **vooruitkijken naar prijzen.** De stroomprijzen voor morgen komen rond 13:00 uit. Daarvoor weet niemand ze. HESC vult dat gat met een verwachte prijs, op basis van wat de prijzen de afgelopen 14 dagen bij jou deden, en van hoe zonnig het morgen wordt (zonnige dagen zijn meestal goedkoop rond het middaguur en duur in de avond).

- **De eerste dag:** nog geen verwachte prijzen. HESC plant alleen met de prijzen die bekend zijn. Geen probleem: het vangnet zorgt dat de auto toch klaar is.
- **Na één volle dag:** een ruwe verwachting, gewoon het patroon van gisteren. Verwachte prijzen verschijnen als grijze staven in de prijsgrafiek en het plan mag ze gebruiken.
- **Vanaf dag 3:** de verwachting gebruikt het gemiddelde van alle volle dagen tot nu toe.
- **Vanaf dag 14:** de verwachting rust op twee volle weken van je eigen prijzen.
- **Daarna elke week:** HESC stelt met je eigen geschiedenis bij hoe zon en prijs op jouw markt samenhangen.

Een verwachte prijs blijft een schatting, en HESC gaat er ook zo mee om: een bekende prijs gaat altijd voor op een verwachte, tenzij de verwachte duidelijk goedkoper is (2 cent per kWh of meer). Zodra de echte prijzen er zijn, gebruikt het plan die.

## De volgorde die HESC aanhoudt

Elke 30 seconden kijkt HESC naar de auto, de zon, de prijzen en je plan, en stelt zichzelf steeds dezelfde vragen in dezelfde volgorde:

| # | Vraag | Wat er gebeurt |
|---|---|---|
| 1 | **Is er zon?** | Je laadpaal laadt op zon in zijn eigen zon-/Eco-stand, zoals altijd (met HPVC vraagt HESC eerst aan HPVC om de zon door te laten). HESC volgt dat en rekent de zon mee in het plan, zodat het geen stroom koopt die de zon toch levert. |
| 2 | **Is het een van de geplande goedkoopste kwartieren?** | HESC zet de laadpaal dat kwartier aan op netstroom. |
| 3 | **Raakt de tijd op?** | **Vangnet:** is de resterende tijd nog maar net genoeg om het doel te halen, dan start HESC het laden, wat de prijs ook is. |
| 4 | **Is het het laatste uur voor vertrek en zit de auto nog onder het doel?** | **Eindcontrole:** HESC laadt tot je doel, wat de prijs ook is. |
| 5 | **Is de prijs nu erg laag?** | **Goedkope kans:** HESC laadt nu, ook zonder plan, *tenzij* er later vandaag genoeg zon verwacht wordt om hetzelfde te doen (zie verderop). |
| 6 | **Zit de auto onder het minimum dat je hebt ingesteld?** | **Minimumlading** (optioneel, standaard uit): de auto krijgt binnen een paar uur minstens dat niveau, in de goedkoopste kwartieren van dat venster. |
| 7 | Niets van dit alles | HESC wacht. Het dashboard zegt waarom, bijvoorbeeld *Waiting for the next planned quarter*. |

Voor alles hierboven gelden een paar regels:

- **3% marge.** HESC laadt pas van het net als de auto meer dan 3% onder het doel zit. Een auto op 78% met een doel van 80% blijft met rust; op 76,9% wordt er geladen. Zo start de laadpaal niet voor een paar minuten niets.
- **HESC maakt alleen ongedaan wat het zelf startte.** Start je zelf met laden, of laadt de auto al op zon, dan laat HESC het met rust.
- **Na het laden van het net blijft de laadpaal op pauze** (laadpalen met een start/stop-schakelaar). Anders kan de auto stilletjes in de dure avondpiek bijladen van het net. De laadpaal gaat weer aan als er genoeg zon is, als de auto meer dan 3% onder het doel zakt en er geen geplande lading meer komt, als een plan start, of als je de stekker eruit haalt.

## Hoe het plan de goedkoopste uren kiest

Stel: je sluit om 18:00 aan met de auto op 40%, en je weekplan zegt *80% om 07:30*.

1. **Hoeveel is er nodig?** 40% van een accu van 60 kWh = 24 kWh.
2. **Hoeveel komt er van de zon vóór 07:30?** Niets, het is nacht. (Bij een plan voor zaterdag 14:00 zou de ochtendzon wel meetellen.)
3. **Hoe lang duurt dat van het net?** Bij 11 kW: iets meer dan 2 uur, dus 9 kwartieren.
4. **Welke 9 kwartieren?** De goedkoopste tussen nu en 07:30. Meestal ergens in de nacht.

De geplande kwartieren zie je **oranje** in de prijsgrafiek op het tabblad *Charge plan*. Staat het plan niet aan, dan laat de grafiek zien wat het *zou* doen, met het woord *preview*.

## Goedkope kansen en de zon

*Take cheap chances* (op het tabblad *Charge plan*) laadt zodra de prijs onder *Cheap when below* zakt, ook zonder plan. Die momenten zie je **blauwgroen** in de prijsgrafiek.

Maar een goedkoop moment in de ochtend is geen koopje als de middagzon de auto gratis had kunnen vullen. Daarom kijkt HESC eerst naar de zonverwachting voor de rest van die dag. Dekt de zon naar verwachting wat de auto nog nodig heeft, met 20% over, dan wordt de goedkope kans overgeslagen. Je ziet dan *Cheap chance skipped: enough sun today*, en de prijsgrafiek laat die kwartieren weg.

## Situaties

### "Ik rijd elke werkdag naar mijn werk"

Maak een **weekplan**: vink de dagen aan, zet je vertrektijd en het niveau dat je wilt. Laat het aan staan. Stekker erin als je thuiskomt. Klaar.

### "Ik ga zaterdag op reis"

Maak een **eenmalig plan** voor zaterdag op je vertrektijd, bijvoorbeeld 100%. Staan een eenmalig plan en een weekplan allebei aan, dan gaat het vroegste voor. Daarna gaat je weekplan gewoon door.

### "De auto blijft een paar dagen thuis"

Geen plan nodig. De auto laadt op zon, pakt goedkope kansen als ze komen, en verder blijft de laadpaal op pauze. Pas als de auto meer dan 3% onder *EV counts as full at* zakt, laadt HESC hem bij.

### "Ik kom thuis met een bijna lege accu en heb de auto vanavond misschien nog nodig"

Zet **Minimumlading** aan (Settings, blok 3, *Use*). Standaard: minstens 20% binnen 3 uur. HESC kiest de goedkoopste kwartieren in die 3 uur, en laadt meteen als er geen prijzen bekend zijn. Beide getallen kun je aanpassen onder *Settings*.

### "Ik heb de auto nu nodig, laat het plan maar"

Start zelf met laden (app, knop op de laadpaal of de eigen stand van de laadpaal). HESC ziet dat de auto al laadt en laat hem met rust.

### "Ik heb laat aangesloten; is er nog tijd?"

HESC houdt dat steeds in de gaten. Is de resterende tijd nog maar net genoeg, dan start het vangnet meteen. Wordt het doel toch niet gehaald, dan krijg je op je vertrektijd een melding: *EV not charged to goal*, met de reden.

### "Morgen wordt het zonnig"

Het plan rekent de zon vooraf mee (voorzichtige verwachting, min een beetje voor het huis), dus het koopt minder van het net. Goedkope kansen die de zon overbodig maakt, worden overgeslagen.

### "De prijzen voor morgen zijn nog niet bekend"

Normaal vóór ongeveer 13:00. Na de eerste dagen gebruikt het plan verwachte prijzen (grijze staven) en wordt het definitief zodra de echte prijzen er zijn.

### "Mijn auto stopt zelf bij 80%"

Veel auto's hebben een eigen laadgrens. Ligt die lager dan je doel, dan stopt de laadpaal vanzelf en toont HESC *Finished, charger stopped by itself*. Zet je doel op of onder de grens van de auto, of verhoog die grens in de auto.

### "De laadpaal reageerde niet"

Laadpalen die via de cloud werken, negeren soms een opdracht. HESC controleert en probeert opnieuw: een geweigerde pauze na 30 minuten, een geweigerde hervatting na 5 minuten, elk hoogstens 3 keer.

### "Home Assistant is tijdens het laden herstart"

HESC gebruikt het laatste geldige plan nog tot 10 minuten, zodat een lopende lading niet stopt.

## Wat je één keer instelt

| Instelling | Waar | Standaard | Tip |
|---|---|---|---|
| Usable battery capacity | tabblad *Charge plan* | 60 kWh | Wat je auto echt kan gebruiken |
| Grid charging power | tabblad *Charge plan* | 11 kW | Iets onder wat je laadpaal echt levert geeft wat marge |
| Take cheap chances / Cheap when below | tabblad *Charge plan* | eigen keuze / 0,05 €/kWh | Lager = minder maar betere kansen |
| EV counts as full at | tabblad *Charge plan* en Settings | 80% | Het niveau dat zonder plan wordt vastgehouden |
| Final check | Settings | 60 min | Hoe lang voor vertrek HESC laadt, wat de prijs ook is |
| Minimum charge | Settings, blok 3 | uit (20%, 3 uur) | Schakelaars Use + Settings |

## Waar je kijkt

- **Status** op het dashboard: één regel met wat HESC nu doet en waarom.
- **Prijsgrafiek** (tabblad *Charge plan*): oranje = gepland, blauwgroen = goedkope kans, grijs = verwachte prijs.
- **Rapport**: alles wat HESC gemeten en besloten heeft, voor jezelf of als je om hulp vraagt.

Zie ook (Engels): [How it works](03-how-it-works.md) voor de technische details, en [A day in practice](06-a-day-in-practice.md) voor één echte dag.
