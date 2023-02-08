import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import { Product } from "../../@types/product";
import { ProductCard } from "../../components/ProductCard";
import CategorySidebar from "../../components/CategorySidebar";
import { Grid } from "@nextui-org/react";
import styled from "styled-components";
import uuid from "react-uuid";

interface Data {
    data: {
        allWcProducts: {
            edges: [
                {
                    node: Product;
                }
            ];
        };
    };
}


const Container = styled.div`
  display: flex;
  width: 100%;
`;

const TagPage: React.FC<Data> = ({ data }: Data) => {
    return (
        <Layout>
            <Container>
                <Grid.Container gap={2} justify="center">
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
                <CategorySidebar  />
            </Container>
        </Layout>
    );
};

export const query = graphql`
    query ItemTagQuery($id: String!) {
        allWcProducts(filter: { tags: { elemMatch: { id: { eq: $id } } } }) {
            edges {
                node {
                    ...ProductData
                }
            }
        }
    }
`;

export default TagPage;
