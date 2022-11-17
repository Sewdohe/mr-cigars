import React, { useEffect } from 'react'
import { db } from './Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useMediaQuery } from 'react-responsive'
import { FirebaseOrder } from '../providers/CartProdiver';
import { Table, Text } from '@nextui-org/react';
import uuid from 'react-uuid';
import styled from 'styled-components';

interface OrderObject {
  orderID: string | null;
}

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ViewOrder = (obj: OrderObject) => {
  console.log(obj)
  let orderRef = doc(db, 'orders', obj.orderID!);
  const [order, setOrder] = React.useState<FirebaseOrder | null>(null)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 900px)' })

  useEffect(() => {
    getDoc(orderRef!).then((docData) => {
      console.log('useEffect')
      //@ts-ignore
      setOrder(docData.data())
      console.log(order)
    })
  }, [])

  return (
    <div style={{width: '100%'}}>
      {order != null ? (
        <div style={{width: '100%', padding: `${isTabletOrMobile ? "0" : "2rem"}`}}>
        <Table lined sticked compact striped bordered css={{ maxWidth: "100%", height: 'auto', fontSize: `${isTabletOrMobile ? "3vw" : "1.2vw"}`}}>
          <Table.Header>
            <Table.Column>Item Name</Table.Column>
            <Table.Column>Item Price</Table.Column>
            <Table.Column>Type/Flavor</Table.Column>
            <Table.Column>Qty Ordered</Table.Column>
            <Table.Column>Modifier</Table.Column>
          </Table.Header>
          <Table.Body>
            {order != null ? (
              // @ts-ignore 
              order.cart.map((line: FirebaseCartLine) => {
                return (
                  <Table.Row key={uuid()}>
                    <Table.Cell>{line.itemName}</Table.Cell>
                    <Table.Cell>${line.itemPrice * 1}</Table.Cell>
                    <Table.Cell>{line.variation}</Table.Cell>
                    <Table.Cell>x{line.quantity}</Table.Cell>
                    <Table.Cell ><span className={`${line.modifier < 0 ? "minus" : ""}`}>{line.modifier}</span></Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Text>Wow</Text>
            )}
          </Table.Body>
        </Table>
        </div>
      ) : (
        <span>Loading</span>
      )}
    </div>
  )
}

export default ViewOrder