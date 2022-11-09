import React, { useContext, useEffect } from "react";
import { navigate } from "gatsby";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";

import { Button, Modal, Text, Table, Loading } from "@nextui-org/react";
import { FirebaseCartLine } from "../providers/CartProdiver";
import { useAuthValue } from "../components/AuthContext";
import uuid from "react-uuid";
import { useMediaQuery } from "react-responsive";

export const NextCart = () => {
  const { currentUser } = useAuthValue();

  // CART VARIABLES
  const { cart, total, getTotal } = useContext(CartContext) as CartContextType;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 900px)' })

  // MODAL VARIABLES
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  useEffect(() => {
      getTotal();
  }, [ cart, currentUser ])

  return (
    <div>
      {cart ? (
        <div>
          <Button light auto color="primary" onClick={handler}>
            Cart ({total})
          </Button>
          <Modal
            width="60%"
            blur
            closeButton
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text css={{ fontSize: "1.5rem" }}>Shopping Cart</Text>
            </Modal.Header>

            <Modal.Body>
            <Table sticked compact striped bordered css={{ width: "100%", fontSize: `${isTabletOrMobile ? "2vw" : "1.5vw"}` }}>
            <Table.Header>
              <Table.Column>Item Name</Table.Column>
              <Table.Column>Item Price</Table.Column>
              <Table.Column>Type/Flavor</Table.Column>
              <Table.Column>Quantity</Table.Column>
            </Table.Header>
            <Table.Body>
              {cart ? (
              // @ts-ignore
                cart.map((line: FirebaseCartLine) => {
                  return (
                    <Table.Row key={uuid()}>
                      <Table.Cell>{line.itemName}</Table.Cell>
                      <Table.Cell>${line.itemPrice * 1}</Table.Cell>
                      <Table.Cell>{line.variation}</Table.Cell>
                      <Table.Cell>x{line.quantity}</Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <p></p>
              )}
            </Table.Body>
          </Table>
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
