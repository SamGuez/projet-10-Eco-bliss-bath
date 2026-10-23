describe('Smoke tests', () => {
  describe('Page de connexion', () => {
    beforeEach(() => {
      cy.visit('/#/');
      cy.get('[data-cy="nav-link-login"]').click();
    });

    it('affiche le formulaire de connexion', () => {
      cy.get('[data-cy="login-form"]').should('be.visible');
    });

    it('affiche le champ email', () => {
      cy.get('[data-cy="login-input-username"]').should('be.visible');
    });

    it('affiche le champ mot de passe', () => {
      cy.get('[data-cy="login-input-password"]').should('be.visible');
    });

    it('affiche le bouton de connexion', () => {
      cy.get('[data-cy="login-submit"]')
        .should('be.visible')
        .and('contain', 'Se connecter');
    });
  });

  describe('Fiche produit (utilisateur connecté)', () => {
    beforeEach(() => {
      cy.fixture('user').then(({ valid }) => cy.uiLogin(valid));
      cy.get('[data-cy="nav-link-cart"]').should('be.visible');
    });

    it('affiche le bouton d\'ajout au panier', () => {
      cy.fixture('products').then(({ available }) => {
        cy.visit(`/#/products/${available.id}`);
        cy.get('[data-cy="detail-product-add"]')
          .should('be.visible')
          .and('contain', 'Ajouter au panier');
      });
    });

    it('affiche le champ quantité et la disponibilité', () => {
      cy.fixture('products').then(({ available }) => {
        cy.visit(`/#/products/${available.id}`);
        cy.get('[data-cy="detail-product-quantity"]').should('be.visible');
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
      });
    });
  });
});