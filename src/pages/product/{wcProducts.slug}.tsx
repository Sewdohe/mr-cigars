import React, { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import { Product } from "../../@types/product";
import styled from "styled-components";

import { CartContext } from "../../contexts/CartContext";
import { CartContextType } from "../../@types/cart";

import { Button, Input } from "@nextui-org/react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";
import { useAuthValue } from "../../components/AuthContext";

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
`;

const ProductTemplate: React.FC<Data> = ({ data }: Data) => {
  const { wcProducts: product } = data;
  const { currentUser } = useAuthValue();

  let hasAttributes: boolean;
  let attributes: string[] = [];

  const { addToCart } = React.useContext(CartContext) as CartContextType;
  const [qty, setQty] = useState(1);
  const [selectedImageVariation, setSelectedImageVariation] = useState(
    product.images[0].src ? product.images[0].src : ""
  );

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

  const [selected0, setSelected0] = useState(attrib0);
  const [selected1, setSelected1] = useState(attrib1);
  const [selected2, setSelected2] = useState(attrib2);
  const [selected3, setSelected3] = useState(attrib3);

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

  // @ts-ignore
  product.attributes.length != 0
    ? (hasAttributes = true)
    : (hasAttributes = false);

  const addItemToCart = () => {
    addToCart(product, qty, [attrib0, attrib1, attrib2, attrib3]);
  };

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
              src={selectedImageVariation}
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
              <FormControl key={uuid()} fullWidth style={{ margin: "10px" }}>
                <InputLabel id={attribute?.name}>{attribute?.name}</InputLabel>
                <Select
                  labelId="attrib-select-id"
                  id="attrib-select"
                  aria-label="Flavor Select"
                  value={eval(`attrib${index}`)}
                  label={attribute?.name}
                  autoWidth
                  onChange={(e) => {
                    let neededIndex = 0;
                    product.product_variations?.forEach((v, i) => {
                      v.attributes.forEach((a, idx) => {
                        if (a.option == e.target.value) {
                          // we found the attr we needed
                          neededIndex = i;
                        }
                        console.log(
                          product.product_variations![neededIndex].image.src
                        );
                        setSelectedImageVariation(
                          product.product_variations![
                            neededIndex
                          ].image.src
                        );
                      });
                    });
                    eval(`setAttrib${index}(e.target.value)`);
                  }}
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
            <p dangerouslySetInnerHTML={{__html: product.description}} />
          ) : (
            <p>no description for product</p>
          )}
        </div>

        {/* PRODUCT PRICE */}
        {currentUser != null ? 
        (
          <>
            {currentUser.emailVerified ? <PriceText>${product.price * 1}</PriceText> : <PriceText>Please Verify Email to view prices</PriceText>}
          </>
        ) : 
        (
          <PriceText>login for prices</PriceText>
        )}
        <div style={{ width: "100px", padding: "8px" }}>
          <Input
            value={1}
            type="number"
            onChange={(e) => setQty(parseInt(e.target.value))}
          />
        </div>

        {/* BUY BUTTON */}
        {currentUser != null && (
          <Button disabled={!currentUser.emailVerified} color="primary" onClick={addItemToCart}>
            Add to Cart
          </Button>
        )}
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
