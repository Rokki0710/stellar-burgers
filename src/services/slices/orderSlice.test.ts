import { TOrder } from '@utils-types';
import { fetchOrderByNumber, fetchOrders, orderReducer } from './orderSlice';

const initialState = {
  isLoading: false,
  orders: [],
  orderDetails: null,
  error: null
};

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['2.1'],
    status: 'done',
    name: 'бургер',
    createdAt: '2026-02-25T13:30:15.383Z',
    updatedAt: '2026-02-25T13:30:15.383Z',
    number: 111111
  }
];

describe('Order Slice', () => {
  test('возврат начального состояния', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('fetchorder Должен установить isLoading в true при pending', () => {
    const actualState = orderReducer(
      initialState,
      fetchOrders.pending('', undefined)
    );

    expect(actualState.isLoading).toBe(true);
    expect(actualState.error).toBeNull();
  });

  test('fetchorder должен сохранить данные и выключить загрузку при success', () => {
    const actualState = orderReducer(
      { ...initialState, isLoading: true },
      fetchOrders.fulfilled(mockOrders, '', undefined)
    );

    expect(actualState.isLoading).toBe(false);
    expect(actualState.orders).toEqual(mockOrders);
    expect(actualState.error).toBeNull();
  });

  test('fetchorder если rejected, должен установить ошибку, записать, isLoading - false', () => {
    const error = new Error('Что-то пошло не так');
    const actualState = orderReducer(
      { ...initialState, isLoading: true },
      fetchOrders.rejected(error, '')
    );
    expect(actualState.isLoading).toBe(false);
    expect(actualState.error).toBe('Что-то пошло не так');
  });

  test('fetchbynumber Должен установить isLoading в true при pending', () => {
    const actualState = orderReducer(
      initialState,
      fetchOrderByNumber.pending('', 111111)
    );

    expect(actualState.isLoading).toBe(true);
    expect(actualState.error).toBeNull();
  });

  test('fetchbynumber должен сохранить данные и выключить загрузку при success', () => {
    const actualState = orderReducer(
      { ...initialState, isLoading: true },
      fetchOrderByNumber.fulfilled(
        { success: true, orders: mockOrders },
        '',
        111111
      )
    );

    expect(actualState.isLoading).toBe(false);
    expect(actualState.orderDetails).toEqual(mockOrders[0]);
    expect(actualState.error).toBeNull();
  });

  test('fetchbynumber если rejected, должен установить ошибку, записать, isLoading - false', () => {
    const error = new Error('Что-то пошло не так');
    const actualState = orderReducer(
      { ...initialState, isLoading: true },
      fetchOrderByNumber.rejected(error, '', 111111)
    );
    expect(actualState.isLoading).toBe(false);
  });
});
