import { TOrder } from '@utils-types';
import { feedReducer, fetchFeed, TFeedState } from './feedSlice';

const mockFeedOrder = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: ['2.1'],
      status: 'done',
      name: 'бургер',
      createdAt: '2026-02-25T13:30:15.383Z',
      updatedAt: '2026-02-25T13:30:15.383Z',
      number: 111111
    }
  ],
  total: 100,
  totalToday: 10
};

const initialState: TFeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

describe('feed slice', () => {
  test('возврат начального состояния', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('должен установить isLoading в true при pending', () => {
    const actualState = feedReducer(
      initialState,
      fetchFeed.pending('', undefined)
    );

    expect(actualState.isLoading).toBe(true);
    expect(actualState.error).toBeNull();
  });

  test('должен сохранить данные и выключить загрузку при success', () => {
    const actualState = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.fulfilled(mockFeedOrder, '', undefined)
    );

    expect(actualState.isLoading).toBe(false);
    expect(actualState.orders).toEqual(mockFeedOrder.orders);
    expect(actualState.total).toBe(100);
    expect(actualState.totalToday).toBe(10);
    expect(actualState.error).toBeNull();
  });

  test('если rejected, должен установить ошибку, записать, isLoading - false', () => {
    const error = new Error('Что-то пошло не так');
    const actualState = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.rejected(error, '')
    );
    expect(actualState.isLoading).toBe(false);
    expect(actualState.error).toBe('Что-то пошло не так');
  });
});
