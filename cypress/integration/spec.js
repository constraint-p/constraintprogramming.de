describe('Sapper template app', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct <h1>', () => {
		cy.contains('h1', 'The Penniless Pilgrim Riddle')
	});

	it('home navigates to /', () => {
		cy.get('nav a').contains('home').click();
		cy.url().should('include', '/');
	});

  it('contains usage hint at the start', () => {
    cy.contains('p', 'Use the arrow keys to reach the goal with 0.0 silver owed as tax.')
  });

  it('usage hint disappears when engaging with the puzzle', () => {
    cy.contains('.infinite.bounce', 'Use the arrow keys to reach the goal with 0.0 silver owed as tax.')
    cy.get('body').type('{downarrow}')
    cy.get('.infinite.bounce').should('not.exist');
  });

  it('displays no-way-out when stuck', () => {
    cy.get('body').type('{downarrow}{leftarrow}{uparrow}')
    cy.contains('p', 'Use the arrow keys to reach the goal with 0.0 silver owed as tax.')
  });

  it('success displayed after solving the riddle', () => {
    cy.get('body').type('{downarrow}{downarrow}{downarrow}{rightarrow}{rightarrow}{uparrow}{uparrow}{uparrow}{leftarrow}{downarrow}{leftarrow}{leftarrow}{leftarrow}{downarrow}{downarrow}{downarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}')
    cy.get('.toast-body').contains('You solved it. Congratulations!')
  });
});
