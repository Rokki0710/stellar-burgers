import { TIngredient } from '@utils-types';
import {
  constructorReducer,
  addIngredient,
  addBun,
  TOrderBurgerState,
  removeIngredient,
  moveIngredient,
  createOrder
} from './constructorSlice';

const mockBun: TIngredient = {
  _id: '1',
  name: 'булка',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'ингредиент',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
};

const initialState: TOrderBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

describe('constructor slice', () => {
  test('добавление булок', () => {
    const addTestBun = constructorReducer(initialState, addBun(mockBun));

    expect(addTestBun.constructorItems.bun).not.toBeNull();
    expect(addTestBun.constructorItems.bun!.name).toBe(mockBun.name);
    expect(addTestBun.constructorItems.bun!._id).toBe(mockBun._id);
    expect(addTestBun.constructorItems.bun!.id).toBeDefined();
  });

  test('Добавление ингредиентов', () => {
    const addTestIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(addTestIngredient.constructorItems.ingredients).toHaveLength(1);
    expect(addTestIngredient.constructorItems.ingredients[0].name).toBe(
      mockIngredient.name
    );
    expect(addTestIngredient.constructorItems.ingredients[0].id).toBeDefined();
  });

  test('Удаляем ингредиент', () => {
    const addedIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const removedIngredient =
      addedIngredient.constructorItems.ingredients[0].id;
    const removeTestIngredient = constructorReducer(
      addedIngredient,
      removeIngredient(removedIngredient)
    );
    expect(removeTestIngredient.constructorItems.ingredients).toHaveLength(0);
  });

  test('Двигаем ингредиент', () => {
    const stateAfterFirst = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const mockIngredient2 = {
      ...mockIngredient,
      _id: '3',
      name: 'второй ингредиент'
    };
    const finalState = constructorReducer(
      stateAfterFirst,
      addIngredient(mockIngredient2)
    );

    const movedUp = constructorReducer(
      finalState,
      moveIngredient({ from: 1, to: 0 })
    );
    expect(movedUp.constructorItems.ingredients[0]._id).toBe('3');
    const movedDown = constructorReducer(
      movedUp,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(movedDown.constructorItems.ingredients[0]._id).toBe('2');
  });

  test('Проверяем сохранение заказа и очистку полей ингредиентов', () => {
    const mockOrder = {
      ingredients: ['2.1'],
      status: 'done',
      name: 'бургер',
      createdAt: '2026-02-25T13:30:15.383Z',
      updatedAt: '2026-02-25T13:30:15.632Z',
      number: 101792
    };

    const fulfilledAction = {
      type: createOrder.fulfilled.type,
      payload: mockOrder,
      meta: { requestId: '123' }
    };

    const state = constructorReducer(
      { ...initialState, orderRequest: true },
      fulfilledAction
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  test('Заказ переводится в false при rejected', () => {
    const rejectedAction = {
      type: createOrder.rejected.type,
      error: { message: 'Error' }
    };

    const state = constructorReducer(
      { ...initialState, orderRequest: true },
      rejectedAction
    );

    expect(state.orderRequest).toBe(false);
  });
});
