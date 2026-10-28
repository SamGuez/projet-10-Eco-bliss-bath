import { API_URL as apiUrl } from '../../support/constants';
describe('API - Produits', () => {

  it('retourne la fiche d\'un produit', () => {
    cy.fixture('products').then(({ available }) => {
      cy.request(`${apiUrl}/products/${available.id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', available.id);
        ['name', 'description', 'price', 'picture', 'availableStock'].forEach(
          (champ) => expect(response.body).to.have.property(champ)
        );
      });
    });
  });

  it('retourne 404 pour un produit inexistant', () => {
    cy.request({
      url: `${apiUrl}/products/9999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});