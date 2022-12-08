import React, { useContext } from 'react';
import Layout from "../components/Layout";
import { Text, Card, Button, Tooltip } from '@nextui-org/react'
import { useAuthValue } from "../components/AuthContext";
import styled from "styled-components";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";
import ViewOrder from '../components/ViewOrder';
import uuid from 'react-uuid';

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  button {
    margin: 0.5rem;
  }
`

const Profile = () => {

  const { currentUser } = useAuthValue();
  const { userDocument } = useContext(CartContext) as CartContextType;
  const [viewingOrder, setViewingOrder] = React.useState(false);
  const [selectedOrderID, setSelectedOrder] = React.useState<null | string>(null);

  const viewOrder = (orderID: string) => {
    setViewingOrder(true);
    setSelectedOrder(orderID);
  }

  return (
    <Layout>
      {currentUser && userDocument ? (
        <div style={{ width: '100%' }}>
          {!viewingOrder ? (
            <CenteredContainer>
              <Text size={30}>
                Hello - <Text size={50} color="primary" b>{userDocument.storeName}</Text>
              </Text>
              <Text>View Past Orders</Text>
              {userDocument.orders.length != 0 ? (
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {userDocument.orders.map(order => {
                    return (
                      <Card key={uuid()} css={{ margin: '1rem', minWidth: '250px', maxWidth: '25%', opacity: `${order.status == "Pending Review" ? 0.5 : 1.0}` }}>
                        <Card.Header css={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                          <h3>{new Date(order.orderDate.seconds * 1000).toDateString()}</h3>
                          <h6>Placed @ {new Date(order.orderDate.seconds * 1000).toTimeString()}</h6>
                        </Card.Header>
                        <Card.Body css={{ textAlign: 'center', fontSize: '2rem' }}>${order.total.toFixed(2)}</Card.Body>
                        <Card.Footer css={{ display: 'flex', justifyContent: 'center' }}>
                          {order.status == "Reviewed" ? (
                            <div>
                              <Text css={{ textAlign: 'center' }}>Ready to Confirm</Text>
                              <Button onClick={() => viewOrder(order.id)}>View & Confirm</Button>
                            </div>
                          ) : <Text css={{ color: 'red' }}><em>Pending Mr.Cigar's review</em></Text>}
                        </Card.Footer>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Text size={30}>Looks like you havent ordered before</Text>
              )}
            </CenteredContainer>
          ) : (
            <div>
              <ViewOrder orderID={selectedOrderID} />
              <ButtonContainer>
                <Button color="secondary">Confirm Order</Button>
                <Button color="error" onClick={() => setViewingOrder(false)}>Cancel Order</Button>
              </ButtonContainer>
            </div>
          )}
        </div>
      ) : (
        <Text size={50}>Looks like you are not logged in</Text>
      )}
    </Layout>
  )
}

export default Profile
