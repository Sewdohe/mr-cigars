import React, { useContext, useEffect } from "react";
import { navigate } from "gatsby";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";

import { Button, Modal, Text, Table, Loading, Row } from "@nextui-org/react";
import { FirebaseCartLine } from "../providers/CartProdiver";
import { useAuthValue } from "../components/AuthContext";
import { useMediaQuery } from "react-responsive";
import { CartDisplay } from "./CartDisplay";


export const NextCart = () => {
  const { currentUser } = useAuthValue();

  // CART VARIABLES
  const { cart, total, getTotal, modifyLineQty } = useContext(CartContext) as CartContextType;

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 900px)" });

  // MODAL VARIABLES
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  useEffect(() => {
    getTotal();
  }, [cart, currentUser]);

  return (
    <div>
      {cart ? (
        <div>
          <Button
            css={{ padding: "0" }}
            size={"sm"}
            light
            auto
            onClick={handler}
          >
            Cart ({total})
          </Button>
          <Modal
            scroll
            blur
            closeButton
            fullScreen={true}
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text css={{ fontSize: "1.5rem" }}>Shopping Cart</Text>
            </Modal.Header>

            <Modal.Body noPadding={true}>
              <CartDisplay />
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => navigate("/cart")}>View Cart</Button>
              <Button color="error" onClick={closeHandler}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};
