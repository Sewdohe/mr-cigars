import React, { useEffect } from "react";
import CartContext from "../contexts/CartContext";
import { Product } from "../@types/product";

import { useAuthValue } from "../components/AuthContext";
import { db } from "../components/Firebase";
import {
  updateDoc,
  doc,
  arrayUnion,
  onSnapshot, setDoc, DocumentSnapshot,
  serverTimestamp, Timestamp
} from "firebase/firestore";

import uuid from "react-uuid";
import { Notification } from "../@types/notification";

export interface FirebaseCartLine {
  itemName: string;
  itemPrice: number;
  quantity: number;
  variation: string[] | undefined;
  modifier: number;
  id: string;
}

export interface FirebaseOrder {
  customer: string | null;
  customerUID: string;
  orderDate: Timestamp;
  cart: FirebaseCart;
  total: number;
  id: string;
  status: "Pending Review" | "Reviewed" | "Complete";
}

export interface CustomerDocument {
  email: string,
  fedTaxId: number,
  stateTaxId: number,
  storeAddress: string,
  storeCity: string,
  storeName: string,
  storeZip: string,
  userName: string,
  orders: FirebaseOrder[],
  cart: FirebaseCart,
  uid: string,
  notifications: Notification[]
}

export interface FirebaseCart extends Array<FirebaseCartLine> {}

type Props = {
  children: JSX.Element | JSX.Element[]
}


