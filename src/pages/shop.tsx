import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../@types/product";
import Layout from "../components/Layout";
import styled from "styled-components";

import { Grid } from "@nextui-org/react";
import CategorySidebar from "../components/CategorySidebar";
import uuid from "react-uuid";

interface QueryResult {
  allWcProducts: {
    edges: [
      {
        node: Product;
      }
    ];
  };
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const Shop: React.FC<PageProps<QueryResult>> = ({ data }) => {
  return (
    <Layout>
      <Container>
        <Grid.Container css={{flexGrow: '0'}} gap={2} justify="center">
          {data.allWcProducts.edges.map(({ node: Product }) => {
            return (
              <Grid
                key={uuid()}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
              >
                <ProductCard item={Product}></ProductCard>
              </Grid>
            );
          })}
        </Grid.Container>
        <CategorySidebar />
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query {
    allWcProducts(filter: { featured: { eq: true } }) {
      edges {
        node {
          ...ProductData
        }
      }
    }
  }
`;

export default Shop;
