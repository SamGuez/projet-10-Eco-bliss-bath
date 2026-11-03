# Eco Bliss Bath - Tests automatisés (Cypress)

Ce dépôt contient les tests automatisés du site e-commerce Eco Bliss Bath
(produits de beauté écoresponsables), écrits en JavaScript avec Cypress.

Il ne contient **que les tests**. L'application testée est dans le projet
original : https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2

## Contenu des tests

- **API** : login, panier, produits, avis, limites de quantité
- **Fonctionnels** : connexion et panier
- **Smoke tests** : éléments essentiels du site
- **Sécurité** : faille XSS dans les avis

Les tests sont dans `cypress/e2e/`.

## Prérequis

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (version utilisée : 24)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 1. Lancer l'application à tester

Cloner le projet original, puis dans son dossier :

```bash
docker compose up -d
cd frontend
npm install
npm start
```

- API : `http://localhost:8081` (documentation : `http://localhost:8081/api/doc`)
- Site : `http://localhost:4200`

Laisser ce terminal ouvert et en ouvrir un second pour les tests.

## 2. Installer les tests

```bash
git clone https://github.com/SamGuez/projet-10-Eco-bliss-bath.git
cd projet-10-Eco-bliss-bath
npm install
```

## 3. Lancer les tests

L'application et l'API doivent être démarrées.

**Mode interactif** (fenêtre Cypress) :

```bash
npx cypress open
```

**Mode terminal** (tous les tests) :

```bash
npx cypress run
```

**Un seul fichier** :

```bash
npx cypress run --spec "cypress/e2e/api/login.cy.js"
```

## 4. Générer le rapport

Le rapport HTML est créé automatiquement à la fin de `npx cypress run`.
Il se trouve dans :

```
cypress/reports/html/index.html
```

Ouvrir ce fichier dans un navigateur pour voir les résultats et les captures d'écran des tests en échec.

## Données de test

- Compte utilisateur : `test2@test.fr` / `testtest`
- Produit disponible (tests d'ajout) : id 5
- Produit en rupture de stock : id 3
- Produit des tests de limites de quantité : id 9

Ces valeurs sont dans `cypress/fixtures/`.

## Résultats attendus

Sur la version actuelle de l'application, **4 tests échouent volontairement**, car ils détectent des anomalies :

- ajout d'un produit en rupture de stock accepté
- mot de passe exposé dans la réponse de `POST /reviews`
- quantité de 0 acceptée
- quantité supérieure à 20 acceptée

Les autres tests réussissent. Le détail est dans le bilan de campagne de test.

## Remarques

- Les tests d'ajout au panier **consomment du stock** (produits 5 et 9). Si un test d'ajout échoue sans raison, vérifier le stock sur `http://localhost:8081/products` et vider le panier.
- Les tests de limites ajoutent des lignes au panier tant que les anomalies existent.