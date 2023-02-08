import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/Layout";
import { Product } from "../../@types/product";
import styled from "styled-components";

import { CartContext } from "../../contexts/CartContext";
import { CartContextType } from "../../@types/cart";

import { Button, Input } from "@nextui-org/react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";
import { useAuthValue } from "../../components/AuthContext";
import Device from "../../utils/Breakpoints";

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

// DONE: Adapt this layout to smaller screen size on mobile
const Container = styled.div`
  display: grid;
  overflow: visible;
  @media ${Device.mobileS} {
    grid-template-areas:
      "title"
      "image"
      "desc"
      "price"
      "attrib"
      "button"
      "qty";
  }
  @media ${Device.tablet} {
    grid-template-areas:
      "title title  title"
      "image desc   desc"
      "image desc   desc"
      "image price  attrib"
      "image button qty";
  }
  height: 100%;
  width: 80%;
  justify-content: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  grid-area: title;
  text-align: center;
`;

const ProdImage = styled.div`
  grid-column: 1 / -1;
  grid-area: image;
  @media ${Device.mobileS} {
    max-width: 340px;
  }
`;

const Attribs = styled.div`
  grid-area: attrib;
  justify-self: center;
  overflow: visible;
  align-self: center;
  @media ${Device.mobileS} {
    justify-self: center;
  }
`;

const Price = styled.div`
  grid-area: price;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
`;

const Qty = styled.div`
  grid-area: qty;
  justify-self: start;
  align-self: center;
  @media ${Device.mobileS} {
    justify-self: center;
  }
`;

const Desc = styled.div`
  grid-area: desc;
  align-self: flex-end;
  justify-self: center;
  @media ${Device.mobileS} {
    justify-self: center;
  }
`;

const Purchase = styled.div`
  grid-area: button;
  justify-self: center;
  align-self: center;
  @media ${Device.mobileS} {
    justify-self: center;
  }
`;

const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

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
        {/* // SECTION: Name */}
        <Title>{product.name}</Title>

        {/* // SECTION: Image */}
        <ProdImage>
          {product.images.length > 0 ? (
            <img
              // style={{ maxWidth: "500px", maxHeight: "500px" }}
              src={selectedImageVariation}
              alt={"product image"}
            />
          ) : (
            <span>no image</span>
          )}
        </ProdImage>

        {/* // SECTION: Attribute Boxes */}
        <Attribs>
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
                          product.product_variations![neededIndex].image.src
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
        </Attribs>

        <Desc style={{ margin: "1rem 1rem" }}>
          {product.description ? (
            <p dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p>no description for product</p>
          )}
        </Desc>

        {/* // SECTION: Price */}
        <Price>
          {currentUser != null ? (
            <FlexCenter>
              {currentUser.emailVerified ? (
                <PriceText>${product.price * 1}</PriceText>
              ) : (
                <PriceText>Please Verify Email to view prices</PriceText>
              )}
            </FlexCenter>
          ) : (
            <FlexCenter>
              <PriceText>log in for prices</PriceText>
              <Link to="/register">Register to Shop Online</Link>
            </FlexCenter>
          )}
        </Price>

        {/* // SECTION: Quantity */}
        <Qty style={{ width: "100px", padding: "8px" }}>
          <Input
            value={1}
            type="number"
            aria-label="Quantity Box"
            min="1"
            max="100"
            onChange={(e) => {
              setQty(parseInt(e.target.value));
            }}
          />
        </Qty>

        {/* // SECTION: Buy Button */}
        <Purchase>
          {currentUser != null && (
            <Button
              disabled={!currentUser.emailVerified}
              color="primary"
              onClick={addItemToCart}
            >
              Add to Cart
            </Button>
          )}
        </Purchase>
        
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
