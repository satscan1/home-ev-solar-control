# Smart charging explained

*A guide for everyone: what HESC does with your car, why, and what you still do yourself.* (Nederlands: [Slim laden uitgelegd](07-smart-charging-explained.nl.md))

The same guide is built into the dashboard: tap the ⓘ next to a heading, or the *Guide* badge on Main (hold it for the Dutch version).

## The short version

After about two weeks HESC runs almost on its own. Your part is small:

1. **Plug the car in** when you get home.
2. **Make sure your plan matches when you leave.** A weekly plan for your usual days (for example *80% on weekdays at 07:30*), a one-off plan for anything else (*100% on Saturday at 09:00*).

HESC does the rest. Between the moment you plug in and the moment you leave, it looks for the cheapest way to get the car where you want it. First it uses free sunshine, then the cheapest hours from the grid, and it always keeps a safety net so that the car is ready on time.

## Why the first two weeks matter

Most things work from the first day: solar charging, the charge plan, the safety net and the goal check.

One thing gets better with time: **looking ahead at prices.** Electricity prices for tomorrow are published around 13:00. Before that, nobody knows them. HESC fills that gap with an expected price, based on what prices did in your own last 14 days, and on how sunny tomorrow is going to be (sunny days are usually cheap around midday and expensive in the evening).

- **The first day:** no expected prices yet. HESC plans only with the prices that are known. That is fine; the safety net still gets the car ready.
- **After one full day:** a rough expectation, simply yesterday's pattern. Expected prices appear as grey bars in the price chart and the plan can use them.
- **From day 3:** the expectation uses the average of all full days so far.
- **From day 14:** it rests on two full weeks of your own prices.
- **Every week after that:** HESC refines how sun and price relate on your market, using your own history.

Expected prices are a guess, and HESC treats them that way: a known price always wins over an expected one, unless the expected one is clearly cheaper (2 cents per kWh or more). As soon as the real prices arrive, the plan uses those.

## The order HESC follows

Every 30 seconds HESC looks at the car, the sun, the prices and your plan, and asks itself the same questions in the same order:

| # | Question | What happens |
|---|---|---|
| 1 | **Is there sun?** | Your charger charges on solar in its own solar/Eco mode, as it always did (with HPVC, HESC first asks HPVC to let the sun through). HESC follows it and counts the sun in the plan, so it does not buy energy the sun will deliver anyway. |
| 2 | **Is it one of the planned cheapest quarters?** | HESC starts the charger from the grid for that quarter of an hour. |
| 3 | **Is time running out?** | **Safety net:** when the time left is only just enough to reach the goal, HESC starts charging, whatever the price. |
| 4 | **Is it the last hour before you leave and the car is still short?** | **Final check:** HESC charges to your goal, whatever the price. |
| 5 | **Is the price very low right now?** | **Cheap chance:** HESC charges now, even without a plan, *unless* enough sun is expected later today to do the same job (see below). |
| 6 | **Is the car below the minimum you set?** | **Minimum charge** (optional, off by default): the car gets at least that level within a few hours, in the cheapest quarters of that window. |
| 7 | Nothing of the above | HESC waits. The dashboard tells you why, for example *Waiting for the next planned quarter*. |

A few rules apply to all of these:

- **3% margin.** HESC only starts charging from the grid when the car is more than 3% below the goal. A car at 78% with a goal of 80% is left alone; at 76.9% it charges. This avoids starting the charger for a few minutes of nothing.
- **HESC only undoes what it started.** If you start charging yourself, or the car is already charging on sun, HESC leaves it alone.
- **After grid charging the charger is not left on** (chargers with a start/stop switch). Otherwise the car could quietly top itself up from the grid in the evening peak. If *Back to solar mode* is filled in (Wallbox: *Resume schedule*; HESC fills it in itself), HESC pauses the charger and about a minute later puts it back in its own solar mode, so the next sunny hour charges the car by itself. Without that field the charger stays paused, and HESC switches it on again when there is enough sun, when the car drops more than 3% below the goal and no planned charge is coming, when a plan starts, or when you unplug.

## How the plan picks the cheapest hours

Say you plug in at 18:00 with the car at 40%, and your weekly plan says *80% at 07:30*.

1. **How much is needed?** 40% of a 60 kWh battery = 24 kWh.
2. **How much comes from the sun before 07:30?** None, it is night. (On a Saturday plan for 14:00 the morning sun would count.)
3. **How long does that take from the grid?** At 11 kW: a bit over 2 hours, so 9 quarters.
4. **Which 9 quarters?** The cheapest ones between now and 07:30. Usually somewhere in the night.

The planned quarters show up in **amber** in the price chart on the *Charge plan* tab. When the plan is not active, the chart shows what it *would* do, marked *preview*.

## Cheap chances and the sun

*Take cheap chances* (on the *Charge plan* tab) charges whenever the price drops below *Cheap when below*, even without a plan. These moments show in **blue-green** in the price chart.

But a cheap moment in the morning is not a bargain when the afternoon sun would have filled the car for free. So before taking a cheap chance, HESC looks at the solar forecast for the rest of that day. If the sun is expected to cover what the car still needs, with 20% to spare, the cheap chance is skipped. You then see *Cheap chance skipped: enough sun today*, and the price chart leaves those quarters out.

## Home battery and EV

*Optional, off by default. Only for homes with a home battery.*

On a sunny morning the home battery usually takes all the spare sun first. The charger in solar mode then sees no surplus and waits, sometimes until the home battery is full in the afternoon. On a day with less sun, that can mean the car gets nothing.

With **Home battery and EV** switched on, HESC helps the car get its turn:

