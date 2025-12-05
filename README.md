# MazeID - Solution Défi Nuit de l'Info 2025

## 📋 Présentation du Projet

**MazeID** est une solution innovante pour le défi de la Nuit de l'Info 2025 qui propose une alternative originale et amusante à l'authentification traditionnelle par login/password. Au lieu d'utiliser des mots de passe textuels, les utilisateurs créent et mémorisent un **pattern de labyrinthe** unique qu'ils doivent reproduire pour s'authentifier.

### 🎯 Contexte du Défi

La plupart des sites WEB demandent à l'utilisateur de s'identifier. Alors que les smartphones ou leurs applis proposent quelques interfaces différentes (code PIN, figure géométrique à dessiner, empreinte digitale, etc.), les sites WEB ne proposent quasi exclusivement que la fameuse interface login/password sous forme de TextBox.

**Le but de ce défi** est de concevoir une interface ou d'imaginer une méthode originale, amusante ou surprenante de s'identifier.

### 🌟 Thème NIRD

Cette solution respecte le thème **NIRD** (Numérique – Inclusive – Responsable – Durable) :

- **Numérique** : Interface moderne et interactive utilisant Canvas, JavaScript/TypeScript, et technologies web modernes
- **Inclusif** : Accès par souris ou clavier, options d'accessibilité (ARIA labels, navigation au clavier)
- **Responsable** : Pas de données sensibles stockées en clair, faible empreinte énergétique, hachage sécurisé
- **Durable** : Interface légère, code réutilisable et maintenable, architecture modulaire

---

## 🏗️ Architecture du Projet

Le projet est organisé en deux parties principales :

```
MazeLogin/
├── register/          # Frontend React/TypeScript
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   └── services/      # Services API
│   └── package.json
│
└── backend/           # Backend Node.js/Express
    ├── src/
    │   ├── controllers/   # Contrôleurs API
    │   ├── models/        # Modèles MongoDB
    │   ├── routes/        # Routes Express
    │   └── utils/         # Utilitaires (mazeUtils)
    └── package.json
```

---

## 📚 Explication des Codes Sources

### Frontend (`register/`)

#### 1. **RegisterPage.tsx** - Page d'Inscription

**Localisation** : `register/src/components/RegisterPage.tsx`

**Fonctionnalité** : Interface d'inscription permettant à l'utilisateur de créer son compte et son pattern de labyrinthe.

**Éléments clés** :
- **Formulaire de nom d'utilisateur** : Champ texte pour saisir le nom d'utilisateur
- **MazeEditor** : Composant intégré permettant de dessiner le pattern de labyrinthe
- **Gestion d'erreurs** : Affichage des erreurs de validation ou d'inscription
- **Design moderne** : Interface split-screen avec section visuelle à gauche et formulaire à droite

**Code principal** :
```typescript
const handleSaveMaze = async (mazeConfig: MazeConfig) => {
    // Validation du nom d'utilisateur
    // Envoi de la configuration du labyrinthe au backend
    // Stockage du token JWT dans localStorage
    // Redirection vers le dashboard
}
```

---

#### 2. **MazeEditor.tsx** - Éditeur de Labyrinthe

**Localisation** : `register/src/components/MazeEditor.tsx`

**Fonctionnalité** : Composant interactif permettant de créer un pattern de labyrinthe personnalisé.

**Fonctionnalités détaillées** :

1. **Sélection de la taille de grille** : 10x10, 12x12, ou 15x15 cellules
2. **Placement du point de départ (Start)** :
   - Doit être sur le bord de la grille
   - Affiché en vert
   - Cliquer pour le placer ou le retirer
3. **Dessin du chemin (Path)** :
   - Clic sur des cellules adjacentes pour créer un chemin continu
   - Support du drag-and-drop (souris)
   - Le chemin est affiché en rouge
   - Possibilité de revenir en arrière en cliquant sur une cellule déjà dans le chemin
