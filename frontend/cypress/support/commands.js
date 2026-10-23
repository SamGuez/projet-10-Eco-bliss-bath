import { API_URL } from './constants';

Cypress.Commands.add('apiLogin', (user) => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/login`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('getToken', () => {
  return cy
    .fixture('user')
    .then(({ valid }) => cy.apiLogin(valid))
    .its('body.token');
});

Cypress.Commands.add('authRequest', (options) => {
  return cy.getToken().then((token) =>
    cy.request({
      ...options,
      url: `${API_URL}${options.url}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    })
  );
});

// Se connecte via l'interface du site (formulaire)
Cypress.Commands.add('uiLogin', (user) => {
  cy.visit('/#/');
  cy.get('[data-cy="nav-link-login"]').click();
  cy.get('[data-cy="login-input-username"]').type(user.username);
  cy.get('[data-cy="login-input-password"]').type(user.password);
  cy.get('[data-cy="login-submit"]').click();
});

// Lit le stock affiché sur une fiche produit ("23 en stock" -> 23)
Cypress.Commands.add('getStock', () => {
  return cy
    .get('[data-cy="detail-product-stock"]')
    .invoke('text')
    .should('match', /-?\d+\s*en stock/) // on attend que le chiffre soit chargé
    .then((text) => parseInt(text.match(/-?\d+/)[0], 10));
});