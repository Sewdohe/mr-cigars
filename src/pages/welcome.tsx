import React from 'react'
import Logo from '../../assets/mr-cigars-logo-web.svg'
import Layout from "../components/Layout";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 2rem;
  p {
    font-size: 2rem;
  }
`

const Welcome = () => {
  return (
    <Layout>
      <Container>
        <h1>Welcome To Mr.Cigars!</h1>
        <Logo style={{
            maxWidth: '100%',
            maxHeight: '250px'
          }} />
        <p>Thank you for signing up!</p>

        <h1 style={{color: 'red', textDecoration: 'underline'}}>Next Step:</h1>
        <p>Please check your email for a verification link.</p>
        <p>You <b>MUST</b> verify your email before you can shop or view prices.</p>
      </Container>
    </Layout>
  )
}

export default Welcome