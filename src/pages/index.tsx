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
import AgeVerification from "../components/AgeVerification";

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
        <AgeVerification></AgeVerification>
        <Logo style={{
          maxWidth: '100%',
        }} />
        <Text css={{ width: "80%", fontSize: "1.4rem" }}>Welcome to Mr.Cigars online! We are proud to offer a wide variety of
          tobacco products to meet the needs of all our customers. Our selection includes Premium Cigars, Pipe Tobacco, Rolling Tobacco, Wraps,
          Smoking Accessories, General Goods, Store Supplies, and much more. We strive to provide our customers with the highest quality products at the
          best prices. Our knowledgable staff is always available to answer any questions you may have and help you find exactly what sells in YOUR store.
          Shop with us today and experience the difference!</Text>

        <Text h2>New Accounts:</Text>
        <Text css={{ width: "80%", fontSize: "1.4rem" }}>
          Like to open an account? We'd love to have you as a customer!
          Currently, we currently only accept customers in North Carolina. In
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
                        <Grid key={Product.id} xs={12} sm={6} md={4} lg={3} xl={3}>
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
