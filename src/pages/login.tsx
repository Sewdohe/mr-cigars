import React, { useState, useContext, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import { Input, Container, Row, Col, Button, Text } from "@nextui-org/react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import {auth} from '../components/Firebase'

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
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
  function handleSubmit(e) {
    if (formValues.password && formValues.email) {
      signInWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      ).then((rtnValue) => {
        navigate("/");
      });
    } else {
      setErrorMessage("Wrong Username or Password");
    }
  }

  return (
    <Layout>
      <Container justify="center" style={{ maxWidth: "60%" }}>
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
            labelPlaceholder="Password"
            required
            value={formValues.password}
            name="password"
            onChange={handleInputChange}
            type="password"
          />
        </Row>
        <Button onClick={handleSubmit}>Submit</Button>
      </Container>
    </Layout>
  );
};

export default Login;
