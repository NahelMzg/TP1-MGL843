# Gestionnaire de Notes - TypeScript

Un gestionnaire de notes simple et efficace en ligne de commande (CLI) développé en TypeScript avec Node.js.

## Fonctionnalités

- ✅ **Créer des notes** avec titre, contenu et tags
- ✅ **Lister toutes les notes** ou afficher une note spécifique
- ✅ **Associer des étiquettes (tags)** pour organiser les notes
- ✅ **Rechercher des notes** dans les titres, contenus et tags
- ✅ **Sauvegarder et exporter** les notes localement en JSON
- ✅ **Importer des notes** depuis un fichier JSON
- ✅ **Persistance automatique** des données
- ✅ **Tests fonctionnels complets** avec Jest

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd notes-manager

# Installer les dépendances
npm install

# Compiler le TypeScript
npm run build
```

## Utilisation

### Créer une note

```bash
npm run dev -- create -t "Ma première note" -c "Contenu de la note" -g "travail,important"
```

### Lister toutes les notes

```bash
# Liste simple
npm run dev -- list

# Liste détaillée
npm run dev -- list -v
```

### Afficher une note spécifique

```bash
npm run dev -- show -i <note-id>
```

### Rechercher des notes

```bash
npm run dev -- search -q "projet"
```

### Filtrer par tag

```bash
npm run dev -- tag -t "travail"
```

### Supprimer une note

```bash
npm run dev -- delete -i <note-id>
```

### Exporter les notes

```bash
npm run dev -- export -o ./backup.json
```

### Importer des notes

```bash
# Remplacer toutes les notes
npm run dev -- import -i ./backup.json

# Fusionner avec les notes existantes
npm run dev -- import -i ./backup.json -m
```

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `create` | Créer une nouvelle note |
| `list` | Lister toutes les notes |
| `show` | Afficher une note par son ID |
| `search` | Rechercher des notes |
| `tag` | Filtrer les notes par étiquette |
| `delete` | Supprimer une note |
| `export` | Exporter les notes |
| `import` | Importer des notes |

### Options globales

- `--help` : Afficher l'aide
- `--version` : Afficher la version

## Tests

Le projet utilise Jest pour les tests fonctionnels.

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch
```

### Couverture des tests

Les tests couvrent toutes les fonctionnalités principales :

- ✅ Création de notes avec et sans tags
- ✅ Listage et affichage des notes
- ✅ Association et recherche par tags
- ✅ Recherche de notes (titre, contenu, tags)
- ✅ Export et import de notes
- ✅ Suppression et modification de notes
- ✅ Persistance des données
- ✅ Scénarios d'utilisation complets

## Structure du projet

```
notes-manager/
├── src/
│   ├── types.ts           # Définition des types TypeScript
│   ├── NotesManager.ts    # Classe principale de gestion
│   └── index.ts           # Interface CLI
├── tests/
│   └── notes.test.ts      # Tests fonctionnels
├── .github/
│   └── workflows/
│       └── test.yml       # GitHub Actions CI/CD
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Persistance des données

Les notes sont automatiquement sauvegardées dans un fichier `notes.json` à la racine du projet. Ce fichier est créé automatiquement lors de la première utilisation.

### Format du fichier JSON

```json
{
  "notes": [
    {
      "id": "note_1234567890_abc123",
      "title": "Ma note",
      "content": "Contenu de la note",
      "tags": ["travail", "important"],
      "createdAt": "2025-01-19T10:30:00.000Z",
      "updatedAt": "2025-01-19T10:30:00.000Z"
    }
  ]
}
```

## CI/CD avec GitHub Actions

Le projet inclut une configuration GitHub Actions qui exécute automatiquement les tests à chaque commit sur les branches `main` et `develop`.

Les tests sont exécutés sur Node.js 18.x et 20.x pour garantir la compatibilité.

## Technologies utilisées

- **TypeScript** - Langage de programmation
- **Node.js** - Environnement d'exécution
- **Commander.js** - Parsing des arguments CLI
- **Jest** - Framework de tests
- **ts-jest** - Support TypeScript pour Jest

## Développement

```bash
# Mode développement avec rechargement automatique
npm run dev -- <commande>

# Compiler le TypeScript
npm run build

# Nettoyer les fichiers compilés
npm run clean
```

## Exemples d'utilisation

### Scénario 1 : Gestion de projet

```bash
# Créer des notes pour un projet
npm run dev -- create -t "Réunion kick-off" -c "Définir les objectifs" -g "projet,reunion"
npm run dev -- create -t "Liste des tâches" -c "Tâche 1, 2, 3" -g "projet,todo"
npm run dev -- create -t "Budget" -c "5000€ alloués" -g "projet,finance"

# Voir toutes les notes du projet
npm run dev -- tag -t "projet"

# Exporter pour sauvegarde
npm run dev -- export -o ./projet-backup.json
```

### Scénario 2 : Notes personnelles

```bash
# Créer des notes personnelles
npm run dev -- create -t "Courses" -c "Lait, pain, œufs" -g "personnel,courses"
npm run dev -- create -t "Rendez-vous médecin" -c "Lundi 10h" -g "personnel,sante"

# Rechercher toutes les notes personnelles
npm run dev -- search -q "personnel"
```

## Licence

MIT

## Auteur

Développé avec TypeScript et Node.js


## Prompt utilisé pour vibecoder ce projet 

Prompt utilisé avec Claude : (temps 20mn)

Tu es un codeur expérimenté et tu dois réaliser un petit logiciel simple de création de  notes en Typescript dont les spécifications te sont données ci-après. A partir de ces spécifications, prends les initiatives nécessaires pour réaliser ce logiciel, avec ou sans interface utilisateur, selon ce que tu penses être la meilleure solution. 

Voici les fonctionnalités minimales du logiciel :
— Créer des notes
— Afficher (lister) des notes
— Associer des étiquettes (tags)
— Rechercher des notes
— Sauvegarder (exporter) les notes localement


Voici les spécifications du logiciel :
— Langage : TypeScript
— Environnement : Node.js
— Persistance locale (ex. fichier JSON, SQLite, etc.)
— Interface : CLI ou API REST simple
— Tests automatisés : tests de fonctionnalité avec Jest

Voici les contraintes sur les tests :
— Utiliser le framework de test Jest pour écrire les tests.
— Les tests doivent être des tests de fonctionnalité (end-to-end ou intégration légère).
— Aucun test unitaire n’est requis ni attendu.
— Cette contrainte est intentionnelle : en l’absence d’une conception modulaire explicite, l’écriture de
tests unitaires serait artificielle et peu représentative de la réalité du code généré.
— Les tests doivent couvrir les fonctionnalités minimales listées ci-dessus.
— Les tests doivent être exécutables via une commande npm (ex. npm test), idéalement dans une
action GitHub lors de chaque commit.