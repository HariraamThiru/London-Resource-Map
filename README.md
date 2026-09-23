# London Resource Map

An interactive map of free and low-cost food, shelter, health, mental health and community services in London, Ontario, in English and French.

**Live site:** https://hariraamthiru.github.io/london-resource-map/ ([en français](https://hariraamthiru.github.io/london-resource-map/?lang=fr))

![The service list beside a map of London, Ontario with color-coded markers for each category](docs/screenshot.png)

## Why this exists

People looking for help usually have to piece together information from many websites and PDFs, often on a phone and in a hurry. This app puts the essentials in one place: what a service offers, who it's for, whether it's open right now, and how to get there.

## Features

- **17 real services in 5 categories:** food, shelter, health, mental health, and library & community. Each one has its hours, phone number, who it's for, and a link to where the information came from.
- **Open now:** shows which services are open, using London time even if you're viewing from another time zone.
- **Near me:** sorts the list by distance from you and zooms the map to the closest services. Your location stays in your browser and is never sent anywhere.
- **English and French:** the interface and every listing are translated. Search works in both languages, with or without accents.
- **Search and filters:** search by keyword (try "meals", "repas" or "youth") and filter by category. Counts update as you go.
- **List and map stay in sync:** click a service in the list to fly to it on the map, or click a marker to jump to its card.
- **Suggest an update:** each listing links to a short GitHub form for reporting changes or suggesting new services.
- **Urgent help on every screen:** 911 for emergencies, 988 for crisis support, and 211 for everything else.
- **Works on phones and with assistive technology.** See [Accessibility](#accessibility).

## Built with

- [React](https://react.dev) and [Vite](https://vite.dev)
- [Leaflet](https://leafletjs.com) and [React Leaflet](https://react-leaflet.js.org), with free [OpenStreetMap](https://www.openstreetmap.org) map tiles (no API key needed)
- [Vitest](https://vitest.dev) for tests
- GitHub Actions, which tests, builds and deploys the site to GitHub Pages on every push to `main`

## How it works

- **`src/data/resources.json`** holds the services, with a source and a "last checked" date for each one.
- **`src/lib/hours.js`** stores opening hours as data, like `{ "mon": ["09:00-16:00"] }`. From that it works out whether a service is open, using London's time zone, and writes the hours out in each language ("Mon–Fri: 9 am–4 pm", "lun.–ven. : 9 h à 16 h").
- **`src/lib/filterResources.js`** handles search, category and "Open now" filtering. It's a pure function, so it's easy to test.
- **`src/lib/distance.js`** measures straight-line distance with the haversine formula, and **`src/lib/useUserLocation.js`** asks for the visitor's location only when they click "Near me".
- **`src/i18n/strings.js`** has all the interface text in both languages. A test checks that both languages have the same set of text keys, so nothing goes untranslated. The language can be set with a link (`?lang=fr`), and the app remembers the visitor's choice.
- **`scripts/geocode.mjs`** turns street addresses into map coordinates using OpenStreetMap's free Nominatim geocoder, sending at most one request per second as its usage policy asks.
- **`src/data/resources.test.js`** checks every entry: required fields, translations, valid hours, `https` links, and coordinates inside London. A bad data edit fails the build before it reaches the live site.

## Data

The details come from [Information London](https://www.informationlondon.ca), a local directory of community and social services, and from the organizations' own websites. They were checked on September 23, 2026. Hours and services change, so the app asks people to call ahead.

Shelters that keep their locations private for safety are left off the map on purpose. The app directs people to 211 instead.

Anyone can [suggest an update](https://github.com/HariraamThiru/london-resource-map/issues/new?template=suggest-update.yml) through a GitHub issue form. It needs a free GitHub account.

This is a student project and isn't affiliated with any of the organizations listed.

## Accessibility

- An [axe-core](https://github.com/dequelabs/axe-core) scan (WCAG 2.1 AA plus best practices) reports no violations, in both English and French.
- The page's language attribute switches with the language, so screen readers use the right pronunciation.
- Toggle buttons tell screen readers whether they're on or off. The results count and location messages are announced when they change.
- Category colors meet WCAG AA contrast with white text. Every category is also named in text, so color is never the only clue.
- Links that open a new tab say so, and say which service they're for.

## Run it locally

You'll need [Node.js](https://nodejs.org) 22.12 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173/london-resource-map/.

```bash
npm test
```

To add a service:
1. Copy an existing entry in `src/data/resources.json` and fill in both the `en` and `fr` text.
2. Write its hours as `"always"`, as `null` if they aren't published, or day by day, like `{ "mon": ["09:00-16:00"] }`.
3. Set `"lat": null` and `"lng": null`, then run `npm run geocode` to fill in its coordinates.

## What's next

- **More languages**, such as Arabic, which also needs a right-to-left layout
- **Holiday hours** and temporary closures
- **Offline use**, by saving the list to the phone as an installable web app
- A **review page**, so suggested updates can be approved without editing JSON by hand
- **Walking and transit times** instead of straight-line distance

## Credits

Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Service information comes from [Information London](https://www.informationlondon.ca) and the organizations listed.
