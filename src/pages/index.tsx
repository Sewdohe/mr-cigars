import * as React from "react";
import Layout from "../components/Layout";
import { Text } from "@nextui-org/react";
import styled from "styled-components";
import Wave from '../../assets/wave.svg'
import Resistration from '../components/register'
import Logo from '../../assets/mr-cigars-logo-web.svg'
import { useAuthValue } from "../components/AuthContext";
import { graphql } from "gatsby";
import { Product } from "../@types/product";
import { PageProps } from 'gatsby'
import { Grid } from "@nextui-org/react";
import CategorySidebar from "../components/CategorySidebar";
import { ProductCard } from '../components/ProductCard';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const HeroContainer = styled.div`
  width: 100%;
  background: #ffe47aff;
  color: black;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ShopContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

interface QueryResult {
  allWcProducts: {
    edges: [
      {
        node: Product;
      }
    ];
  };
}

const IndexPage: React.FC<PageProps<QueryResult>> = ({ data }) => {
  const { currentUser } = useAuthValue();
  console.log(data)

  return (
    <Layout>
      <Container>
        <Logo style={{
          maxWidth: '100%',
        }} />
        <Text css={{ width: "80%", fontSize: "1.4rem" }}>Mr.Cigars is a Tobacco Wholesale, serving eastern North Carolina for over 18 Years.
          We are a small team of around 10 people - and we pride ourselves on our top-notch family style customer service! Come and shop with us,
          you won't be disappointed!</Text>

        <Text h2>Open Account</Text>
        <Text css={{ width: "80%", fontSize: "1.4rem" }}>
          Like to open an account? We'd love to have you as a customer!
          Unfortunatly, we currently only accept customers in North Carolina. In
          order to open an account, we will need your basic information, as well
          as information about your store, including your Federal tax-id number.
          We cannot open an account for you if you do not have a Federal tax-id
          number. We also cannot open an account if you require shipments across
          state lines, due to state tax regulations.
        </Text>
        <Wave />
        <HeroContainer>
          {currentUser == null ? (
            <>
              <Text as="h1">Register Now</Text>
              <Resistration />
            </>
          ) :
            (
              <>
                <Text as="h1">New Items!</Text>
                <ShopContainer>
                  <Grid.Container css={{ flexGrow: "0", maxWidth: '100vw' }} gap={2} justify="center">
                    {data.allWcProducts.edges.map(({ node: Product }) => {
                      return (
                        <Grid xs={12} sm={6} md={4} lg={3} xl={3}>
                          <ProductCard item={Product}></ProductCard>
                        </Grid>
                      );
                    })}
                  </Grid.Container>
                  <CategorySidebar />
                </ShopContainer>
              </>
            )}
        </HeroContainer>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query NewItemsQuery {
    allWcProducts(limit: 10, sort: {order: DESC, fields: date_created}) {
      edges {
        node {
          ...ProductData
        }
      }
    }
  }
`

export default IndexPage;
