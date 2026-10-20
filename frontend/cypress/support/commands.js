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