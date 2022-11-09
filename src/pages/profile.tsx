import React, { useContext } from 'react';
import Layout from "../components/Layout";
import { Text } from '@nextui-org/react'
import { useAuthValue } from "../components/AuthContext";
import styled from "styled-components";
import { CustomerDocument } from "../providers/CartProdiver";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Profile = () => {

	const { currentUser } = useAuthValue();
	const { userDocument } = useContext(CartContext) as CartContextType;

	return (
		<Layout>
			{currentUser && userDocument ? (
				<>
					<Text size={30}>
						Hello - <Text size={50} color="primary" b>{userDocument.storeName}</Text>
					</Text>
					<Text>View Past Orders</Text>
					{userDocument.orders.length != 0 ? (
						<ul>
							{userDocument.orders.map(order => {
								return (
									<li>{order.orderDate.toString()} - {order.total}</li>
								)
							})}
						</ul>
					) : (
						<Text size={30}>Looks like you havent ordered before</Text>
					)}
				</>
			) : (
				<Text size={50}>Looks like you are not logged in</Text>
			)}
		</Layout>
	)
}

export default Profile