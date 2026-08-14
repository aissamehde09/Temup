# TeamUp — spécification de maquette Figma

## Pages Figma

1. `00 — Design system`
2. `01 — Landing`
3. `02 — Authentification`
4. `03 — Dashboard`
5. `04 — Matchs`
6. `05 — Profil & paramètres`

## Design system

### Couleurs

- `Ink / 900`: `#071417`
- `Green / 600`: `#65A30D`
- `Green / 800`: `#14532D`
- `Orange / 500`: `#F97316`
- `Orange / 400`: `#FF8A00`
- `Surface / 0`: `#FFFFFF`
- `Surface / 50`: `#F8FAFC`
- `Text / muted`: `#64748B`
- `Border`: `#E2E8F0`

### Typographie

- Police : `Poppins`
- H1 desktop : 56 px, ExtraBold, interligne 1.05
- H2 : 32 px, Bold
- H3 : 22 px, Bold
- Corps : 16 px, Regular, interligne 1.55
- Légende : 13 px, Medium

### Règles

- Rayon standard : 16 px
- Rayon boutons : 12 px
- Espacement principal : 24 px
- Ombre : `0 8px 24px rgba(7,20,23,.08)`
- Grille desktop : 12 colonnes, marge 64 px, gouttière 24 px
- Largeur desktop de référence : 1440 px

## Écran 01 — Landing page

Frame : `1440 × 2200 px`, fond `#F8FAFC`.

### Header

- Hauteur : 84 px
- Logo TeamUp à gauche
- Navigation centrée : Accueil, À propos, Comment ça marche
- Actions à droite : Se connecter, S’inscrire gratuitement
- Header sticky sur desktop

### Hero

- Hauteur : 620 px
- Fond sombre `#071417`
- Deux colonnes 45/55
- Titre :

  `Envie de jouer ?`

  `Trouve des joueurs près de chez toi.`

  `Et lance ton prochain match.` en orange

- CTA vert : `Trouver un match`
- CTA secondaire sombre : `Créer un match`
- À droite : prévisualisation desktop du dashboard dans un cadre navigateur

### Sections sous le hero

- `Des matchs près de chez toi` : 3 cartes match
- `Pourquoi choisir TeamUp ?` : 4 cartes avantages
- `Comment ça marche ?` : 3 étapes numérotées
- Bandeau statistiques : `10K+`, `5K+`, `150+`, `4.8/5`
- Deux cartes sport : Football vert, Basketball orange
- CTA final sombre
- Footer en 4 colonnes : marque, navigation, aide, légal

## Écran 02 — Connexion / inscription

Frame : `1440 × 1100 px`, fond `#F8FAFC`.

- Même header que la landing
- Carte centrale largeur 560 px
- Rayon 24 px, padding 48 px
- Titre `Connexion`
- Champs avec labels visibles
- Bouton principal vert pleine largeur
- États à prévoir : erreur, chargement, succès

## Écran 03 — Dashboard

Frame : `1440 × 1024 px`.

### Sidebar

- Largeur : 264 px
- Fond `#071417`
- Logo en haut
- Navigation avec état actif vert
- Carte `Invite tes amis` en bas

### Contenu

- Zone principale : 2/3
- Colonne notifications : 1/3
- En-tête : `Bonjour Mehdi 👋`
- 3 cartes statistiques
- Deux raccourcis sport : Football / Basketball
- Carte `Mes prochains matchs`
- Carte `Organise ton match`
- Colonne droite : notifications récentes et accès rapides

## Écran 04 — Matchs

- Titre `Trouver un match`
- Barre de recherche et filtres
- Toggle `Liste / Carte`
- Mode liste : cartes horizontales
- Mode carte : Leaflet/OpenStreetMap, marqueurs verts/orange
- État vide : `Aucun match trouvé`

## Écran 05 — Profil & paramètres

- Profil : avatar, nom, ville, niveau, sports, statistiques
- Bouton d’import d’image via gestionnaire de fichiers
- Paramètres avec navigation interne : Compte, Profil, Sécurité, Notifications, Confidentialité

## Composants à créer dans Figma

- `Button / Primary`
- `Button / Secondary`
- `Input / Default`
- `Input / Error`
- `MatchCard / Football`
- `MatchCard / Basketball`
- `StatCard`
- `NotificationItem`
- `Avatar`
- `SidebarItem / Default`
- `SidebarItem / Active`
- `Modal / InviteFriend`
- `EmptyState`

## Responsive

### Tablette — 768 à 1199 px

- Sidebar réduite à 88 px avec icônes
- Dashboard en une colonne principale + notifications sous le contenu
- Cartes match en deux colonnes

### Mobile — moins de 768 px

- Header avec logo + bouton hamburger
- Sidebar transformée en menu latéral ouvrable
- Hero en une colonne
- Dashboard en une colonne
- Cartes match empilées
- Filtres empilés
- Footer en une colonne

## Prototype Figma

- Header : liens vers les frames correspondantes
- CTA landing `Trouver un match` → écran Matchs
- CTA `Créer un match` → écran Connexion si non connecté, sinon création
- Bouton `Voir le match` → détail du match
- Sidebar → Dashboard, Matchs, Mes matchs, Notifications, Profil, Paramètres
- Modal `Invite tes amis` : ouverture, copie du lien, fermeture avec X et overlay

