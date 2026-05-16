import { TIngredient } from '@utils-types';
import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';
import { Z_UNKNOWN } from 'zlib';

const ingredients: TIngredient[] = [
  {
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
  }
];

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

describe('Ingredient Slice', () => {
  test('возврат начального состояния', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('Должен установить isLoading в true при pending', () => {
    const actualState = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(actualState.isLoading).toBe(true);
    expect(actualState.error).toBeNull();
  });

  test('должен сохранить данные и выключить загрузку при success', () => {
    const actualState = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(actualState.isLoading).toBe(false);
    expect(actualState.items).toEqual(ingredients);
    expect(actualState.error).toBeNull();
  });

  test('если rejected, должен установить ошибку, записать, isLoading - false', () => {
    const error = new Error('Что-то пошло не так');
    const actualState = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(error, '')
    );
    expect(actualState.isLoading).toBe(false);
    expect(actualState.error).toBe('Что-то пошло не так');
  });
});
