import { FC, ReactElement } from 'react';
import { TLocationState } from '@utils-types';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

type ProtectedRouteProps = {
  isAuth?: boolean;
  element: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  isAuth = true,
  element
}) => element;