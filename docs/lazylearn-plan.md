# lazylearn — Plan d'implémentation

## Contexte

Application d'apprentissage ludique pour enfants, principalement pour une fille de 6 ans (entrée en 1ère primaire, Belgique) qui reconnaît déjà les lettres et sait écrire quelques mots. Utilisable aussi par une petite sœur de 3 ans en accompagné. Projet perso hébergé sur un serveur personnel, partageable avec quelques familles proches.

---

## Stack technique

| Élément | Choix | Notes |
|---|---|---|
| Framework | Nuxt 4 | Structure `app/`, SSR désactivé |
| UI headless | Vuetify Zero (`@vuetify/v0`) | Composables headless, zéro opinion visuelle |
| Style | SCSS | Variables CSS centralisées, scoped par composant |
| ORM | Drizzle ORM | Connecté à un PostgreSQL sur serveur perso |
| API | Nuxt server routes | Fullstack dans le même repo |
| Déploiement | Serveur perso | Simple webapp, pas de PWA |

### nuxt.config.ts

```ts
export default defineNuxtConfig({
  ssr: false,
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  css: ['~/assets/styles/main.scss'],
})
```

---

## Design

### Typographie

- **Titres, lettres du jeu, chiffres** : `Baloo 2` (700, 800)
- **Textes, labels, UI** : `Fredoka` (500, 600)

```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Fredoka:wght@500;600&display=swap" rel="stylesheet">
```

### Palette SCSS (`assets/styles/_variables.scss`)

```scss
// Couleurs de fond par écran
$bg-profiles:    #2D1B69;  // violet profond
$bg-menu:        #FF6B35;  // orange chaud
$bg-words:       #1A237E;  // bleu nuit
$bg-tracing:     #1B5E20;  // vert profond
$bg-syllables:   #006064;  // teal profond
$bg-calculator:  #E65100;  // orange brûlé

// Couleurs des tuiles lettres/chiffres
$tile-colors: #FF6B6B, #FF9F43, #FECA57, #26de81,
              #45aaf2, #a55eea, #2bcbba, #FC427B,
              #5C6BC0, #8BC34A;

// Typographie
$font-title:  'Baloo 2', cursive;
$font-body:   'Fredoka', sans-serif;

// Rayons
$radius-card:   20px;
$radius-btn:    12px;
$radius-tile:   14px;
$radius-avatar: 24px;
```

### Principes visuels

- Chaque écran/module a son propre fond coloré profond
- Les éléments UI flottent avec `rgba(255,255,255,0.1–0.2)` sur ces fonds
- Coins très arrondis partout (`$radius-card` minimum)
- Chaque lettre/chiffre a sa propre couleur de la palette `$tile-colors`
- Responsive : layout 3 colonnes en paysage tablette, empilé en portrait mobile

---

## Structure du projet

```
app/
  components/
    profiles/
      ProfileCard.vue
      ProfileCarousel.vue
      ProfileCreate.vue
    modules/
      words/
        LetterTile.vue
        DropSlot.vue
        WordBoard.vue
      tracing/
        TracingCanvas.vue
        LetterNav.vue
      syllables/
        SyllableZone.vue
        LetterBank.vue
      calculator/
        NumberTile.vue
        OperatorTile.vue
        CalcBoard.vue
  pages/
    index.vue              ← sélection profil
    [profile]/
      index.vue            ← menu des modules
      words.vue
      tracing.vue
      syllables.vue
      calculator.vue
  composables/
    useDragDrop.ts
    useSpeech.ts
    useProgress.ts
  assets/
    styles/
      _variables.scss
      _reset.scss
      main.scss

server/
  api/
    profiles/
      index.get.ts         ← liste tous les profils
      index.post.ts        ← créer un profil
      [id].delete.ts       ← supprimer un profil
    progress/
      [profileId].get.ts   ← progression d'un profil
      index.post.ts        ← enregistrer une complétion
  database/
    schema.ts
    migrations/
```

---

## Schéma base de données (Drizzle)

