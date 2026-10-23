describe('Fonctionnel - Panier', () => {
  let product;

  before(() => {
    cy.fixture('products').then(({ available }) => {
      product = available;
    });
  });

  // Avant chaque test : on se connecte via le site
  beforeEach(() => {
    cy.fixture('user').then(({ valid }) => cy.uiLogin(valid));
    cy.get('[data-cy="nav-link-cart"]').should('be.visible');
  });

  it('affiche le champ de disponibilité sur la fiche produit', () => {
    cy.visit(`/#/products/${product.id}`);
    cy.get('[data-cy="detail-product-stock"]').should('be.visible');
    cy.get('[data-cy="detail-product-add"]').should('be.visible');
  });

  it('ajoute un produit au panier et diminue le stock', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');

    cy.visit(`/#/products/${product.id}`);
    cy.getStock().then((stockAvant) => {
      cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
      cy.get('[data-cy="detail-product-add"]').click();
      cy.wait('@addToCart').its('response.statusCode').should('eq', 200);

      // Le produit est dans le panier
      cy.visit('/#/cart');
      cy.get('[data-cy="cart-line-name"]').should('contain', 'Poussière de lune');

      // Le stock a diminué de 1
      cy.visit(`/#/products/${product.id}`);
      cy.getStock().should('eq', stockAvant - 1);
    });
  });

  it('refuse une quantité négative', () => {
    cy.visit(`/#/products/${product.id}`);
    cy.getStock().then((stockAvant) => {
      cy.get('[data-cy="detail-product-quantity"]').clear().type('-1');
      cy.get('[data-cy="detail-product-add"]').click();

      // Le stock ne doit pas avoir changé
      cy.visit(`/#/products/${product.id}`);
      cy.getStock().should('eq', stockAvant);
    });
  });

  it('refuse une quantité supérieure à 20', () => {
    cy.visit(`/#/products/${product.id}`);
    cy.getStock().then((stockAvant) => {
      cy.get('[data-cy="detail-product-quantity"]').clear().type('21');
      cy.get('[data-cy="detail-product-add"]').click();

      cy.visit(`/#/products/${product.id}`);
      cy.getStock().should('eq', stockAvant);
    });
  });
});