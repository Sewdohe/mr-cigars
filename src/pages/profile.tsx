import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Text, Card, Button } from "@nextui-org/react";
import { useAuthValue } from "../components/AuthContext";
import styled from "styled-components";
import CartContext from "../contexts/CartContext";
import { CartContextType } from "../@types/cart";
import ViewOrder from "../components/ViewOrder";
import uuid from "react-uuid";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../components/Firebase";
import { FirebaseCart, FirebaseOrder } from "../providers/CartProdiver";
import { Link } from "gatsby";
import { sendEmailVerification } from "firebase/auth";

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const InvoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

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
  @media screen and (max-width: 700px) {
    flex-direction: column;
  } 
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-items: center;
  height: calc(100vh - 100px);
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;

const ProfileSidebar = styled.div`
  padding: 1rem;
  flex-basis: 20rem;
  border-right: 1px solid gold;
  @media screen and (max-width: 700px) {
    border-bottom: 1px solid gold;
    flex-basis: 10rem;
  }
  li {
    text-decoration: underline;
  }
`;

const Profile = () => {
  const { currentUser } = useAuthValue();
  const { userDocument } = useContext(CartContext) as CartContextType;
  const [viewingOrder, setViewingOrder] = React.useState(false);
  const [selectedOrderID, setSelectedOrder] = React.useState<null | string>(
    null
  );

  const viewOrder = (orderID: string) => {
    setViewingOrder(true);
    setSelectedOrder(orderID);
  };

  function resendVerification() {
    sendEmailVerification(currentUser!);
  }

  const confirmOrder = () => {
    const userDocRef = doc(db, "users", currentUser!.uid);

    userDocument.orders.forEach((order) => {
      if ((order.id = selectedOrderID!)) {
        let orderToConfirm = order;
        orderToConfirm!.status = "Complete";
        order.status = "Complete";
        const orderDoc = doc(db, "orders", orderToConfirm?.id!);
        // @ts-ignore
        updateDoc(orderDoc, orderToConfirm)
          .catch((e) => console.error(e))
          .then(() => {
            updateDoc(userDocRef, {
              orders: userDocument.orders,
            })
              .catch((e) => console.error(e))
              .then(() => {
                setViewingOrder(false);
                console.log("order status updated successfully");
              });
          });
      }
    });
  };

  return (
    <Layout>
      {currentUser && userDocument ? (
        <ProfileContainer style={{ width: "100%" }}>
          {!viewingOrder ? (
          



          // FOR VIEWING THE PROFILE!!!
            <>
              <ProfileSidebar>
                <h4>Account Tools</h4>
                <ul>
                  <li>
                    <Link to="/reset">Reset Password</Link>
                  </li>
                  <li>
                    <Link onClick={resendVerification} to="#">
                      Re-Send Verification Email
                    </Link>
                  </li>
                </ul>
              </ProfileSidebar>
              <CenteredContainer>
                <HeadingContainer>
                  <Text size={30}>Hello -</Text>
                  <Text size={50} color="primary" b>
                    {userDocument.storeName}
                  </Text>
                </HeadingContainer>
                <Text>View Past Orders</Text>
                {userDocument.orders.length != 0 ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      alignItems: "space-evenly"
                    }}
                  >
                    {userDocument.orders.map((order) => {
                      return (
                        <Card
                          key={uuid()}
                          css={{
                            margin: "1rem",
                            minWidth: "250px",
                            maxWidth: "25%",
                            opacity: `${
                              order.status != "Reviewed" ? 0.5 : 1.0
                            }`,
                          }}
                        >
                          <Card.Header
                            css={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <h3>
                              {new Date(
                                order.orderDate.seconds * 1000
                              ).toDateString()}
                            </h3>
                            <h6>
                              Placed @{" "}
                              {new Date(
                                order.orderDate.seconds * 1000
                              ).toTimeString()}
                            </h6>
                          </Card.Header>
                          <Card.Body
                            css={{ textAlign: "center", fontSize: "2rem" }}
                          >
                            ${order.total.toFixed(2)}
                          </Card.Body>
                          <Card.Footer
                            css={{ display: "flex", justifyContent: "center" }}
                          >
                            {order.status == "Reviewed" && (
                              <div>
                                <Text css={{ textAlign: "center" }}>
                                  Ready to Confirm
                                </Text>
                                <Button onClick={() => viewOrder(order.id)}>
                                  View & Confirm
                                </Button>
                              </div>
                            )}
                            {order.status == "Complete" && (
                              <Text css={{ color: "green" }}>
                                <em>Order has been completed!</em>
                              </Text>
                            )}
                            {order.status == "Pending Review" && (
                              <Text css={{ color: "red" }}>
                                <em>Waiting on Review from Mr.Cigar</em>
                              </Text>
                            )}
                          </Card.Footer>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Text size={30}>Looks like you havent ordered before</Text>
                )}
              </CenteredContainer>
            </>
            



            
          ) : (
          // ORDER VIEWING!!!
            <InvoiceContainer>
              <ViewOrder orderID={selectedOrderID} />
              <ButtonContainer>
                <Button onClick={() => confirmOrder()} color="primary">
                  Confirm Order
                </Button>
                <Button color="secondary">Cancel Order</Button>
                <Button color="error" onClick={() => setViewingOrder(false)}>
                  Go Back
                </Button>
              </ButtonContainer>
            </InvoiceContainer>
          )}
          

          
        </ProfileContainer>
      ) : (
        <Text size={50}>Looks like you are not logged in</Text>
      )}
    </Layout>
  );
};

export default Profile;