1. **Kickstart.** When the car is plugged in and waiting for sun, the home battery has been charging for a few minutes and the cautious forecast says there is enough sun now, HESC checks the rest of the day. Is there clearly more sun left than the home battery still needs (with 20% to spare, and at least *Minimum sun left for the EV*)? Then HESC gives the charger a short start. Your battery system sees the car charging and stops filling the home battery; HESC then puts the charger back in its own solar mode, which keeps charging on the sun that is now free.
2. **Back to the home battery.** Later in the day, when the sun left is only just enough to fill the home battery, HESC puts the charger back to waiting, so the home battery is full by the evening. After that there is no new kickstart that day.

During the short start the home battery may deliver some power to the car for a moment. That is expected and small.

HESC never controls the home battery itself. It only decides when the car starts, and reads the home battery level and power. It does nothing while a charge plan is charging, during an HPVC release, or after sunset, and at most a few times a day (*Kickstarts per day*, default 3, with at least 30 minutes in between).

What you fill in (Settings, block 3, *Home battery and EV* → *Settings*): the level sensor(s) of your home battery, its power sensor(s) (positive = charging) and its total size in kWh. It also needs the charger's start/stop switch and *Back to solar mode* (block 3, *Charge plan*); with charger type Wallbox both are filled in for you. When the car is plugged in, Main shows what it is doing in an extra line under *Control States*.

## What will it cost?

The **Expected charge cost** badge at the top of Main shows what the active plan is expected to cost: the energy it plans to take from the grid times the average price of the planned quarters. Sun counts as free. Without an active plan, or with the car already at its goal, it shows € 0.00.

## Situations

### "I drive to work every weekday"

Make a **weekly plan**: tick the days, set the time you leave and the level you want. Leave it active. Plug in when you get home. That is all.

### "I'm going on a trip on Saturday"

Make a **one-off plan** for Saturday at the time you leave, for example 100%. When a one-off and a weekly plan are both active, the earliest one wins. Afterwards your weekly plan simply continues.

A one-off plan is for one date. If you pick *Tomorrow* today, it means that date: it does not move on to the next day at midnight. After the time you set, the one-off plan stops by itself.

### "The car stays at home for a few days"

No plan is needed. The car charges on sun, takes cheap chances when they come, and the charger stays paused otherwise. Only when the car drops more than 3% below *EV counts as full at* does HESC top it up.

### "I came home with an almost empty battery and might need the car tonight"

Switch on **Minimum charge** (Settings, block 3, *Use*). Default: at least 20% within 3 hours. HESC picks the cheapest quarters in those 3 hours, and charges straight away if no prices are known. Both numbers can be changed under *Settings*.

### "I have a home battery and the car never gets any sun"

Switch on **Home battery and EV** (Settings, block 3, *Use*) and fill in your home battery under *Settings*. See [Home battery and EV](#home-battery-and-ev) above.

### "I need the car now, forget the plan"

Start charging yourself (app, charger button or the charger's own mode). HESC sees the car is already charging and leaves it alone.

### "I plugged in late; is there still time?"

HESC checks this all the time. If the time left is only just enough, the safety net starts charging straight away. If the goal is still missed, you get a notification at the time you wanted to leave: *EV not charged to goal*, with the reason.

### "Tomorrow is going to be sunny"

The plan counts the sun in advance (cautious forecast, minus a little for the house), so it buys less from the grid. Cheap chances that the sun would make unnecessary are skipped.

### "Tomorrow's prices aren't known yet"

Normal before about 13:00. After the first few days the plan uses expected prices (grey bars) and firms up as soon as the real prices arrive.

### "My car stops at 80% by itself"

Many cars have their own charge limit. If it is lower than your goal, the charger stops by itself and HESC shows *Finished, charger stopped by itself*. Set your goal at or below the car's own limit, or raise the limit in the car.

### "The charger did not respond"

Chargers that work through the cloud sometimes ignore a command. HESC checks and tries again: a refused pause after 30 minutes, a refused resume after 5 minutes, each at most 3 times.

### "Home Assistant restarted during charging"

HESC keeps using the last valid plan for up to 10 minutes, so a running charge does not stop.

## What you set once

| Setting | Where | Default | Tip |
|---|---|---|---|
| Usable battery capacity | *Charge plan* tab | 60 kWh | What your car can really use |
| Grid charging power | *Charge plan* tab | 11 kW | A little below what your charger really delivers gives some margin |
| Take cheap chances / Cheap when below | *Charge plan* tab | your choice / 0.05 €/kWh | Lower = fewer but better chances |
| EV counts as full at | *Charge plan* tab and Settings | 80% | The level to keep without a plan |
| Final check | Settings | 60 min | How long before you leave HESC charges whatever the price |
| Minimum charge | Settings, block 3 | off (20%, 3 h) | Use + Settings switches |
| Home battery and EV | Settings, block 3 | off (3 per day) | Only with a home battery; Use + Settings switches |
| Back to solar mode | Settings, block 3, *Charge plan* | filled in for Wallbox | Puts the charger back in its own solar mode after grid charging |

## Where to look

- **Status** on the dashboard: one line saying what HESC does now and why.
- **Price chart** (*Charge plan* tab): amber = planned, blue-green = cheap chance, grey = expected price.
- **Expected charge cost** (badge at the top of Main): what the active plan is expected to cost.
- **Setup check** (*Settings* tab): one line per part with a tick and the values of now. When something is wrong, that part opens by itself and says what is missing.
- **Solar next 7 days** (*Settings* tab): yellow is the expected sun per day, green what is expected to be left for the car after the house and the home battery.
- **Report**: everything HESC measured and decided, for yourself or when you ask for help.

See also: [How it works](03-how-it-works.md) for the technical details, and [A day in practice](06-a-day-in-practice.md) for one real day.
