const BUN = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '12345';
const ingredients = [BUN, MAIN_NAME];
const ADDRESS = '/';

function addIngredientsToConstructor() {
  ingredients.forEach((name) => {
    cy.get('[data-cy="ingredient"]')
      .contains(name)
      .parents('[data-cy="ingredient"]')
      .find('button')
      .click();

    cy.get('[data-cy="constructor"]').contains(name).should('exist');
  });
}

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit(ADDRESS);
    cy.wait('@getIngredients');
  });

  describe('добавление ингредиентов в конструктор', () => {
    it('все ингредиенты добавляются', addIngredientsToConstructor);
  });

  describe('модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.get('[data-cy="ingredient"]').contains(BUN).click();
    });
    it('открытие при клике', () => {
      cy.get('[data-cy="modal"]').should('exist');
    });
    it('отображение правильного ингредиента', () => {
      cy.get('[data-cy="modal"]').should('contain.text', BUN);
    });

    it('закрытие по клику', () => {
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit(ADDRESS);
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('открывает модальное окно с номером заказа при оформлении', () => {
    addIngredientsToConstructor();

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]')
      .should('exist')
      .and('contain.text', ORDER_NUMBER);
  });

  it('закрывает модальное окно заказа', () => {
    addIngredientsToConstructor();

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('очищает конструктор после успешного оформления заказа', () => {
    addIngredientsToConstructor();

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal-close"]').click();

    cy.get('[data-cy="constructor"]')
      .should('contain.text', 'Выберите булки')
      .and('contain.text', 'Выберите начинку')
      .and('contain.text', '0');
  });
});
