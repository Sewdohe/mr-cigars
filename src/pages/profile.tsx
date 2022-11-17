import React, { useContext } from 'react';
import Layout from "../components/Layout";
import { Text, Card, Button } from '@nextui-org/react'
import { useAuthValue } from "../components/AuthContext";
import styled from "styled-components";
import { CustomerDocument } from "../providers/CartProdiver";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";
import ViewOrder from '../components/ViewOrder';

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
				<>
				{!viewingOrder ? (
					<div>
						<Text size={30}>
							Hello - <Text size={50} color="primary" b>{userDocument.storeName}</Text>
						</Text>
						<Text>View Past Orders</Text>
						{userDocument.orders.length != 0 ? (
							<div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
								{userDocument.orders.map(order => {
									return (
										<Card css={{margin: '1rem', minWidth: '250px', maxWidth: '25%'}}>
											<Card.Header>
												<h3>{new Date(order.orderDate.seconds * 1000).toDateString()}</h3>
												<h6>Placed @ {new Date(order.orderDate.seconds * 1000).toTimeString()}</h6>
											</Card.Header>
											<Card.Body css={{textAlign: 'center', fontSize: '2rem'}}>{order.total * 1.0}</Card.Body>
											<Card.Footer>
												{order.status == "Reviewed" ? (
													<Button onClick={() => viewOrder(order.id)}>View & Confirm</Button>
												) : <span></span>}
											</Card.Footer>
										</Card>
									)
								})}
							</div>
						) : (
							<Text size={30}>Looks like you havent ordered before</Text>
						)}
					</div>
				) : (
					<ViewOrder orderID={selectedOrderID} />
				)}
				</>
			) : (
				<Text size={50}>Looks like you are not logged in</Text>
			)}
		</Layout>
	)
}

export default Profile