```ts
// server/database/schema.ts

export const profiles = pgTable('profiles', {
  id:         serial('id').primaryKey(),
  name:       varchar('name', { length: 50 }).notNull(),
  emoji:      varchar('emoji', { length: 10 }).notNull(),
  createdAt:  timestamp('created_at').defaultNow(),
});

export const progress = pgTable('progress', {
  id:          serial('id').primaryKey(),
  profileId:   integer('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
  module:      varchar('module', { length: 20 }).notNull(),  // 'words' | 'tracing' | 'syllables' | 'calculator'
  ref:         varchar('ref', { length: 50 }).notNull(),     // ex: 'FLEUR', 'A', 'BA', '6+4'
  completedAt: timestamp('completed_at').defaultNow(),
});
```

---

## Les 4 modules

### 1. Les mots (`words`)

Glisser-déposer de lettres mélangées pour composer un mot.

**Fonctionnement :**
- Un mot est affiché avec son emoji illustratif et son article (`le`, `la`, `un`, `une`)
- Les lettres du mot sont mélangées et affichées comme tuiles colorées
- L'enfant glisse chaque lettre dans la bonne case
- Bonne lettre → se place avec une animation + TTS prononce la lettre
- Mauvaise lettre → la case tremble, on replace la lettre
- Mot complet → animation de célébration + TTS prononce `"le mot : [article] [mot]"`

**Organisation du contenu :**
- Niveau 1 : mots de 3 lettres (BUS, MER, NEZ, FEU, ROI…)
- Niveau 2 : mots de 4 lettres (CHAT, LUNE, MAIN, PIED…)
- Niveau 3 : mots de 5–6 lettres (CHIEN, ARBRE, FLEUR, POMME…)
- Thèmes : animaux, nature, famille, nourriture, objets du quotidien

**Composables utilisés :** `useDragDrop`, `useSpeech`, `useProgress`

---

### 2. Tracer (`tracing`)

Tracer des lettres sur un canvas tactile avec un modèle de référence visible.

**Fonctionnement :**
- Navigation dans l'alphabet via une liste latérale (lettres déjà tracées marquées)
- Zone de dessin centrale avec la lettre en filigrane très transparent
- Modèle de référence bien visible à droite
- Bouton 🔊 pour entendre la lettre
- Bouton "Effacer" pour recommencer
- Bouton "Suivant" pour passer à la lettre suivante (pas de validation automatique, le parent valide visuellement)
- Pas de correction automatique : l'enfant trace, le parent valide

**Lib canvas recommandée :** canvas natif avec gestion pointer events (pointermove, pointerdown, pointerup) pour le support tactile

---

### 3. Syllabes (`syllables`)

Assembler librement des lettres pour former des syllabes, prononcées par le TTS.

**Fonctionnement :**
- Deux banques de lettres : consonnes (colorées) et voyelles (jaune)
- L'enfant glisse 2–3 lettres dans une zone de composition
- Si la combinaison est dans la liste des syllabes valides → TTS la prononce + badge vert
- Si invalide → message neutre, pas de son, pas de rouge (pour ne pas décourager)
- Bouton 🔊 pour réécouter
- Bouton pour vider la zone

**Liste de syllabes valides :** fichier statique JSON (`data/syllables.json`) avec toutes les syllabes françaises courantes (ba, be, bi, bo, bu, bra, bre, etc.)

---

### 4. Calculette (`calculator`)

Composer des opérations mathématiques par glisser-déposer et voir le résultat.

**Fonctionnement :**
- Banque de chiffres (0–9) et d'opérateurs (+, −, ×, ÷)
- L'enfant compose une opération : chiffre + opérateur + chiffre
- Le résultat s'affiche automatiquement
- Division : affichée uniquement si le résultat est entier, sinon message neutre
- Pas de validation ni d'exercice imposé : exploration libre

---

## Profils

### Sélection
- Jusqu'à 6 profils affichés en grille
- Au-delà de 6 : carousel horizontal avec indicateurs (points)
- Chaque carte : grand emoji + prénom, très épuré

### Création
- Tout sur un seul écran : grille d'emojis à gauche, aperçu en temps réel à droite
- Saisie du prénom + bouton "C'est parti !"
- Emojis proposés : animaux, créatures, objets rigolos (~20–30 choix)

---

## Plan d'implémentation par phases

