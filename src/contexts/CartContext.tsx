import * as React from 'react';
import { CartContextType } from '../@types/cart';

export const CartContext = React.createContext<CartContextType | null>(null);

export default CartContext;