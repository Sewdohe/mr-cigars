import React from 'react'
import Logo from '../../assets/mr-cigars-logo-web.svg'
import Layout from "../components/Layout";
import styled from 'styled-components';
import { Link } from 'gatsby';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 2rem;
  p {
    font-size: 2rem;
  }
`

const Error = () => {
  return (
    <Layout>
      <Container>
        <h1>Sorry, we couldn't find your account!</h1>
        <Logo style={{
            maxWidth: '100%',
            maxHeight: '250px'
          }} />

        <h1 style={{color: 'red', textDecoration: 'underline'}}>Error:</h1>
        <p>No customer is found with the account number you entered. Please <Link to="/register">try again</Link></p>
      </Container>
    </Layout>
  )
}

export default Error