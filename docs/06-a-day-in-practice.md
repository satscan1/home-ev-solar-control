# A day in practice

What does HESC actually do? Instead of giving you a list of features, I'd rather show you. So come along for one ordinary Sunday at my home: 27 September 2026.

Nothing special was planned. Clouds came and went, the washing machine ran, the home batteries wanted their share of the sun, and around noon electricity was free for a while. The car was plugged in all day. Just a normal day at home, and that makes it a good test.

<p align="center"><img src="../screenshots/suite_hbc_hpvc_hevs.png" alt="HBC, HPVC and HEVS" width="100%"></p>
<p align="center"><sub>My setup: HBC + HPVC + HEVS. Icons are illustrations for this page, not the official logos of the other projects.</sub></p>

## Who lives in this house

This is my own setup. You don't need all of it: **HESC also works on its own**, without HBC or HPVC. More about that [at the end](#and-without-hpvc).

- **Two home batteries**, run by [Home Battery Control (HBC)](https://github.com/gitcodebob/marstek-venus-rs485-node-red) by gitcodebob. HBC decides when the batteries charge and when they power the house.
- **Solar panels**, watched by [Home PV Control (HPVC)](https://github.com/BioPC/home-pv-control) by BioPC. When sending electricity back to the grid earns nothing, HPVC turns the panels down a little.
- **A car charger** (a Wallbox) in Eco mode. It only charges when there is enough spare sunshine, and it decides for itself when to start and when to pause.
- **HESC** keeps an eye on all of this. It checks the solar forecast, writes down what really happens, can charge the car at the cheapest moments before a deadline, and, when HPVC is holding the panels back, can politely ask HPVC to let some sun through for the car.

The golden rule: everyone does their own job. HESC asks. It never takes over.

## The day at a glance

<p align="center"><img src="../screenshots/day_20260927_main.png" alt="HESC main dashboard during the afternoon" width="100%"></p>
<p align="center"><sub>The HESC dashboard at 14:59 that day: the car charging on sunshine, the forecast and the real production side by side.</sub></p>

## Morning: the batteries eat first (06:00 – 11:00)

The home batteries woke up at about 20%. From half past eight the sun was strong enough, and HBC sent everything spare into the batteries. By half past ten they were almost half full.

The car had to wait, and that's fine: the batteries come first. HESC used the quiet morning to note, every quarter of an hour, what the forecast promised and what the panels actually delivered.

## 11:07 · The car gets a turn

As a test, I paused battery charging for a quarter of an hour. Straight away there was sun to spare, and the charger started.

Then everyday life stepped in. The washing machine began heating water and a cloud drifted past. This charger needs at least about 4 kW to charge, so it paused, tried again, and paused again. That is the charger being careful, not HESC.

## 11:26 · Free electricity

I had also set a charge plan: car full by Tuesday at 10:00. The plan looks at the electricity prices and picks the cheapest moments. At 11:26 electricity cost nothing, so the plan grabbed that quarter of an hour, two days early. Afterwards it left the charger exactly as it had found it.

## Noon: HESC asks, HPVC decides (11:54 – 13:19)

Around noon the price dropped to zero. Sending power to the grid now earned nothing, so HPVC held the panels back. The batteries were charging again and got priority.

The car was still waiting. This is exactly the moment HESC was made for: plenty of sun expected, but the panels held back. So HESC asked HPVC: *may the car have some sun?* And then it waited.

HPVC said no: the batteries were not full yet. HESC took back its question, waited half an hour and asked again. Same answer. And that is how it should be. HESC asks, HPVC decides, and the batteries go first.

## 13:36 · Batteries full, the car starts by itself

At 13:36 the first battery was full and the second almost. The sun came out strongly. Now there was plenty to spare, and the charger started all by itself. No question to HPVC was needed. The car charged for about an hour and a half, from 70% to 79%.

## Afternoon: clouds (15:00 – 17:00)

After three o'clock the clouds took over. The charger paused, started, paused and started again. HESC didn't interfere. It simply followed along and wrote it all down.

At 15:36 HPVC got stuck: it kept part of the panels turned down while the house was buying power from the grid for the car. I switched HPVC off for the rest of the day and reported it to its maker ([issue #7](https://github.com/BioPC/home-pv-control/issues/7)). HESC noticed and simply carried on: with nothing being held back, there was nothing to ask for.

One more surprise at 16:33. The house had 1.5 kW to spare, yet the charger didn't start. A charger like this one spreads its power over three wires (phases), and one of them had too little spare power. The total was enough, that one wire was not. Again: the charger's own rule, not HESC.

## Evening (17:00 – 19:45)

As the sun went down, the charger made a few last short attempts and then waited. From about a quarter past six the batteries took over and powered the house. After sunset HESC simply said: *Night*.

The car ended the day at 86%. In the morning it was at 66%.

## The day in numbers

- **Sun:** about 28 kWh. The cautious forecast had expected about 19 kWh. It errs on the safe side, on purpose.
- **Car:** about 14 kWh in eight charging sessions, about two thirds straight from the sun. The rest came from the grid whenever a cloud passed while the car was charging.
- **Car battery:** from 66% to 86%.
- **Home batteries:** from about 20% to full.

## What I learned

For me, the most interesting part was not that the car got charged. It was that all the parts did their own job without getting in each other's way.

The home batteries get priority. The car gets whatever useful sunshine is left. The charger stays in charge of its own Eco mode. HPVC stays in charge of the panels. And HESC sits in between, watching what happens and asking HPVC for sun only when that makes sense.

On this day, HESC asked several times while the batteries were still charging. HPVC said no, and that was the right answer. Later, when the batteries were full, the car simply started by itself.

That is what this first real day was about. Not making the car, the batteries and the panels fight for control. Just giving each of them their own job.

## And without HPVC?

HESC also works without HPVC. Switch on **No HPVC (standalone)** in the settings. Nothing holds the panels back, so there is simply nothing to ask for.

The batteries still get the sun first, the charger still decides for itself, the charge plan still finds the cheapest moments, and HESC still keeps track of forecast and reality. HPVC adds one extra trick: when it holds the panels back, HESC can ask it to let the sun through for the car.

This was one day, in one house, with one charger. There will be more surprises to find. But after a full day of real household life, the idea works.

Thanks to **gitcodebob** (HBC) and **BioPC** (HPVC) for their projects. HESC is built to work alongside them.

<sub>Where the numbers come from: solar, car and battery power and battery levels from Home Assistant history (15-minute averages); forecast, real production, charging sessions and requests from HESC's own history file (`hesc-data/history.jsonl`); the car's battery level from the car integration during the day.</sub>
