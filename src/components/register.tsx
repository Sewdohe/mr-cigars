import React, { useState, useEffect } from "react";
import { navigate, useStaticQuery, graphql } from "gatsby";
import Layout from "../components/Layout";
import { Input, Button, Text, Spacer, Switch, Card } from "@nextui-org/react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../components/Firebase";

//@ts-ignore
import { db } from "../components/Firebase";

import { doc, setDoc } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  justify-content: space-around;
  justify-items: space-evenly;
  width: inherit;
  align-items: center;
  padding: 1rem;
  flex-direction: column;
  padding: 0 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  margin-top: 1rem;
`;

interface Props {
  allDataCsv: {
    edges: [
      {
        node: {
          name: string;
          num: string;
        };
      }
    ];
  };
}

const Register = () => {
  const [_errorMessage, setErrorMessage] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [isExistingCustomer, setIsExistingCustomer] = useState(true);
  const [customerFound, setCustomerFound] = useState(false)
  const data: Props = useStaticQuery(graphql`
    query MyQuery {
      allDataCsv {
        edges {
          node {
            name
            num
          }
        }
      }
    }
  `);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    storeName: "",
    storeAddress: "",
    storeCity: "",
    storeZip: "",
    stateTaxId: "",
    fedTaxId: "",
    customerNumber: "",
  });

  let _isMounted = true;

  useEffect(() => {
    return () => {
      _isMounted = false;
    };
  }, []);

  function toggleForm() {
    setIsExistingCustomer(!isExistingCustomer);
  }

  // @ts-ignore
  function handleInputChange(e) {
    // e.persist();
    setErrorMessage("");
    setFormValues((currentValues) => ({
      ...currentValues,
      [e.target.name]: e.target.value,
    }));
  }

  // @ts-ignore
  function handleSubmit() {
    // GET THE CUSTOMERS INFORMATION IF CUSTOMER NUMBER WAS ENTERED
    console.log(formValues);
    if (formValues.customerNumber != "") {
      // if customer number isn't empty
      console.log("checking if exists...");
      data.allDataCsv.edges.forEach((edge) => {
        if (edge.node.num == formValues.customerNumber) {
          setCustomerFound(true)
          formValues.storeName = edge.node.name
          formValues.storeAddress = "quick-sign"
          formValues.storeZip = "quick-sign"
          formValues.storeCity = "quick-sign"
          formValues.fedTaxId = "quick-sign"
          formValues.stateTaxId = "quick-sign"
          console.log(`This is ${edge.node.name} trying to sign up`)
        }
        if(!customerFound) {
          navigate('/error')
        }
      });
    }

    /* e.preventDefault() */
    if (formValues.password === formValues.confirmPassword) {
      createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      )
        .then((userCredential) => {
          // upload users information to database profile
          console.log(userCredential);
          try {
            const docRef = doc(db, "users", userCredential.user.uid);
            setDoc(docRef, {
              userName: formValues.userName,
              email: formValues.email,
              storeName: formValues.storeName,
              storeAddress: formValues.storeAddress,
              storeZip: formValues.storeZip,
              storeCity: formValues.storeCity,
              stateTaxId: formValues.stateTaxId,
              fedTaxId: formValues.fedTaxId,
              cart: [],
              notifications: [],
              orders: [],
            }).catch((_reason) =>
              console.error("Couldn't add user data to database")
            );
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          // send user back to the home page if successful
          navigate("/welcome");
          sendEmailVerification(auth.currentUser!);
        })
        .finally(() => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: formValues.userName,
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      setErrorMessage("Both Password Fields must Match!");
    }
  }
  return (
    <div style={{ width: "100%" }}>
      <FormContainer>
        <Card
          css={{
            maxWidth: "240px",
            margin: "1rem",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Card.Body css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Switch onChange={toggleForm} />
            <span>Quick sign-up for existing customers</span>
          </Card.Body>
        </Card>
      </FormContainer>
      <FormContainer
        style={{
          flexDirection: `${isTabletOrMobile ? "column" : "row"}`,
          justifyContent: `${isTabletOrMobile ? "center" : "space-evenly"}`,
          alignItems: `space-evenly`,
          maxWidth: "100%",
        }}
      >
        {isExistingCustomer ? (
          <>
            <FormGroup>
              <Text h2 css={{ textAlign: "center" }}>
                Account Information
              </Text>
              <Input
                label="Email"
                required
                underlined={true}
                value={formValues.email}
                name="email"
                onChange={handleInputChange}
                type="email"
              />
              <Spacer y={0.5} />
              <Input
                label="User Name"
                required
                underlined={true}
                value={formValues.userName}
                name="userName"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
              <Input
                label="Password"
                required
                underlined={true}
                value={formValues.password}
                name="password"
                onChange={handleInputChange}
                type="password"
              />
              <Spacer y={0.5} />
              <Input
                label="Confirm Password"
                required
                underlined={true}
                value={formValues.confirmPassword}
                name="confirmPassword"
                onChange={handleInputChange}
                type="password"
              />
            </FormGroup>
            <FormGroup>
              <Text h2 css={{ textAlign: "center" }}>
                Store Information
              </Text>
              <Input
                label="Store Name"
                required
                underlined={true}
                value={formValues.storeName}
                name="storeName"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
              <Input
                label="Store's Address"
                required
                underlined={true}
                value={formValues.storeAddress}
                name="storeAddress"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
              <Input
                label="Store's City"
                required
                underlined={true}
                value={formValues.storeCity}
                name="storeCity"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
              <Input
                label="Store's Zip"
                required
                underlined={true}
                value={formValues.storeZip}
                name="storeZip"
                onChange={handleInputChange}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <Text h2 css={{ textAlign: "center" }}>
                Tax Information
              </Text>
              <Input
                label="State Tax ID"
                required
                underlined={true}
                value={formValues.stateTaxId}
                name="stateTaxId"
                onChange={handleInputChange}
                type="number"
              />
              <Spacer y={0.5} />
              <Input
                label="Federal Tax ID"
                required
                underlined={true}
                value={formValues.fedTaxId}
                name="fedTaxId"
                onChange={handleInputChange}
                type="number"
              />
              <Spacer y={0.5} />
            </FormGroup>
          </>
        ) : (
          <>
            <FormGroup>
              <Input
                label="Email"
                required
                underlined={true}
                value={formValues.email}
                name="email"
                onChange={handleInputChange}
                type="email"
              />
              <Spacer y={0.5} />
              <Input
                label="User Name"
                required
                underlined={true}
                value={formValues.userName}
                name="userName"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
              <Input
                label="Password"
                required
                underlined={true}
                value={formValues.password}
                name="password"
                onChange={handleInputChange}
                type="password"
              />
              <Spacer y={0.5} />
              <Input
                label="Confirm Password"
                required
                underlined={true}
                value={formValues.confirmPassword}
                name="confirmPassword"
                onChange={handleInputChange}
                type="password"
              />
              <Input
                label="Customer Number"
                required
                underlined={true}
                value={formValues.customerNumber}
                name="customerNumber"
                onChange={handleInputChange}
                type="text"
              />
              <Spacer y={0.5} />
            </FormGroup>
          </>
        )}
      </FormContainer>
      <ActionsContainer>
        <Button onClick={handleSubmit}>Submit</Button>
      </ActionsContainer>
    </div>
  );
};

export default Register;
