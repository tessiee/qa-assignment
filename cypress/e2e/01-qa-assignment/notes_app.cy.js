/// <reference types="cypress" />

describe('the basic functioning of the notes application', () => {
    // spy on console for errors or warnings
    Cypress.on('window:before:load', (win) => {
      cy.spy(win.console, 'error');
      cy.spy(win.console, 'warn');
    });
    
    beforeEach(() => {
      cy.visit('')
  
      // alias ul element
      cy.get('.app-container')
        .find('.list-container')
        .find('ul').as('ulElement')    
    })
  
    it('successfully renders the application without errors', () => {
      // verify the page title
      const pageTitle = 'React App'
      cy.title()
        .should('eq', pageTitle)
  
      // verify that the app is being rendered inside the root
      cy.get('.app-container')
        .should('be.visible')
  
      // verify that there are no errors or warnings in console log
      cy.window().then((win) => {
        expect(win.console.error).to.have.callCount(0);
        expect(win.console.warn).to.have.callCount(0);
      });
    })
  
    it('initializes the notes array as empty and renders the application with no initial notes', () => {
      // verify that the notes state array is empty on initialization
      cy.get('.app-container')
        .getComponent()
        .its('state[1]')
        .should('be.empty')
  
      // verify that the ul element is empty
      cy.get('@ulElement')
        .children()
        .should('not.exist')
  
      // verify that no notes are rendered elsewhere
      cy.get('.app-container')
        .find('.note-container')
        .should('not.exist')
    })
  
    it('can successfully submit new notes', () => {
      // store note content in variable
      const newSubmitNote = 'Test the submit functionality';
  
      // submit note via form + submit button
      cy.get('form')
        .find('#text-input')
        .type(`${newSubmitNote}`)
  
      cy.get('form')
        .contains('button', 'Submit')
        .click()
  
      // check that the ul element now contains one note
      cy.get('@ulElement')
        .children().as('note')
        .should('have.length', 1)
        .and('have.class', 'note-container')
        .and('be.visible')
  
      // check for the rendered note context
      cy.get('@note')
        .contains('li', `${newSubmitNote}`)
        .should('be.visible')
        
      // check for the delete button
      cy.get('@note')
        .contains('button', 'Delete')
        .should('be.visible')
  
      // verify that the notes state array now contains 1 note
      cy.get('.app-container')
        .getComponent()
        .its('state[1]')
        .should('have.length', 1)
        .and('have.nested.property', '0').as('firstNote')
  
      // verify that the note in the notes array is the added note
      cy.get('@firstNote')
        .should('have.property', 'content', `${newSubmitNote}`)
    })
  
    it('can successfully delete notes', () => {
      // create new note
      const newDeleteNote = 'Test the delete functionality';
      
      cy.get('form')
        .find('#text-input')
        .type(`${newDeleteNote}`)
        .parent()
        .submit()
      
      // click delete button to delete note
      cy.get('@ulElement')
        .contains('button', 'Delete')
        .click()

      // verify that the ul element is empty again
      cy.get('@ulElement')
        .children()
        .should('not.exist')
  
      // verify that the note no longer exists
      cy.get('.note-container')
        .should('not.exist')
  
      // verify that the notes state is empty again
      cy.get('.app-container')
        .getComponent()
        .its('state[1]')
        // FAILS > STATE IS NOT UPDATED BEFORE CALL TO STATE IS MADE YET
        .should('be.empty')
      })
  
    })
  
  