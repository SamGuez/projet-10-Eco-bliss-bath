# Eco Bliss Bath - Tests automatisés (Cypress)

Ce dépôt contient les tests automatisés du site e-commerce Eco Bliss Bath
(produits de beauté écoresponsables), écrits en JavaScript avec Cypress.

## Contenu des tests

- **API** : login, panier, produits, avis, limites de quantité
- **Fonctionnels** : connexion et panier
- **Smoke tests** : éléments essentiels du site
- **Sécurité** : faille XSS dans les avis

Les tests sont dans `frontend/cypress/e2e/`.

## Prérequis

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (version utilisée : 24)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation

```bash
git clone https://github.com/TON-PSEUDO/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```

Lancer l'API et la base de données (à la racine du projet) :

```bash
docker compose up -d
```

L'API est accessible sur `http://localhost:8081` (documentation : `http://localhost:8081/api/doc`).

Installer les dépendances du front-end :

```bash
cd frontend
npm install
```

## Lancer le site

Dans le dossier `frontend` :

```bash
npm start
```

Le site est accessible sur `http://localhost:4200`.
Laisser ce terminal ouvert et en ouvrir un second pour les tests.

## Lancer les tests

Le site et l'API doivent être démarrés. Dans le dossier `frontend` :

**Mode interactif** (fenêtre Cypress) :

```bash
npx cypress open
```

**Mode terminal** (tous les tests) :

```bash
npx cypress run
```

**Un seul fichier de test** :

```bash
npx cypress run --spec "cypress/e2e/api/login.cy.js"
```

## Générer le rapport

Le rapport HTML est créé automatiquement à la fin de `npx cypress run`.
Il se trouve dans :

```
frontend/cypress/reports/html/index.html
```

Ouvrir ce fichier dans un navigateur pour consulter les résultats, avec les captures d'écran des tests en échec.

## Données de test

- Compte utilisateur : `test2@test.fr` / `testtest`
- Produit disponible (tests d'ajout) : id 5
- Produit en rupture de stock : id 3
- Produit des tests de limites de quantité : id 9

Les identifiants sont définis dans `frontend/cypress/fixtures/`.

## Résultats attendus

Sur la version actuelle, **4 tests échouent volontairement**, car ils détectent des anomalies :

- ajout d'un produit en rupture de stock accepté
- mot de passe exposé dans la réponse de `POST /reviews`
- quantité de 0 acceptée
- quantité supérieure à 20 acceptée

Les autres tests réussissent. Le détail est dans le bilan de campagne de test.

## Remarques

- Les tests d'ajout au panier **consomment du stock** (produits 5 et 9). Si un test d'ajout échoue sans raison, vérifier le stock sur `http://localhost:8081/products` et vider le panier.
- Les tests de limites ajoutent des lignes au panier de l'utilisateur de test tant que les anomalies existent.