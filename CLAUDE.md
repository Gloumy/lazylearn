# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source de vérité du projet

Le plan d'implémentation complet est dans `docs/lazylearn-plan.md`. Le lire avant toute intervention non triviale : il contient le contexte produit, la palette SCSS, le schéma Drizzle, la structure cible `app/` + `server/`, et le détail des 4 modules (`words`, `tracing`, `syllables`, `calculator`).

**État actuel** : phases 1 à 7 terminées.
- **Phase 1** ✅ — socle (config Nuxt, SCSS/palette, Drizzle schema + migration initiale, API profils, page de sélection + création).
- **Phase 2** ✅ — module "Les mots" (composables `useDragDrop` / `useSpeech` / `useProgress`, composants `LetterTile` / `DropSlot` / `WordBoard`, `data/words.ts` niveaux 1-3, page `[profile]/words.vue`, API progression).
- **Phase 3** ✅ — module "Tracer" (composants `TracingCanvas` canvas natif + pointer events + watermark SVG, `LetterNav` alphabet A–Z, page `[profile]/tracing.vue` avec 🔊 / Effacer / Suivant, progression `module='tracing'` ref = lettre).
- **Phase 4** ✅ — module "Syllabes" (composants `LetterBank` / `SyllableZone`, `data/syllables.ts` CV + CCV + digrammes ou/au/eu/ai/oi + accents é/è/ê/à, page `[profile]/syllables.vue` drag voyelles/consonnes → zone, validation via Set, TTS uniquement sur syllabe valide, pas de rouge ni de son en cas d'invalide, progression `module='syllables'` ref = syllabe).
- **Phase 5** ✅ — module "Calculette" (composants `NumberTile` / `OperatorTile` / `CalcBoard` 3 slots + résultat auto, `data/calculator.ts` avec `compute()` + `TOTAL_OPERATIONS`, page `[profile]/calculator.vue` drag chiffres 0–9 / opérateurs +−×÷, TTS à chaque opération valide, division non entière → message neutre "—" sans son, progression `module='calculator'` ref = `"${a}${op}${b}"`).
- **Phase 6** ✅ — Finitions : transitions de pages globales (fade + slide léger, `mode: out-in`), composant `CelebrationOverlay` mutualisé, contenu externalisé (`public/data/words.json` + `public/data/syllables.json` chargés via `loadWords()` / `loadSyllables()` avec cache singleton — calculette reste générée par `compute()`), pinch-zoom bloqué (meta viewport + `touch-action: pan-x pan-y` + plugin client `disable-zoom.client.ts` qui filtre aussi les `touchstart`/`touchmove` multi-doigts pour Android Chrome / Samsung Internet), responsive portrait `480px` (tuiles 56-60px, paddings réduits) en complément du `860px` tablette.
- **Phase 7** ✅ — module "Image-mot" (composants `WordChoice` / `PictureBoard`, page `[profile]/pictures.vue`, réutilise `loadWords()` : pioche cible + 3 distracteurs aléatoires du même niveau, tap correct → TTS + célébration, tap incorrect → shake 450ms sans son ni rouge, progression `module='pictures'` ref = mot). Banque `words.json` étendue à 90 mots (30 par niveau).

Le menu `[profile]/index.vue` liste les 5 modules, tous actifs.

## Commandes

```bash
npm run dev       # dev server → http://localhost:3000
npm run build     # build production
npm run preview   # aperçu build local
npm run generate  # génération statique (peu pertinent ici, SSR désactivé)
```

Pas de lint ni de test configuré — ne pas inventer de scripts `npm run lint` / `npm run test`.

## Stack et contraintes structurantes

- **Nuxt 4** avec `ssr: false` et `pathPrefix: false` dans `components` (configuration à ajouter au `nuxt.config.ts` actuel qui est minimal).
- **UI** : `@vuetify/v0` (composables headless, zéro style imposé) + SCSS maison.
- **DB** : Drizzle ORM sur PostgreSQL perso. Schéma dans `server/database/schema.ts`.
- **API** : Nuxt server routes (`server/api/**`), fullstack dans le même repo.
- **Déploiement** : serveur perso, pas de PWA.

## Conventions non négociables

Ces règles viennent du plan et évitent des allers-retours :

- Composants Vue : `<style lang="scss" scoped>` systématique.
- `pathPrefix: false` → appeler les composants sans préfixe de dossier : `<LetterTile />`, pas `<ModulesWordsLetterTile />`.
- Drag & drop : **pointer events** (`pointerdown` / `pointermove` / `pointerup`) uniquement, jamais mouse events — cible tablette tactile.
- TTS : `window.speechSynthesis` avec `lang: 'fr-FR'`, voix française si disponible.
- **Données de contenu** (mots, syllabes) : JSON dans `public/data/` chargés au runtime via les loaders cachés `loadWords()` / `loadSyllables()` exposés depuis `app/data/*.ts`. Mise à jour = remplacer le fichier sur le serveur, sans rebuild. La calculette reste générée par code (`compute()` + `TOTAL_OPERATIONS`). Pas de contenu en DB.
- **DB** : stocke uniquement les complétions (`profileId` + `module` + `ref` + date), pas les tentatives ni les erreurs.

## Architecture cible

Deux racines :

- `app/` — front Nuxt : `components/` (groupés par module : `profiles/`, `modules/words/`, `modules/tracing/`, …), `pages/` avec route dynamique `[profile]/`, `composables/` (`useDragDrop`, `useSpeech`, `useProgress`), `assets/styles/` (`_variables.scss`, `_reset.scss`, `main.scss`).
- `server/` — API + DB : `server/api/profiles/*`, `server/api/progress/*`, `server/database/schema.ts` + `migrations/`.

Chaque module a son propre fond coloré profond (`$bg-*` dans `_variables.scss`) et réutilise les mêmes composables pour drag/drop, TTS et progression. Voir `docs/lazylearn-plan.md` § "Les 4 modules" pour le détail fonctionnel de chacun, notamment les règles UX spécifiques (ex. syllabes : pas de rouge ni de son en cas d'invalide ; calculette : division affichée seulement si résultat entier ; tracer : pas de validation auto).

## Phases d'implémentation

Avancer phase par phase (cf. plan) : **1. Socle** ✅ → **2. Mots** ✅ → **3. Tracer** ✅ → **4. Syllabes** ✅ → **5. Calculette** ✅ → **6. Finitions** ✅. Chaque phase a un livrable jouable ; ne pas commencer une phase avant que la précédente ne soit fonctionnelle de bout en bout. Quand une phase est terminée, mettre à jour les marqueurs ci-dessus et la section "État actuel".
