import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { IconButton } from "./IconButton";
import { Add, Minimize } from "@mui/icons-material";
import { FirebaseCartLine, FirebaseCart } from "../providers/CartProdiver";
import CartContext from "../contexts/CartContext";
import { CartContextType } from '../@types/cart'
import uuid from 'react-uuid';
import { Text, Col } from '@nextui-org/react'
import Logo from '../../assets/mr-cigars-logo-web.svg'

const PageContainer = styled.div`
  width: 100%;
`

const CartContainer = styled.div`
  width: 100%;
  div:nth-child(even) {
    width: 100%;
    background-color: #f2f2f2;
  }
`;

const RightText = styled('span')`
  text-align: right;
  padding-left: 0.5rem;
  padding-right: 0.8rem;
`;

const CartLineContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  padding: 0px;
  align-items: center;
  width: 100%;
  padding: 1rem 1rem;
`

const QtyContainer = styled.section`
  flex-grow: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`


const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

interface Props {
  order?: FirebaseCart
}

export const CartDisplay: React.FC<Props> = (props: Props) => {
  const { cart, total, getTotal, modifyLineQty } = useContext(CartContext) as CartContextType;

  // set cart value to the passed in order, OR get the users current cart
  const [cartValue, setCartValue] = useState(props.order ? props.order : cart);
  let viewOnly = false;
  if (props.order != null) {
    viewOnly = true;
  }

  return (
    <PageContainer>
      <CartContainer>
        {total == 0 && cartValue?.length == 0 && (
          <EmptyCart>
            <Logo />
            <h2>Your Cart is Empty</h2>
          </EmptyCart>
        )}
        {viewOnly ? (
          <div>
            {cartValue?.map((value: FirebaseCartLine, index: number) => {
              return (
                <CartLineContainer
                  key={uuid()}
                  style={{
                    color: `${value.modifier < 0 ? 'red' : 'inherit'}`,
                    fontWeight: `${value.modifier < 0 ? 'bold' : 'inherit'}`
                  }}
                >
                  <Col>
                    <Text color="inherit" as="p">{value.itemName}</Text>
                    <Text color="inherit" as="p">{value.variation}</Text>
                  </Col>
                  <QtyContainer>
                    {!viewOnly && (
                      <IconButton
                        css={{
                          display: 'inline-block',
                        }}
                        onClick={() => modifyLineQty("dec", index)}
                      >
                        <Minimize />
                      </IconButton>
                    )}
                    <RightText>x{value.quantity}</RightText>
                    {value.modifier < 0 && (
                      <Text as="p" b>&nbsp;(modified:{value.modifier})&nbsp;</Text>
                    )}
                    {!viewOnly && (
                      <IconButton
                        css={{
                          display: 'inline-block'
                        }}
                        onClick={() => modifyLineQty("inc", index)}
                      >
                        <Add />
                      </IconButton>
                    )}
                    <Text color="inherit" as="p" b>${(((value.quantity + value.modifier) * value.itemPrice)).toFixed(2)}</Text>
                  </QtyContainer>
                </CartLineContainer>
              );
            })
            }
          </div>

        ) : (
          <div>
            {cart?.map((value: FirebaseCartLine, index: number) => {
              return (
                <CartLineContainer
                  key={uuid()}
                >
                  <Col>
                    <Text as="p">{value.itemName}</Text>
                    <Text as="p">{value.variation}</Text>
                  </Col>
                  <QtyContainer>
                    {!viewOnly && (
                      <IconButton
                        css={{
                          display: 'inline-block'
                        }}
                        onClick={() => modifyLineQty("dec", index)}
                      >
                        <Minimize />
                      </IconButton>
                    )}
                    <RightText>x{value.quantity}</RightText>
                    {!viewOnly && (
                      <IconButton
                        css={{
                          display: 'inline-block'
                        }}
                        onClick={() => modifyLineQty("inc", index)}
                      >
                        <Add />
                      </IconButton>
                    )}
                    <Text as="p" b>${(value.quantity * value.itemPrice).toFixed(2)}</Text>
                  </QtyContainer>
                </CartLineContainer>
              );
            })}
          </div>
        )}

      </CartContainer>
    </PageContainer>
  )
}
