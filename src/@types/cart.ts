import { DocumentSnapshot } from "firebase/firestore";
import React from "react";
import { Product, Products } from "./product";
import {CustomerDocument} from "../providers/CartProdiver";

export type CartContextType = {
  cart: FirebaseCart | null;
  addToCart: (item: Product, qty: number, variation?: string[]) => void;
  getTotal: () => void;
  total: number;
  totalPrice: number;
  confirmOrder: () => void;
  userDocument: CustomerDocument;
};

interface FirebaseCartLine {
  itemName: string,
  itemPrice: number,
  quantity: number,
  variation: string[] | undefined
  id: string
}

interface FirebaseCart extends Array<FirebaseCartLine>{}

export interface CartLine {
  product: Product,
  qty: number,
  variation: string[] | undefined
}

export class CartEntry {
  product: Product;
  qty: number;
  variation: string[] | undefined

  constructor (product: Product, qty: number, variation: string[] | undefined ) {
      this.product = product;
      this.qty = qty;
      this.variation = variation;
  }

  toString() {
      return this.product + ', ' + this.qty + ', ' + this.variation;
  }
}

// Firestore data converter
export const CartConverter = {
  toFirestore: (cartEntry: CartLine) => {
      return {
          product: cartEntry.product,
          qty: cartEntry.qty,
          variation: cartEntry.variation
          };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
      const data = snapshot.data(options);
      return new CartEntry(data?.product, data?.qty, data?.variation);
  }
};

export interface Cart extends Array<CartLine> {}