### Phase 1 — Socle du projet
- Init Nuxt 4 avec SSR désactivé, `pathPrefix: false`
- Installation : `@vuetify/v0`, `drizzle-orm`, `sass`, `pg`
- Config SCSS : variables, reset, fonts
- Schéma Drizzle + migration initiale
- Routes API profils (GET, POST, DELETE)
- Page d'accueil : sélection et création de profils

**Livrable :** on peut créer/choisir un profil, les données persistent en DB

---

### Phase 2 — Module "Les mots"
- Page `[profile]/words.vue`
- Composant `WordBoard` : affichage emoji + article + cases
- Composant `LetterTile` : tuile draggable colorée
- Composant `DropSlot` : case de dépôt avec validation
- Composable `useDragDrop` : gestion pointer events tactile
- Composable `useSpeech` : TTS français
- Données : fichier `data/words.ts` avec mots par niveau et thème
- Enregistrement progression en DB (module `words`, ref = le mot)

**Livrable :** module entièrement jouable

---

### Phase 3 — Module "Tracer"
- Page `[profile]/tracing.vue`
- Composant `TracingCanvas` : canvas avec gestion pointermove/pointerdown/pointerup
- Composant `LetterNav` : navigation dans l'alphabet, lettres déjà tracées
- Filigrane de la lettre sur le canvas
- Modèle de référence latéral
- Enregistrement progression (module `tracing`, ref = la lettre)

**Livrable :** module entièrement jouable

---

### Phase 4 — Module "Syllabes"
- Page `[profile]/syllables.vue`
- Données : `data/syllables.json` — liste des syllabes valides
- Composant `LetterBank` : consonnes + voyelles draggables
- Composant `SyllableZone` : zone de composition
- Validation contre la liste + TTS si valide
- Réutilisation de `useDragDrop` et `useSpeech`

**Livrable :** module entièrement jouable

---

### Phase 5 — Module "Calculette"
- Page `[profile]/calculator.vue`
- Composant `NumberTile` et `OperatorTile`
- Composant `CalcBoard` : zone opération + résultat auto
- Gestion division entière uniquement
- Réutilisation de `useDragDrop`

**Livrable :** module entièrement jouable

---

### Phase 6 — Finitions ✅
- ✅ Animations de transition entre pages (`pageTransition` global + classes `.page-*` dans `main.scss`).
- ✅ Écran de célébration commun (`app/components/CelebrationOverlay.vue`, utilisé par `words.vue`, prêt pour les autres modules).
- ✅ Affichage de la progression par module sur le menu (déjà en place depuis la phase 2 via `useProgress.completedCount`).
- ✅ Responsive mobile portrait : breakpoint `480px` ajouté sur tuiles (LetterTile/DropSlot/NumberTile/OperatorTile/CalcBoard) et paddings de pages, en plus du `860px` existant pour tablette portrait.
- ✅ Externalisation du contenu : `public/data/words.json` + `public/data/syllables.json` chargés via `loadWords()` / `loadSyllables()` (cache mémoire avec promesse singleton). La calculette reste générée par `compute()`.
- ✅ Pinch-zoom bloqué : meta viewport `maximum-scale=1, user-scalable=no` + `touch-action: manipulation` sur `html`/`body` + plugin client `app/plugins/disable-zoom.client.ts` (gesturestart/gesturechange/gestureend + double-tap + ctrl+wheel).
- ⏳ Tests sur tablette réelle tactile — manuel.
- ⏳ Vérification TTS sur différents navigateurs (Chrome, Safari) — manuel.

---

## Notes pour Claude Code

- Toujours utiliser `<style lang="scss" scoped>` dans les composants Vue
- Les composants sont appelés sans préfixe de dossier (`<LetterTile />` et non `<ModulesWordsLetterTile />`)
- Le drag & drop doit gérer les pointer events (pas mouse events) pour le support tactile
- Le TTS utilise `window.speechSynthesis` avec `lang: 'fr-FR'` et voix française si disponible
- Les données de contenu (mots, syllabes) sont des fichiers statiques TypeScript/JSON dans `app/data/`, pas en DB
- La progression en DB stocke uniquement les complétions (profileId + module + ref + date), pas les tentatives
