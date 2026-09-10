# Beamer-Winkel.nl keuzehulp

Moderne, conversiegerichte productadviseur voor bezoekers zonder technische kennis. Eenvoudige antwoorden worden intern vertaald naar throw-afstand, lichtopbrengst, resolutie en compatibiliteit. Producten worden gescoord (0–100%) in plaats van via vaste beslisbomen.

De tool draait als homepage-embed: Vercel host CSS/JS, Lightspeed laadt die scripts op de storefront (geen iframe).

## Installatie

```bash
npm install
npm start
```

Open [http://localhost:3006](http://localhost:3006) (poort via `PORT` in `.env`).

```bash
npm test -- --watchAll=false
npm run build
```

## Architectuur

```
src/
  data/          Vragen (data-driven) + testdata voor de engine
  server/        Lightspeed C-Series proxy (`/api/products`)
  engine/        Scoring, throw-fit, helderheid, set-compatibiliteit
  services/      Product API, Lightspeed-adapter, cart, analytics
  hooks/         Wizard-state (sessionStorage) en catalogus
  pages/         Intro, categorie, vragen, resultaten
  components/    Productkaart, vergelijking, complete set
```

UI leest nooit ruwe Lightspeed-JSON. Alles gaat via het interne productmodel (`src/engine/productModel.js`).

## Intern productmodel

Belangrijke velden: `category`, `brand`, `model`, `price`, `oldPrice`, `resolution`, `brightnessAnsi`, `technology`, `lightSource`, `throwRatioMin` / `Max`, `ust`, `shortThrow`, `gaming`, `inputLag`, `smart`, `office`, `homeCinema`, `available`, `productUrl`, `imageUrl`, `productId`, `variantId`, plus schermvelden (`sizeInches`, `electric`, `clr`, `alr`, `ustCompatible`, …).

## Recommendation engine

- `engine/throwFit.js` — kan dit model de gewenste inch-maat op de opgegeven afstand maken? Zo niet: `infeasible` (komt niet als beste match).
- `engine/brightness.js` — vertaalt “veel daglicht” + beeldmaat naar benodigde ANSI-lumen.
- `engine/projectorScoring.js` — gewogen score.
- `engine/screenScoring.js` — montage, mechanisme, UST vs normaal doek.
- `engine/setScoring.js` — eerst beamer, daarna technisch passend scherm + optionele beugel/HDMI.

Gewichten staan in `PROJECTOR_WEIGHTS`. Pas die aan zonder UI-wijzigingen.

Merkvoorkeuren (marge/strategie) staan in `src/config/brandPreferences.js`. Die tellen alleen mee bij technisch geschikte producten, max. ±15 punten, en verschijnen nooit in consumententeksten.

Vragen staan in `src/data/questions.js`. Conditionele vragen gebruiken `showIf`.

## Productdata / Lightspeed

Zet **nooit** API-secrets in React-code of `REACT_APP_*` variabelen.

De keuzehulp gebruikt dezelfde C-Series koppeling als `beamer-winkel-management-dashboard`:

- Host: `https://api.webshopapp.com/{lang}/products.json` (Basic auth key:secret)
- Env: `LIGHTSPEED_CLUSTER_ID`, `LIGHTSPEED_API_KEY`, `LIGHTSPEED_API_SECRET`, `LIGHTSPEED_LANGUAGE`

Bij `npm start` serveert `src/setupProxy.js` **`/api/products`** (server-side). De frontend haalt alleen die URL op (`REACT_APP_PRODUCT_API_URL=/api/products`).

Standalone API (productie/statische host):

```bash
node server/index.js
```

Afbeeldingen: relatieve paden, `//cdn…` en `http://` worden omgezet naar absolute `https://` URL’s. Alleen als een product geen beeld heeft, toont de UI `product-placeholder.svg`.

Bij een mislukte API toont de UI een foutmelding en **geen** mock-assortiment als live voorraad. `src/data/mockProducts.js` blijft alleen voor engine-tests.


## Winkelwagen

Standaard: `REACT_APP_CART_MODE=lightspeed`.

De storefront van Beamer-Winkel.nl (Lightspeed C-Series theme, listing `.is_add_btn`) voegt toe met:

```
POST /cart/add/{variantId}/?quantity={n}
```

zonder request body, met sessiecookie (`credentials: include`) **alleen same-origin**.

Cross-origin (andere host of iframe vanaf een ander domein): de keuzehulp navigeert naar dezelfde shop-URL. Dat is de officiële storefront-actie, geen CORS-hack. Voor productie: **same-origin** op www.beamer-winkel.nl.

`REACT_APP_CART_MODE=disabled` zet de knop uit (geen nep-succes).

## Catalogus-cache

`/api/products` cachet het volledige Lightspeed-fetch + CSV-enrichment **10 minuten** in-process. Prijs en voorraad zijn dus maximaal ~10 minuten oud. De specificatie-CSV wordt op mtime gecachet en niet per product opnieuw geparsed.

Response-meta bevat `timing` (fetchMs, enrichMs, totalMs) en `cache` (hit, ttlMs, stockMaxAgeMinutes). `Cache-Control: no-store` op de HTTP-response: browsers cachen de payload niet extra.

## Homepage-integratie (Vercel + Lightspeed, geen iframe)

De productie-embed is een launcher + fullscreen/modal wizard in `#beamer-keuzehulp`. JS/CSS komen van Vercel; de pagina blijft `www.beamer-winkel.nl`, zodat add-to-cart relative `POST /cart/add/{variantId}/` en `GET /cart/?format=json` op de shop-origin blijven.

1. Deploy deze repo op Vercel (Create React App, output `build`).
2. Na deploy zijn de stabiele URLs:

`https://<vercel-domain>/embed/keuzehulp-app.css`  
`https://<vercel-domain>/embed/keuzehulp-embed.js`

3. Plak in het Lightspeed homepage-template (`.rain`):

```html
<link rel="stylesheet" href="https://<vercel-domain>/embed/keuzehulp-app.css">
<div id="beamer-keuzehulp"></div>
<script src="https://<vercel-domain>/embed/keuzehulp-embed.js" defer></script>
```

Plaatsing: Lightspeed C-Series → **Thema’s / Design → Theme editor → Homepage** (`index.rain` of custom HTML onder de slider).

Bannerhoogte (standaard 200px): `#beamer-keuzehulp { --bw-keuzehulp-banner-height: 220px; }`

Test flows: `/?keuzehulp=beamer`, `/?keuzehulp=screen`, `/?keuzehulp=set`.

Catalogus: `GET /api/products` op de **pagina-origin** (de shop), niet op Vercel. Zet geen Lightspeed API-secrets in Vercel frontend-env.

## Vercel

- Framework: Create React App (`vercel.json`)
- Build: `CI=true npm run build`
- Output: `build`
- Publieke embed: `/embed/keuzehulp-embed.js` en `/embed/keuzehulp-app.css` (geen hashed namen)

Frontend-env toegestaan: `REACT_APP_PRODUCT_API_URL` (standaard `/api/products`), `REACT_APP_CART_MODE=storefront`, `REACT_APP_SHOP_ORIGIN=https://www.beamer-winkel.nl`.

**Niet** in Vercel frontend: `LIGHTSPEED_API_KEY`, `LIGHTSPEED_API_SECRET`, `LIGHTSPEED_CLUSTER_ID`. Geen cart-proxy op Vercel.

## Analytics

Geen GA measurement ID in deze repo. Events gaan naar `window.dataLayer` / `gtag` als de shop die injecteert:

`keuzehulp_banner_view`, `keuzehulp_beamer_clicked`, `keuzehulp_screen_clicked`, `keuzehulp_set_clicked`, `keuzehulp_started`, `category_selected`, `question_answered`, `recommendation_viewed`, `fallback_shown`, `product_clicked`, `add_to_cart_clicked`, `add_to_cart_success`, `add_to_cart_failed`, `wizard_completed`, `keuzehulp_completed`.

## Environment

Zie `.env.example`:

| Variabele | Functie |
| --- | --- |
| `REACT_APP_PRODUCT_API_URL` | Catalogus-endpoint (dev: `/api/products`) |
| `REACT_APP_CART_MODE` | `lightspeed` (standaard) \| `disabled` \| `redirect` \| `post` |
| `REACT_APP_CART_ADD_URL` | Cart-URL met placeholders |
| `REACT_APP_SHOP_ORIGIN` | Shop-origin voor relatieve product-/image-URL’s |
| `LIGHTSPEED_CLUSTER_ID` | Alleen server-side (zelfde als het dashboard) |
| `LIGHTSPEED_API_KEY` | Alleen server-side |
| `LIGHTSPEED_API_SECRET` | Alleen server-side |
| `LIGHTSPEED_LANGUAGE` | Standaard `nl` |
| `PROJECTOR_SPEC_CSV` | Optioneel pad naar specificatie-CSV (standaard `data/projector-specifications.csv`) |

Als deze LIGHTSPEED-variabelen ontbreken in `.env`, leest de server ze uit `../beamer-winkel-management-dashboard/.env.local`.

## Projector-specificaties (CSV-enrichment)

Lightspeed blijft leidend voor prijs, voorraad, URL, afbeelding en of een product live is.

Technische specs worden extra verrijkt vanuit:

`data/projector-specifications.csv`

(export `product_specifications_export_YYYY-MM-DD_HH-MM-SS.csv`, puntkomma-gescheiden).

Vervangen: zet een nieuwe export op die plek, of wijs `PROJECTOR_SPEC_CSV` naar een ander pad. Geen absolute Windows-paden in de code.

Verwachte kolommen o.a. `Internal_ID`, `Short_title`, `Article_code`, `EAN`, `SKU`, `NL_Geschikt_voor`, `NL_Resolutie`, `NL_Helderheid`, `NL_Projectieverhouding_Throw_Ratio`, `NL_Input_Lag`, `NL_Geluidsniveau`, `NL_Smart_functies`, `NL_WIFI`, `NL_plus`, `NL_min`.

Matching (conservatief, geen fuzzy): Internal_ID → EAN → SKU → Article_code → genormaliseerde merk+model. Bij twijfel: niet koppelen.

Dataprioriteit voor specs: CSV confirmed → Lightspeed veld → geparsde titel/omschrijving (inferred) → unknown. Prijs/voorraad/media blijven altijd Lightspeed.

Throw-class drempels (centraal in `src/utils/screenGeometry.js`): UST tot throw ratio **0,40**; short throw tot **1,00**. `0,50:1` is short throw, geen UST.

LED-lumen worden **niet** 1:1 als ANSI gebruikt.

De CSV gaat niet naar de browser; de server merget hem in `/api/products`.

## Nog nodig voor productie

1. LIGHTSPEED-variabelen op de host van `/api/products` (niet in de frontend-bundle).
2. Same-origin deploy op www.beamer-winkel.nl zodat winkelwagen-POST de shop-cookie gebruikt.
3. Live add-to-cart controleren in de echte shop-sessie (kan niet betrouwbaar vanaf localhost).
4. Eventueel GA4 via de bestaande shop-container.

## Deployment

`npm run build` levert statische files in `build/`. Host op S3, Netlify, de shop-CDN of een subdirectory van beamer-winkel.nl.
