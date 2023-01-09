import React, { useEffect, useContext } from 'react'
import { db } from './Firebase'
import { doc, getDoc } from 'firebase/firestore'
import { FirebaseOrder } from '../providers/CartProdiver';
import { CartDisplay } from './CartDisplay'
import styled from 'styled-components';

interface OrderObject {
  orderID: string | null;
}

const OrderWrapper = styled.div`
  width: 100%;
  display: flex;
`

const ViewOrder = (obj: OrderObject) => {
  let orderRef = doc(db, 'orders', obj.orderID!);
  const [order, setOrder] = React.useState<FirebaseOrder | null>(null)

  useEffect(() => {
    getDoc(orderRef!).then((docData) => {
      //@ts-ignore
      setOrder(docData.data())
    })
  }, [])

  return (
    <OrderWrapper>
      {order != null ? (
        <CartDisplay order={order.cart} />
      ) : (
        <span>Loading</span>
      )}
    </OrderWrapper>
  )
}

export default ViewOrder
