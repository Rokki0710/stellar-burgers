import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { TLocationState } from '@utils-types';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Routes,
  Route,
  Location,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as TLocationState | null;
  const background = state?.background;

  useEffect(() => {
    dispatch(fetchIngredients()); // загрузка ингридиентов
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<ProtectedRoute isAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute isAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute isAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute isAuth element={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute isAuth element={<Profile />} />}
        >
          <Route path='orders' element={<ProfileOrders />} />
        </Route>
        <Route
          path='/feed/:number'
          element={
            <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиентов' onClose={() => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};
export default App;