4. **Point d'arrivée (Exit)** :
   - Automatiquement défini comme la dernière cellule du chemin si elle est sur le bord
   - Affiché en rouge
5. **Génération automatique des murs** :
   - Les murs sont générés aléatoirement (40% de probabilité)
   - Jamais sur le chemin, le start ou l'exit
   - Affichés en noir
6. **Bouton Reset** : Réinitialise complètement le labyrinthe
7. **Bouton Create Maze** : Sauvegarde la configuration

**Accessibilité** :
- Support clavier : `Enter` ou `Espace` pour activer une cellule
- Attributs ARIA : `role="button"`, `aria-label` pour lecteurs d'écran
- `tabIndex={0}` pour navigation au clavier

**Code clé** :
```typescript
const addToPath = useCallback((x: number, y: number) => {
    // Vérifie que le point est adjacent au dernier point du chemin
    // Ajoute le point au chemin si valide
    // Gère le backtracking si on clique sur un point existant
}, [start]);
```

---

#### 3. **Login.tsx** - Page de Connexion

**Localisation** : `register/src/pages/Login.tsx`

**Fonctionnalité** : Interface de connexion en deux étapes.

**Étapes** :

1. **Saisie du nom d'utilisateur** :
   - Champ texte avec validation visuelle
   - Bouton "Load Maze" pour charger le labyrinthe de l'utilisateur
   - Indicateur de chargement pendant la requête API

2. **Résolution du labyrinthe** :
   - Affichage du labyrinthe avec `MazePathSolver`
   - L'utilisateur doit redessiner son pattern enregistré
   - Validation automatique quand le chemin atteint l'exit

**Design** :
- Interface split-screen similaire à la page d'inscription
- Section artistique à gauche avec image de fond
- Formulaire à droite avec fond glassmorphism

---

#### 4. **MazePathSolver.tsx** - Résolveur de Labyrinthe

**Localisation** : `register/src/components/MazePathSolver.tsx`

**Fonctionnalité** : Composant permettant à l'utilisateur de redessiner son pattern lors de la connexion.

**Différences avec MazeEditor** :
- **Pas d'indices visuels** : Le start et l'exit ne sont pas visibles (sécurité)
- **Chemin en jaune** : Le chemin dessiné est affiché en jaune (différent du rouge de l'éditeur)
- **Murs en noir** : Les murs sont affichés pour guider l'utilisateur
- **Validation automatique** : Quand le chemin atteint l'exit, soumission automatique après 300ms
- **Bouton Clear Path** : Permet de recommencer le dessin

**Sécurité** :
- Le start et l'exit ne sont pas visibles pour éviter les attaques par observation
- Seul le pattern complet est validé côté serveur

**Code clé** :
```typescript
// Désérialisation des murs depuis base64
const deserializeWalls = (wallsString: string, gridSize: number): Set<string> => {
    // Décode base64 et reconstruit le Set de murs
}

// Détection de la complétion du chemin
if (x === exit.x && y === exit.y) {
    setPathComplete(true);
    setTimeout(() => {
        onSolve(newPath); // Soumission automatique
    }, 300);
}
```

---

#### 5. **App.tsx** - Routeur Principal

**Localisation** : `register/src/App.tsx`

**Fonctionnalité** : Configuration du routage React Router.

**Routes** :
- `/login` : Page de connexion
- `/register` : Page d'inscription
- `/` : Redirection vers `/login`

---

#### 6. **api.ts** - Service API

**Localisation** : `register/src/services/api.ts`

**Fonctionnalité** : Service centralisé pour les appels API.

**Endpoints** :
- `register(username, mazeConfig)` : Inscription avec configuration du labyrinthe
- `getMaze(username)` : Récupération du labyrinthe d'un utilisateur
- `login(username, path)` : Connexion avec validation du chemin

---

### Backend (`backend/`)

#### 1. **authController.ts** - Contrôleur d'Authentification

**Localisation** : `backend/src/controllers/authController.ts`

**Fonctionnalités** :

**a) `registerUser`** : Inscription d'un nouvel utilisateur
- Vérifie si l'utilisateur existe déjà
- Génère un salt aléatoire pour le hachage
- Série les murs en base64
- Génère un hash SHA-256 du labyrinthe (murs + start + exit + salt)
- Stocke l'utilisateur dans MongoDB
- Retourne un token JWT

