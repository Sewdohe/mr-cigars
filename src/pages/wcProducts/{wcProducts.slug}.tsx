import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import { Product } from "../../@types/product";
import styled from "styled-components";

import { CartContext } from "../../contexts/CartContext";
import { CartContextType } from "../../@types/cart";

import { Button, Input } from "@nextui-org/react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";

interface Data {
  data: {
    wcProducts: Product;
  };
}

const PriceText = styled.span`
  font-size: 1.6rem;
  color: red;
  font-weight: bold;
`;

const ProductTemplate: React.FC<Data> = ({ data }: Data) => {
  const { wcProducts: product } = data;

  let hasAttributes: boolean;
  let attributes: string[] = [];

  const { addToCart } = React.useContext(
    CartContext
  ) as CartContextType;
  const [qty, setQty] = useState(1);

  // SET ATTRIBUTE STATES
  // THE MAX ATTRIBUTES OF ANY ITEM ARE 4
  const [attrib0, setAttrib0] = useState(
    product.attributes ? product.attributes[0]?.options?.[0] : ""
  );
  const [attrib1, setAttrib1] = useState(
    // @ts-ignore
    product.attributes ? product.attributes[1]?.options?.[0] : ""
  );
  const [attrib2, setAttrib2] = useState(
    // @ts-ignore
    product.attributes ? product.attributes[2]?.options?.[0] : ""
  );
  const [attrib3, setAttrib3] = useState(
    // @ts-ignore
    product.attributes ? product.attributes[3]?.options?.[0] : ""
  );

  const [selected0, setSelected0] = useState(attrib0)
  const [selected1, setSelected1] = useState(attrib1)
  const [selected2, setSelected2] = useState(attrib2)
  const [selected3, setSelected3] = useState(attrib3)

  if (attrib0 === undefined) {
    setAttrib0("");
  }
  if (attrib1 === undefined) {
    setAttrib1("");
  }
  if (attrib2 === undefined) {
    setAttrib2("");
  }
  if (attrib3 === undefined) {
    setAttrib3("");
  }

  // useEffect(() => {
  //   console.log(attrib0);
  //   console.log(attrib1);
  //   console.log(attrib2);
  //   console.log(attrib3);
  // }, [attrib0, attrib1, attrib2, attrib3]);

  // @ts-ignore
  product.attributes.length != 0
    ? (hasAttributes = true)
    : (hasAttributes = false);

  const addItemToCart = () => {
    addToCart(product, qty, [attrib0, attrib1, attrib2, attrib3]);
  };

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  `

  return (
    <Layout>
      <Container>
        {/* PRODUCT NAME */}
        <h1>{product.name}</h1>

        {/* PRODUCT IMAGE */}
        <div>
          {product.images.length > 0 ? (
            <img
              style={{ maxWidth: "175px", maxHeight: "175px" }}
              src={product.images[0].src}
              alt={"product image"}
            />
          ) : (
            <span>no image</span>
          )}
        </div>

        {/* ATTRIBUTE BOXES */}
        <Box sx={{ minWidth: "100px" }}>
          {product.attributes?.map((attribute, index) => {
            return (
              <FormControl
                key={uuid()}
                fullWidth
                style={{ margin: "10px" }}
              >
                <InputLabel id={attribute?.name}>
                  {attribute?.name}
                </InputLabel>
                <Select
                  labelId="attrib-select-id"
                  id="attrib-select"
                  aria-label="Flavor Select"
                  value={eval(`attrib${index}`)}
                  label={attribute?.name}
                  autoWidth
                  onChange={(e) => { eval(`setAttrib${index}(e.target.value)`)}}
                >
                  {attribute.options?.map((o) => {
                    return (
                      <MenuItem value={o} key={uuid()}>
                        {o}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
          })}
        </Box>

        <div style={{ margin: "1rem 1rem" }}>
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p>no description for product</p>
          )}
        </div>

        {/* PRODUCT PRICE */}
        <PriceText>${product.price * 1}</PriceText>
        <div style={{ width: "100px", padding: "8px" }}>
          <Input
            value={1}
            type="number"
            onChange={(e) => setQty(parseInt(e.target.value))}
          />
        </div>

        {/* BUY BUTTON */}
        <Button color="primary" onClick={addItemToCart}>Add to Cart</Button>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query ItemQuery($id: String!) {
    wcProducts(id: { eq: $id }) {
      ...ProductData
    }
  }
`;

export default ProductTemplate;