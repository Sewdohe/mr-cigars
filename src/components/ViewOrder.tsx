import React, { useEffect, useContext } from 'react'
import { db } from './Firebase'
import { doc, getDoc } from 'firebase/firestore'
import { FirebaseOrder } from '../providers/CartProdiver';
import { CartDisplay } from './CartDisplay'

interface OrderObject {
  orderID: string | null;
}

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
    <div>
      {order != null ? (
        <CartDisplay order={order.cart} />
      ) : (
        <span>Loading</span>
      )}
    </div>
  )
}

export default ViewOrder
