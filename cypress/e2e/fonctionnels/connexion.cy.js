describe('Fonctionnel - Connexion', () => {
  it('connecte un utilisateur existant et affiche le panier', () => {
    cy.fixture('user').then(({ valid }) => {
      cy.visit('/#/');
      cy.get('[data-cy="nav-link-login"]').click();
      cy.get('[data-cy="login-form"]').should('be.visible');

      cy.get('[data-cy="login-input-username"]').type(valid.username);
      cy.get('[data-cy="login-input-password"]').type(valid.password);
      cy.get('[data-cy="login-submit"]').click();

      // Une fois connecté : le bouton panier apparaît, le bouton connexion disparaît
      cy.get('[data-cy="nav-link-cart"]').should('be.visible');
      cy.get('[data-cy="nav-link-login"]').should('not.exist');
    });
  });

  it('refuse la connexion avec de mauvais identifiants', () => {
    cy.fixture('user').then(({ unknown }) => {
      cy.uiLogin(unknown);

      // Pas connecté : on reste sur la page de connexion, sans bouton panier
      cy.url().should('include', '/login');
      cy.get('[data-cy="nav-link-cart"]').should('not.exist');
    });
  });
});