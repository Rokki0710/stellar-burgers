import { RefObject } from 'react';
import { TIngredient, TTabMode } from '@utils-types';

export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: RefObject<HTMLDivElement>; // ← убедись, что это RefObject<HTMLDivElement>
  mainsRef: RefObject<HTMLDivElement>; // ← убедись, что это RefObject<HTMLDivElement>
  saucesRef: RefObject<HTMLDivElement>; // ← убедись, что это RefObject<HTMLDivElement>
  onTabClick: (tab: string) => void;
  onIngredientClick: (ingredient: TIngredient) => void;
};
