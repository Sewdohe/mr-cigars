import React, { useContext } from "react";
import Layout from "../components/Layout";

import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";
import { FirebaseCartLine } from "../providers/CartProdiver";
import { Table, Loading, Button, Modal, Row, Text } from "@nextui-org/react";
import uuid from "react-uuid";

import { useMediaQuery } from 'react-responsive'
import styled from "styled-components";

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CartPage = () => {
  const { cart, totalPrice, confirmOrder } = useContext(CartContext) as CartContextType;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 900px)' })

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  //TODO: show order sent confirmation

  return (
    <Layout>
      <div style={{ margin: "1rem" }}>
        {cart ? (
          <>
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
          <TotalContainer>
            <Text h2>Order Total:</Text>
            <Text b h2 color="red">${Math.trunc(totalPrice)}</Text>
          </TotalContainer>
          </>
        ) : (
          <Loading></Loading>
        )}
      </div>

      <Button auto shadow onClick={handler}>
        Confirm Order
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text b id="modal-title" size={18}>
            Look Good to You?
          </Text>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto onClick={() => {
            confirmOrder();
            closeHandler();
          }}>
            Send Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default CartPage;
