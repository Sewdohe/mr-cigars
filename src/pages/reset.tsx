import { Button, FormElement, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import styled from 'styled-components'
import Layout from '../components/Layout'

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../components/Firebase";

const Container = styled.div`
  padding: 1rem;
  p {
    margin-bottom: 3rem;
  }
  Input {
    margin: 1rem;
  }
`

function Reset() {
  const [email, setEmail] = useState('')


  function handleChange(e: React.ChangeEvent<FormElement>) {
    setEmail(e.target.value)
  }

  function resetPassword(email: string): void {
    sendPasswordResetEmail(auth, email);
  }

  return (
    <Layout>
      <Container>
        <h1>Password Reset</h1>
        <p>Forgot your password? Simply enter your email address below and click the button to recieve your password reset email</p>
        <Input onChange={handleChange} labelPlaceholder="Email" css={{marginBottom: '1rem'}}></Input>
        <Button onClick={() => resetPassword(email)}>Reset Password</Button>
      </Container>
    </Layout>
  )
}

export default Reset