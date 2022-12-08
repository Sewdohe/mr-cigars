import React, { useState, useContext, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import { Input, Container, Row, Col, Button, Text, Spacer } from "@nextui-org/react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import {auth} from '../components/Firebase'
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 1rem;
  flex-direction: column;
  padding: 0 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
`

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
      <FormContainer>
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
              label="Password"
              required
              underlined={true}
              value={formValues.password}
              name="password"
              onChange={handleInputChange}
              type="password"
            />
        </FormGroup>
        <ActionsContainer>
          <Button onClick={handleSubmit}>Submit</Button>
        </ActionsContainer>
      </FormContainer>
    </Layout>
  );
};

export default Login;
