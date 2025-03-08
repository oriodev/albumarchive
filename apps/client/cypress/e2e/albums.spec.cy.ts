beforeEach(() => {
  cy.login('rayabby@email.com', 'rayabby')
})

describe('albums', () => {
  beforeEach(() => {
    cy.visit('/central/albums')
  })

  // FIND ALBUM PAGE.
  it('find album page', () => {
    cy.contains('Search For Your Favourite Albums.').should('be.visible');
  })

  // CHECK DISCOGS WORKS.
  it('check discogs search', () => {
    cy.get('[data-cy="searchType"]')
      .click()
      .get('[data-cy="searchType-wider"]')
      .click()
      .get('[data-cy="searchbar"]')
      .type('abc')
      .get('[data-cy="submitBtn"]')
      .click()
    
    cy.contains('The Jackson 5', {timeout: 5000})
      .should('be.visible');
  })

  // CHECK LOCAL SEARCH WORKS.
  it('check local search', () => {
    cy.intercept('GET', '/albums?search=Something+To+Give+Each+Other&page=1')
      .as('getAlbums');

    cy.get('[data-cy="searchType"]')
      .click()
      .get('[data-cy="searchType-local"]')
      .click()
      .get('[data-cy="searchbar"]')
      .type('Something To Give Each Other')
      .get('[data-cy="submitBtn"]')
      .click()
    
    cy.wait('@getAlbums');
    
    cy.contains('Something To Give Each', {timeout: 5000})
      .should('be.visible');
  })

  // CHECK ALBUM POP UP.
  it('check album popup and page', () => {
    cy.contains('TRXYE')
      .click()
      .get('[data-cy="seeFullAlbumBtn"]')
      .click()
      .get('[data-cy="moreAlbums"]', {timeout: 5000})
      .should('be.visible');
  })
})