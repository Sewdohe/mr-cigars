import React from "react";
import "./src/styles/global.css"

import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

import CartProvider from "./src/providers/CartProdiver";
import AuthProvider from "./src/components/AuthContext";


export const wrapRootElement = ({ element }) => (
    <AuthProvider>
        <CartProvider>
            {element}
        </CartProvider>
    </AuthProvider>
);
