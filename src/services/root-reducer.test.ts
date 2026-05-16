import { rootReducer } from './root-reducer';
describe('rootReducer', () => {
  test('Возвращает правильное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: { items: [], isLoading: false, error: null },
      feed: {
        isLoading: false,
        orders: [],
        total: 0,
        totalToday: 0,
        error: null
      },
      orders: { isLoading: false, orders: [], orderDetails: null, error: null },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      },
      user: { isAuthChecked: false, data: null, isLoading: false, error: null }
    });
  });
});