**b) `getMaze`** : Récupération du labyrinthe pour la connexion
- Recherche l'utilisateur par nom d'utilisateur
- Retourne la configuration du labyrinthe (gridSize, walls, start, exit)
- **Ne retourne PAS** le hash ni le salt (sécurité)

**c) `loginUser`** : Connexion et validation
- Récupère l'utilisateur
- Désérialise les murs depuis base64
- Valide le chemin fourni avec `verifyPath`
- Retourne un token JWT si valide

**Sécurité** :
- Le hash du labyrinthe n'est jamais exposé
- Le salt est stocké mais jamais renvoyé au client
- Validation stricte du chemin (continuité, pas de collision avec les murs)

---

#### 2. **mazeUtils.ts** - Utilitaires de Labyrinthe

**Localisation** : `backend/src/utils/mazeUtils.ts`

**Fonctions** :

**a) `serializeMaze(walls, gridSize)`** :
- Convertit un tableau de points de murs en représentation binaire compacte
- Utilise un bitmask : chaque bit représente une cellule (1 = mur, 0 = vide)
- Encode en base64 pour le stockage
- **Optimisation** : Pour une grille 15x15 (225 cellules), utilise seulement 29 bytes au lieu de 225

**b) `generateMazeHash(serializedWalls, start, exit, salt)`** :
- Génère un hash SHA-256 du labyrinthe
- Combine : murs sérialisés + coordonnées start + coordonnées exit + salt
- Utilisé comme "mot de passe" sécurisé

**c) `verifyPath(path, walls, gridSize, start, exit)`** :
- Valide que le chemin fourni est correct
- Vérifications :
  1. Le chemin commence au start
  2. Le chemin se termine à l'exit
  3. Le chemin est continu (chaque point est adjacent au précédent)
  4. Aucun point du chemin n'est un mur
  5. Tous les points sont dans les limites de la grille

**Code clé** :
```typescript
export const verifyPath = (path: Point[], walls: Point[], gridSize: number, start: Point, exit: Point): boolean => {
    // Vérifie start et exit
    if (path[0].x !== start.x || path[0].y !== start.y) return false;
    if (path[path.length - 1].x !== exit.x || path[path.length - 1].y !== exit.y) return false;
    
    // Vérifie continuité et collisions
    for (let i = 1; i < path.length; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const dx = Math.abs(curr.x - prev.x);
        const dy = Math.abs(curr.y - prev.y);
        if (dx + dy !== 1) return false; // Doit être adjacent
        if (wallSet.has(`${curr.x},${curr.y}`)) return false; // Pas de mur
    }
    return true;
}
```

---

#### 3. **User.ts** - Modèle MongoDB

**Localisation** : `backend/src/models/User.ts`

**Fonctionnalité** : Schéma Mongoose pour les utilisateurs.