const CartProvider: React.FC<Props> = ({ children }: Props) => {
  const { currentUser } = useAuthValue();

  const [cart, updateCart] = React.useState<FirebaseCart | null>(null);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [orders, setOrders] = React.useState<FirebaseOrder[] | null>(null)
  const [storeName, setStoreName] = React.useState<string>('')
  const [userDocument, setUserDocument] = React.useState<CustomerDocument | null>(null);

  useEffect(() => {
    if (currentUser) {
      // @ts-ignore
      const _unSub = onSnapshot(doc(db, "users", currentUser.uid), (doc: DocumentSnapshot<CustomerDocument>) => {
        // console.log("cart init!");
        let data: CustomerDocument = doc.data()!;
        if(data) {
          // console.log('user Data: ', data)
          updateCart(data.cart);
          getCartQty();
          setOrders(data.orders)
          setStoreName(data.storeName)
          setUserDocument(data);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    getTotalPrice()
  }, [cart])

  // This function is a headache. Let me document this bitch...
  const addToCart = (
    newItem: Product,
    qty: number,
    variation: string[] | undefined
  ) => {
    let prevValue = cart;

    // Convert passed variables into the CartLine type
    let newLine: FirebaseCartLine = {
      itemName: newItem.name,
      itemPrice: newItem.price,
      quantity: qty,
      variation: variation,
      modifier: 0,
      id: newItem.id,
    };

    // console.log(variation)

    // console.log(newLine)

    const existingIndex: number | undefined = cart?.findIndex((cart) => {
      // get the index of the item in the cart array
      // if the user has already added it to their cart.
      return cart.id == newItem.id;
    });
    // console.log(existingIndex == -1 ? 'Item is a new line, no variations' : 'the item is already in the cart')

    if (existingIndex == -1 && cart) {
      // console.log('adding new item line')
      // if eI == -1 than we didn't find the item in the cart already.
      // this is a new item, so add it as a new cart-line.
      // console.log("fresh item, added to the cart.");
      // console.log(variation);
      let newCart = cart!.slice();
      newCart.push(newLine);

      if (currentUser) {
        // ensure we don't write the same thing to the databse and start "the loop"
        let docRef = doc(db, "users", currentUser.uid);
        updateDoc(docRef, {
          cart: arrayUnion({
            itemName: newItem.name,
            itemPrice: newItem.price,
            id: newItem.id,
            quantity: qty,
            modifier: 0,
            variation: variation,
          }),
        }).then(() => {
          // console.log("item push successful!");
        }).catch((e) => console.error(e)).finally(() => {
          // getTotalPrice()
        });
      } else {
        // console.log("user is not logged in or cart is the same");
      }
    } else {
      // console.log('item is in the cart, so its a new variation or a qty adjustment')
      // we found the item in the cart.
      // we will be modifying it in some way, so create a copy using slice
      let newCart = cart!.slice();

      // we have to do a find index again, narrowing it down to the attrib this time
      const attribIndex = cart!.findIndex((cart) => {
        return (
          cart.variation![0] == variation![0] &&
          cart.variation![1] == variation![1] &&
          cart.variation![2] == variation![2] &&
          cart.variation![3] == variation![3]
        );
      });

      if (attribIndex != -1) {
        // if we land here, this variation is already in the cart. Adjust qty only.
        // console.log('this is a qty adjustment on a variation')
        newCart[attribIndex].quantity = prevValue![attribIndex].quantity + qty;

        // console.log("sending cart to firebase");
        if (currentUser && prevValue != newCart) {
          let docRef = doc(db, "users", currentUser.uid);
          updateDoc(docRef, {
            cart: newCart
          }).then(() => {
            // console.log("item push successful!");
          }).finally(() => {
            // getTotalPrice()
          })
        }
      } else {
        // this variation doesn't exist already. treat as a new line.
        newCart = [...prevValue!, newLine];
        // console.log("sending cart to firebase", newCart);
        if (currentUser && prevValue != newCart) {
          let docRef = doc(db, "users", currentUser.uid);
          updateDoc(docRef, {
            cart: newCart
          }).then(() => {
            // console.log("item push successful!");
          }).finally(() => {
            // getTotalPrice()
          })
        }
      }
    }
  };

  const getTotalPrice = () => {
    // console.warn('Calculating Price')
    let tempTotal: number = 0;
    cart?.forEach(line => {
      tempTotal += (line.quantity * line.itemPrice)
      // console.warn('line price is: ', line.quantity * line.itemPrice)
    })
    setTotalPrice(tempTotal);
    // console.log('new total price is: ', cartTotal)
  }

  const getCartQty = () => {
    let total = 0;
    if (cart?.length) {
      // make sure the cart isn't undefined
      cart.forEach((line: FirebaseCartLine) => {
        total = total + line.quantity;
      });
    }
    setCartTotal(total);
  };

  const confirmOrder = () => {
    let newOrders = orders;
    let firebaseOrder: FirebaseOrder

    // transform the "cart" into an "order"
    if(currentUser && cart) {
      firebaseOrder = {
        customer: storeName,
        customerUID: currentUser.uid,
        total: 0,
        orderDate: Timestamp.fromDate(new Date),
        cart: cart,
        status: "Pending Review",
        id: uuid()
      }

      // calculate the order total before pushing to firebase
      firebaseOrder.cart.forEach(cartLine => {
        firebaseOrder.total += cartLine.itemPrice * cartLine.quantity
      })
      newOrders?.push({...firebaseOrder});

      // Ensure user is logged in, cart is loaded, and cart is not empty
      if (currentUser && cart && cart.length != 0) {
        let docRef = doc(db, "users", currentUser.uid); // get current user document
        updateDoc(docRef, { // update user document with the new order
          orders: newOrders
        }).catch(err => {
          console.error(err)
        }).then(() => {
          let orderRef = doc(db, "orders", firebaseOrder.id) // get orders document ref
          setDoc(orderRef, {...firebaseOrder}).then(() => { // push said ref
            console.log('also send order to orders collection')
            console.log("Order Completed...clearing cart")
            updateDoc(docRef, { // then if successful, clear the users current cart
              cart: new Array(0)
            }).then(() => console.log('cart cleared'))
          })
        })
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart: cart,
        addToCart: addToCart,
        total: cartTotal,
        getTotal: getCartQty,
        totalPrice,
        confirmOrder,
        userDocument: userDocument!
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
