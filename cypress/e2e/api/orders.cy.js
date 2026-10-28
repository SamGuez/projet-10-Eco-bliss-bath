import { API_URL as apiUrl } from '../../support/constants';
describe('API - Panier', () => {
  
  it('refuse l\'accès au panier sans connexion (401)', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/orders`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('ajoute un produit disponible au panier', () => {
    cy.fixture('products').then(({ available }) => {
      cy.authRequest({
        method: 'PUT',
        url: '/orders/add',
        body: { product: available.id, quantity: available.quantity },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      // On relit le panier pour vérifier que le produit y est
      cy.authRequest({ method: 'GET', url: '/orders' }).then((response) => {
        expect(response.status).to.eq(200);
        const ids = response.body.orderLines.map((l) => l.product.id);
        expect(ids).to.include(available.id);
      });
    });
  });

  it('refuse l\'ajout d\'un produit en rupture de stock', () => {
    cy.fixture('products').then(({ outOfStock }) => {
      cy.authRequest({
        method: 'PUT',
        url: '/orders/add',
        body: { product: outOfStock.id, quantity: outOfStock.quantity },
      }).then((response) => {
        expect(response.status).to.not.eq(200); // échouera : bug connu
      });
    });
  });
});