import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import { Input, Container, Row, Button, Text } from "@nextui-org/react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../components/Firebase"

//@ts-ignore
import { db } from "../components/Firebase";

import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [_errorMessage, setErrorMessage] = useState("");

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
  });

  let _isMounted = true;

  useEffect(() => {
    return () => {
      _isMounted = false;
    };
  }, []);

  // @ts-ignore
  function handleInputChange(e) {
    e.persist();
    setErrorMessage("");
    setFormValues((currentValues) => ({
      ...currentValues,
      [e.target.name]: e.target.value,
    }));
  }

  // @ts-ignore
  function handleSubmit() {
    /* e.preventDefault() */
    if (formValues.password === formValues.confirmPassword) {
      createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      )
        .then((userCredential) => {
            // upload users information to database profile
            console.log(userCredential)
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
            }).catch(_reason => console.error("Couldn't add user data to database"))
          } catch (e) {
            console.error("Error adding document: ", e);
          }
            // send user back to the home page if successful
            navigate("/");
        }).finally(() => {
            if(auth.currentUser) {
                updateProfile(auth.currentUser, {
                    displayName: formValues.userName
                })
            }
        })
        .catch((error) => {
          console.error(error.message)
        });
    } else {
      setErrorMessage("Both Password Fields must Match!");
    }
  }
  return (
    <Layout>
      <Container style={{ maxWidth: "70%" }}>
        <Text h2 css={{ textAlign: "center" }}>
          Account Information
        </Text>
        <Row
          gap={2}
          css={{ margin: "1rem" }}
          justify="space-around"
          align="center"
        >
          <Input
            labelPlaceholder="Email"
            required
            value={formValues.email}
            name="email"
            onChange={handleInputChange}
            type="email"
          />
          <Input
            labelPlaceholder="User Name"
            required
            value={formValues.userName}
            name="userName"
            onChange={handleInputChange}
            type="text"
          />
          <Input
            labelPlaceholder="Password"
            required
            value={formValues.password}
            name="password"
            onChange={handleInputChange}
            type="password"
          />
          <Input
            labelPlaceholder="Confirm Password"
            required
            value={formValues.confirmPassword}
            name="confirmPassword"
            onChange={handleInputChange}
            type="password"
          />
        </Row>
        <Text h2 css={{ textAlign: "center" }}>
          Store Information
        </Text>
        <Row
          gap={2}
          css={{ margin: "1rem" }}
          justify="space-around"
          align="center"
        >
          <Input
            labelPlaceholder="Store Name"
            required
            value={formValues.storeName}
            name="storeName"
            onChange={handleInputChange}
            type="text"
          />
          <Input
            labelPlaceholder="Store's Address"
            required
            value={formValues.storeAddress}
            name="storeAddress"
            onChange={handleInputChange}
            type="text"
          />
          <Input
            labelPlaceholder="Store's City"
            required
            value={formValues.storeCity}
            name="storeCity"
            onChange={handleInputChange}
            type="text"
          />
          <Input
            labelPlaceholder="Store's Zip"
            required
            value={formValues.storeZip}
            name="storeZip"
            onChange={handleInputChange}
            type="text"
          />
        </Row>
        <Text h2 css={{ textAlign: "center" }}>
          Tax Information
        </Text>
        <Row
          gap={2}
          css={{ margin: "1rem" }}
          justify="space-around"
          align="center"
        >
          <Input
            labelPlaceholder="State Tax ID"
            required
            value={formValues.stateTaxId}
            name="stateTaxId"
            onChange={handleInputChange}
            type="number"
          />
          <Input
            labelPlaceholder="Federal Tax ID"
            required
            value={formValues.fedTaxId}
            name="fedTaxId"
            onChange={handleInputChange}
            type="number"
          />
        </Row>
        <Button onClick={handleSubmit}>Submit</Button>
      </Container>
    </Layout>
  );
};

export default Register;
