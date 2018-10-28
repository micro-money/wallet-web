describe('Sign In', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('/')
  })

  it('should be Log In button on the screen', () => {
    cy.contains('Log In Wallet')
  })

  describe('By email', () => {
    it('should open modal', () => {
      cy.get('[data-test=login]').click()
      cy.get('.dialog.auth').parent().should('be.visible')
      cy.contains('.dialog.auth', 'Continue via')
      cy.get('.dialog.auth .dialog-footer button').click()
    })

    it('change inputs placeholder position on focus', () => {
      cy.openSignInModal()
        .then(() => {
          cy.get('[data-test=signin-email]').focus().parent().parent().parent().should('have.class', 'focused')
          cy.get('[data-test=signin-password]').focus().parent().parent().parent().should('have.class', 'focused')
        })
    })

    it('should not pass validation of email and password', () => {
      cy.openSignInModal()
        .then(() => {
          cy.clock()
          cy.get('[data-test=signin-email]').type('not-an-email').blur()
          cy.tick(1000)
          cy.get('[data-test=signin-email]').parent().siblings('.el-form-item__error').should('be.visible')
          cy.get('[data-test=signin-password]').type('badpassword').blur().clear().blur()
          cy.tick(1000)
          cy.get('[data-test=signin-password]').parent().siblings('.el-form-item__error').should('be.visible')
        })
    })

    it('sign in button should become active in case of valid data', () => {
      cy.openSignInModal()
        .then(() => {
          cy.clock()
          cy.get('[data-test=signin-email]').type('not-an-email').blur()
          cy.tick(1000)
          cy.get('[data-test=signin-email]').parent().siblings('.el-form-item__error').should('be.visible')
          cy.get('[data-test=signin-button]').should('have.class', 'is-disabled')

          cy.get('[data-test=signin-password]').type('badpassword').blur().clear().blur()
          cy.tick(1000)
          cy.get('[data-test=signin-password]').parent().siblings('.el-form-item__error').should('be.visible')
          cy.get('[data-test=signin-button]').should('have.class', 'is-disabled')

          cy.tick(1000)
          cy.get('[data-test=signin-email]').type('test@email.ru').blur()
          cy.get('[data-test=signin-password]').type('abc123ABC').blur()
          cy.get('[data-test=signin-button]').should('not.have.class', 'is-disabled')
        })
    })

    describe('Authenticate', () => {
      beforeEach(() => {
        cy.clearLocalStorage().should((ls) =>
          expect(ls.getItem('vue-authenticate.token')).to.be.null
        )
      })

      it('should be success: redirect and write token to localStorage', () => {
        cy.loginByEmail('test@email.ru', 'k6h76Jnm')
          .then((response) => {
            cy.clock()
            cy.tick(1000)
            cy.hash().should('match', /\/account\/wallet/)

            cy.window({timeout: 1000}).should((_window) =>
              expect(_window.localStorage.getItem('vue-authenticate.token')).to.be.ok
            )
          })
      })

      it('should not be success', () => {
        cy.loginByEmail('dummy@wrong.ru', '1s3sWord')
          .then(
            (response) => {
              cy.hash().should('match', /#\//)
              cy.window({timeout: 1000}).should((_window) =>
                expect(_window.localStorage.getItem('vue-authenticate.token')).to.be.null
              )
              cy.get('.el-message--error').should('be.visible')
            }
          )
      })
    })
  })
})
