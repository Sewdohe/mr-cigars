import React, { useContext } from "react";
import Layout from "../components/Layout";

import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";
import { Loading, Button, Modal, Text } from "@nextui-org/react";

import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { CartDisplay } from "../components/CartDisplay";

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CartPage = () => {
  const { cart, totalPrice, confirmOrder } = useContext(
    CartContext
  ) as CartContextType;

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 900px)" });

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  return (
    <Layout>
      <div style={{ width: "100%" }}>
        {cart ? (
          <>
            <CartDisplay></CartDisplay>
            <TotalContainer>
              <Text h2>Order Total:</Text>
              <Text b h2 color="red">
                ${Math.trunc(totalPrice)}
              </Text>
            </TotalContainer>
          </>
        ) : (
          <Loading></Loading>
        )}
      </div>

      {cart && cart.length > 0 ? (
        <TotalContainer>
          <Button auto shadow onClick={handler}>
            Confirm Order
          </Button>
        </TotalContainer>
      ) : (
        <TotalContainer>
          <Button auto shadow onClick={handler}>
            Confirm Order
          </Button>
        </TotalContainer>
      )}

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <TotalContainer>
            <Text b id="modal-title" size={18}>
              Look Good to You?
            </Text>
          </TotalContainer>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <TotalContainer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button
              auto
              onClick={() => {
                confirmOrder();
                closeHandler();
              }}
            >
              Send Order
            </Button>
          </TotalContainer>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default CartPage;
