describe('Functions not requiring authorization', () => {

  it('should open the Spotify authorization page upon clicking the "Connect with Spotify" button', () => {
    cy.visit(Cypress.env('REACT_APP_CLIENT_URL'));
    cy.intercept('GET', '**/spotify/auth-url').as('getAuthUrl');
    cy.wait('@getAuthUrl').its('response.statusCode').should('eq', 200);
    cy.get('@getAuthUrl').its('response.body').then((response) => {
      const spotifyAuthURL = response.authURL;
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });
      cy.get('[data-cy = "btnLogin"]').click();
      cy.get('@windowOpen').should('be.calledWith', spotifyAuthURL);
    });
  });

  it('should open the homepage upon clicking the Home button', () => {
    cy.visit(Cypress.env('REACT_APP_CLIENT_URL') + '#/artist/776Uo845nYHJpNaStv1Ds4');
    cy.get('[data-cy = "btnHome"]').click();
    cy.url().should('eq', Cypress.env('REACT_APP_CLIENT_URL') + '/#/');
  });

  it('should display empty artist details if not connected with Spotify', () => {
    cy.visit(Cypress.env('REACT_APP_CLIENT_URL') + '#/artist/776Uo845nYHJpNaStv1Ds4');
    cy.get('[data-cy = "btnKebab"]').click();
    cy.get('[data-cy = "itemDetails"]').click();
    cy.get('[data-cy = "artistName"]').should('have.text', 'Unknown artist');
  });

  it('should change the microphone icon color accordingly upon clicking the icon', () => {
    cy.visit(Cypress.env('REACT_APP_CLIENT_URL'));
    cy.get('[data-cy = "microphone"]').click().should('have.css', 'filter', 'none');
    cy.get('[data-cy = "microphone"]').click().should('have.css', 'filter', 'brightness(0.5)');
  });
});