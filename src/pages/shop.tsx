import * as React from "react";
import { graphql, PageProps, navigate } from "gatsby";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../@types/product";
import Layout from "../components/Layout";
import styled from "styled-components";

import { Grid, } from "@nextui-org/react";
import CategorySidebar from "../components/CategorySidebar";
import uuid from "react-uuid";

import SearchBar from "../components/Search";

//@ts-ignore
import { useFlexSearch } from "react-use-flexsearch";

interface QueryResult {
  allWcProducts: {
    edges: [
      {
        node: Product;
      }
    ];
  };
  localSearchItems: {
    index?: any;
    store?: object;
  };
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Shop: React.FC<PageProps<QueryResult>> = ({ data }) => {
  if (typeof window !== "undefined") {
    // const query = new URLSearchParams(search).get("s");
  }
  const [searchQuery, setSearchQuery] = React.useState("");

  const index = data.localSearchItems?.index;
  const store = data.localSearchItems?.store;

  const results = useFlexSearch(searchQuery, index, store);

  return (
    <Layout>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div>
          {searchQuery != "" ? (
            <ul>
              {/* @ts-ignore */}
              {results.map((searchResult) => (
                <li onClick={() => navigate(`/product/${searchResult.slug}`)} key={uuid()}>{searchResult.name}</li>
              ))}
            </ul>
          ) : (
            <span></span>
          )}
        </div>

      {results.length == 0 ? (
        <Container>
          <Grid.Container css={{ flexGrow: "0", maxWidth: '100vw'}} gap={2} justify="center">
            {data.allWcProducts.edges.map(({ node: Product }) => {
              return (
                <Grid key={uuid()} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <ProductCard item={Product}></ProductCard>
                </Grid>
              );
            })}
          </Grid.Container>
          <CategorySidebar />
        </Container>
      ) : (
        <span></span>
      )}
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
    localSearchItems {
      index
      store
    }
  }
`;

export default Shop;