**Champs** :
- `username` : Nom d'utilisateur unique
- `email` : Email optionnel
- `passwordHash` : Hash de mot de passe optionnel (fallback)
- `mazeHash` : Hash SHA-256 du labyrinthe (utilisé pour l'authentification)
- `mazeConfig` : Configuration complète du labyrinthe
  - `gridSize` : Taille de la grille
  - `walls` : Murs sérialisés en base64
  - `start` : Point de départ {x, y}
  - `exit` : Point d'arrivée {x, y}
  - `path` : Chemin solution (pour affichage)
  - `salt` : Salt utilisé pour le hachage

---

## 🔒 Sécurité et Respect du Thème NIRD

### Numérique ✅
- **Technologies modernes** : React 18, TypeScript, Node.js, Express, MongoDB
- **Interface interactive** : Canvas virtuel avec grille interactive, animations CSS
- **API REST** : Architecture moderne avec séparation frontend/backend

### Inclusif ✅
- **Navigation clavier** : Toutes les cellules sont accessibles au clavier (`tabIndex`, `onKeyDown`)
- **Attributs ARIA** : `role="button"`, `aria-label` pour lecteurs d'écran
- **Support souris et clavier** : Interaction complète avec les deux méthodes
- **Feedback visuel** : Indicateurs clairs (couleurs, bordures, ombres)
- **Messages d'aide** : Instructions textuelles pour guider l'utilisateur

### Responsable ✅
- **Pas de données sensibles en clair** :
  - Le hash du labyrinthe n'est jamais exposé
  - Le salt est stocké mais jamais renvoyé
  - Les murs sont sérialisés de manière compacte
- **Hachage sécurisé** : SHA-256 avec salt unique par utilisateur
- **Faible empreinte énergétique** :
  - Pas de calculs lourds côté client
  - Sérialisation optimisée (bitmask au lieu de JSON)
  - Pas de dépendances lourdes
- **Validation côté serveur** : Toute la logique de validation est sécurisée côté backend

### Durable ✅
- **Code modulaire** : Composants React réutilisables, séparation des responsabilités
- **TypeScript** : Typage fort pour maintenabilité
- **Architecture claire** : Structure organisée, facile à comprendre et modifier
- **Interface légère** : CSS moderne avec Tailwind, pas de frameworks lourds
- **Documentation** : Code commenté, structure explicite

---

## 🚀 Installation et Utilisation

### Prérequis
- Node.js 18+
- MongoDB
- npm ou yarn

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd register
npm install
```

### Configuration

1. Créer un fichier `.env` dans `backend/` :
```env
MONGODB_URI=mongodb://localhost:27017/mazelogin
JWT_SECRET=votre_secret_jwt
PORT=5000
```

2. Démarrer MongoDB

3. Démarrer le backend :
```bash
cd backend
npm run dev
```

4. Démarrer le frontend :
```bash
cd register
npm run dev
```

### Utilisation

1. Accéder à `http://localhost:5173/register`
2. Entrer un nom d'utilisateur
3. Créer un pattern de labyrinthe :
   - Cliquer sur une cellule du bord pour placer le start (vert)
   - Cliquer sur des cellules adjacentes pour dessiner le chemin (rouge)
   - Le dernier point du chemin devient l'exit (rouge)
4. Cliquer sur "Create Maze"
5. Pour se connecter, aller sur `/login`, entrer le nom d'utilisateur, et redessiner le même pattern

---

## 🎨 Fonctionnalités Clés

- ✅ Création de pattern personnalisé (10x10, 12x12, ou 15x15)
- ✅ Génération automatique de murs aléatoires
- ✅ Validation sécurisée côté serveur
- ✅ Interface moderne et responsive
- ✅ Support clavier et souris
- ✅ Accessibilité (ARIA)
- ✅ Authentification JWT
- ✅ Stockage MongoDB

---

## 📝 Notes Techniques

- **Sérialisation des murs** : Utilisation d'un bitmask pour optimiser l'espace de stockage
- **Validation du chemin** : Vérification stricte de la continuité et absence de collisions
- **Sécurité** : Hash SHA-256 avec salt unique, jamais exposé au client
- **Performance** : Sérialisation compacte, pas de calculs lourds côté client

---
## contributors :
-> CHA9A9A TEAM
---

## 🏆 Conclusion

**MazeID** propose une solution innovante, amusante et sécurisée pour l'authentification web, respectant parfaitement le thème NIRD de la Nuit de l'Info 2025. L'interface est intuitive, accessible, et offre une expérience utilisateur unique tout en maintenant un haut niveau de sécurité.

---

**Développé pour la Nuit de l'Info 2025** 🎉

