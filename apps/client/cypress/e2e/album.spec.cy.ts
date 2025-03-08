beforeEach(() => {
  cy.login('rayabby@email.com', 'rayabby')
})

describe('album', () => {
  beforeEach(() => {
    cy.visit('/central/albums/676adba6f8feee5442f49dac')
  })

  // SHOULD DISPLAY RATING.
  it('should display rating', () => {
    cy.get("[data-cy='rating']")
      .should('be.visible');
  })

  // SHOULD ADD TO LIST.
  it('should add album to list', () => {
    // REMOVE FROM LIST.
    cy.get('[data-cy="addToList"]')
    .click();
  
    cy.get('[data-cy="list"]')
      .first()
      .click()
      .wait(2000);

    // ADD TO LIST.
    cy.get('[data-cy="addToList"]')
      .click();
    
    cy.get('[data-cy="list"]')
      .first()
      .click()
      .wait(2000);
    
    cy.get('[data-cy="addToList"]')
    .click()
    .get('[data-cy="check"]')
    .should('be.visible');
    

  })

  // SHOULD SEND ALBUM REC.
  it('should get album rec dialogye', () => {
    cy.get('[data-cy="albumRec"]')
      .click();

    cy.get('[data-cy="title"]')
      .should('be.visible');
  })

  // GET MORE ALBUMS BY THIS ARTIST.
  it('should get more albums by this artist', () => {
    cy.get('[data-cy="anotherAlbum"')
      .contains('Troye Sivan')
      .should('be.visible');
  })

  // WRITE A REVIEW.
  it('should add a new review', () => {
    cy.get('[data-cy="writeReviewBtn"]')
      .click();
    
    cy.get('[data-cy="star"')
      .first()
      .click();

    cy.get('[data-cy="reviewText"]')
      .click()
      .type('this is a short review that is more than ten characters');
    
    cy.get('[data-cy="submitBtn"]')
      .click();

    cy.get('[data-cy="reviewCard"]')
      .contains('rayabby')
      .should('be.visible');
  })

  // DELETE A REVIEW.
  it('should delete a review', () => {
    cy.get('[data-cy="reviewCard')
      .first()
      .get('[data-cy="deleteBtn"]')
      .click()
      .get('[data-cy="deleteDialog"]')
      .get('[data-cy="confirmDeleteBtn"]')
      .click();
  })

})