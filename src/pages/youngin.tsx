import React from 'react'
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
const youngin = () => {
  return (
    <Layout>
      <Container>
        <h1>You must be 21 or Older to Enter this Website</h1>
        <h2>Sorry</h2>
      </Container>
    </Layout>
  )
}

export default youngin