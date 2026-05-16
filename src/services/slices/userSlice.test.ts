import { TUser } from '@utils-types';
import {
  authChecked,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  TUserState,
  updateUser,
  userReducer
} from './userSlice';

const initialState: TUserState = {
  isAuthChecked: false,
  data: null,
  isLoading: false,
  error: null
};

const mockUser: TUser = {
  name: 'user',
  email: 'user@mail.ru'
};

describe('userSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('auth checked', () => {
    test('должен установить isauthchecked true', () => {
      const actualState = userReducer(initialState, authChecked());
      expect(actualState.isAuthChecked).toBe(true);
      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toBeNull();
    });
  });

  describe('register user', () => {
    const registerData = { ...mockUser, password: '123' };
    test('pending: должен установить isLoading в true при pending', () => {
      const actualState = userReducer(
        initialState,
        registerUser.pending('', registerData)
      );
      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBeNull();
      expect(actualState.data).toBeNull();
    });

    test('fullfilied должен установить данные пользователя и поставить isauthchecked true ', () => {
      const actualState = userReducer(
        initialState,
        registerUser.fulfilled(mockUser, '', registerData)
      );
      expect(actualState.data).toBe(mockUser);
      expect(actualState.isAuthChecked).toBe(true);
      expect(actualState.error).toBeNull();
      expect(actualState.isLoading).toBe(false);
    });

    test('rejected должен выбросить ошибку(есть ошибка) прекратить загрузку', () => {
      const error = new Error('ой');
      const actualState = userReducer(
        initialState,
        registerUser.rejected(error, '', registerData)
      );
      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toBeNull();
      expect(actualState.error).toBe(error.message);
    });

    test('rejected должен выбросить ошибку(пустая ошибка) прекратить загрузку', () => {
      const error = new Error();
      const actualState = userReducer(
        initialState,
        registerUser.rejected(error, '', registerData)
      );
      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toBeNull();
      expect(actualState.error).toBe('Registration failed');
    });
  });

  describe('loginUser', () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123'
    };

    test('pending: должен установить isLoading в true и сбросить ошибку', () => {
      const actualState = userReducer(
        initialState,
        loginUser.pending('', loginData)
      );

      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBeNull();
    });

    test('fulfilled: должен сохранить пользователя и установить isAuthChecked в true', () => {
      const actualState = userReducer(
        initialState,
        loginUser.fulfilled(mockUser, '', loginData)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.isAuthChecked).toBe(true);
      expect(actualState.data).toEqual(mockUser);
      expect(actualState.error).toBeNull();
    });

    test('rejected: должен установить ошибку и выключить загрузку', () => {
      const error = new Error('Login failed');
      const actualState = userReducer(
        initialState,
        loginUser.rejected(error, '', loginData)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.error).toBe('Login failed');
    });
  });

  describe('logoutUser', () => {
    const loggedInState = {
      ...initialState,
      data: mockUser,
      isAuthChecked: true
    };

    test('pending: должен установить isLoading в true и сбросить ошибку', () => {
      const actualState = userReducer(
        loggedInState,
        logoutUser.pending('', undefined)
      );

      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBeNull();
      expect(actualState.data).toEqual(mockUser);
    });

    test('fulfilled: должен очистить данные пользователя', () => {
      const actualState = userReducer(
        { ...loggedInState, isLoading: true },
        logoutUser.fulfilled(undefined, '', undefined)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toBeNull();
      expect(actualState.error).toBeNull();
    });

    test('rejected: должен установить ошибку', () => {
      const error = new Error('Logout failed');
      const actualState = userReducer(
        { ...loggedInState, isLoading: true },
        logoutUser.rejected(error, '', undefined)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.error).toBe('Logout failed');
      expect(actualState.data).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    const authCheckedState = {
      ...initialState,
      isAuthChecked: true
    };

    test('pending: должен установить isLoading в true и сбросить ошибку', () => {
      const actualState = userReducer(
        authCheckedState,
        getUser.pending('', undefined)
      );

      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBeNull();
    });

    test('fulfilled: должен сохранить данные пользователя', () => {
      const actualState = userReducer(
        { ...authCheckedState, isLoading: true },
        getUser.fulfilled(mockUser, '', undefined)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toEqual(mockUser);
      expect(actualState.error).toBeNull();
      expect(actualState.isAuthChecked).toBe(true);
    });

    test('rejected: должен установить ошибку', () => {
      const error = new Error('Failed to get user');
      const actualState = userReducer(
        { ...authCheckedState, isLoading: true },
        getUser.rejected(error, '', undefined)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.error).toBe('Failed to get user');
      expect(actualState.data).toBeNull();
    });
  });

  describe('updateUser', () => {
    const updateData = {
      name: 'Updated Name',
      email: 'updated@test.com'
    };

    const loggedInState = {
      ...initialState,
      data: mockUser,
      isAuthChecked: true
    };

    test('pending: должен установить isLoading в true и сбросить ошибку', () => {
      const actualState = userReducer(
        loggedInState,
        updateUser.pending('', updateData)
      );

      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBeNull();
    });

    test('fulfilled: должен обновить данные пользователя', () => {
      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        email: 'updated@test.com'
      };

      const actualState = userReducer(
        { ...loggedInState, isLoading: true },
        updateUser.fulfilled(updatedUser, '', updateData)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.data).toEqual(updatedUser);
      expect(actualState.error).toBeNull();
    });

    test('rejected: должен установить ошибку', () => {
      const error = new Error('Failed to update user');
      const actualState = userReducer(
        { ...loggedInState, isLoading: true },
        updateUser.rejected(error, '', updateData)
      );

      expect(actualState.isLoading).toBe(false);
      expect(actualState.error).toBe('Failed to update user');
      expect(actualState.data).toEqual(mockUser);
    });
  });
});
