/* eslint-disable no-undef */

describe('redux working language', function() {
    beforeEach(function() {
        cy.createProject('bf', 'My Project', 'en').then(() => {
            cy.login();
        });
    });
    afterEach(() => {
        cy.logout();
        cy.deleteProject('bf');
    });
    
    const selectLanguage = (language) => {
        cy.dataCy('language-selector')
            .click()
            .find('span')
            .contains(language)
            .click({ force: true });
    };

    const checkLanguage = (language) => {
        cy.dataCy('language-selector')
            .find('.text')
            .first()
            .contains(language)
            .should('exist');
    };

    it('should persist the working language', function () {
        /* sidebar links are used over cy.vist as cy.visit clears the
           redux state causing the test to fail
        */
        // add a language
        cy.visit('/project/bf/settings');
        cy.get('[data-cy=language-selector]').click();
        cy.get('[data-cy=language-selector] input').type('French{enter}');
        cy.dataCy('settings-menu').find('.active.item').click();
        cy.get('[data-cy=save-changes]').click();
        // add an English example
        cy.visit('/project/bf/nlu/models');
        cy.contains('Insert many').click();
        cy.get('.batch-insert-input').type('cya\nlater');
        cy.dataCy('intent-label')
            .first()
            .click({ force: true })
            .type('newintent{enter}');
        cy.get('[data-cy=save-button]').click();
        // the active language in NLU should match the active language in stories
        cy.visit('/project/bf/dialogue');
        selectLanguage('French');
        checkLanguage('French');
        cy.dataCy('incoming-sidebar-link')
            .click({ force: true });
        checkLanguage('French');
        cy.dataCy('nlu-sidebar-link')
            .click({ force: true });
        checkLanguage('French');
        cy.dataCy('intent-label')
            .should('not.exist');
        // switch the language back to english in nlu
        selectLanguage('English');
        checkLanguage('English');
        cy.dataCy('intent-label')
            .should('exist');
        // the language in stories should be english
        cy.dataCy('stories-sidebar-link')
            .click({ force: true });
        checkLanguage('English');
    });
});
