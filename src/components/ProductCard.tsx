import { navigate } from "gatsby";
import React from "react";
import styled from "styled-components";
import { Product } from "../@types/product";

import { Card, Text, Button } from "@nextui-org/react";
import { useAuthValue } from "./AuthContext";

interface Props {
  item: Product;
}

const PriceText = styled.div`
  color: green;
  font-weight: bold;
  font-size: 1.3rem;
  width: 100%;
  text-align: center;
  margin: 0.1rem;
  padding: 0;
  overflow: hidden;
`;

export const ProductCard = ({ item }: Props) => {
  const { currentUser } = useAuthValue();
  return (
    <>
      <Card
        isPressable
        isHoverable
        onClick={() => navigate("/product/" + item.slug)}
        css={{ flexGrow: "0", maxHeight: "450px" }}
      >
        <Card.Header>
          <Text h3>{item.name}</Text>
        </Card.Header>
        {item.images.length > 0 ? (
          <Card.Image
            src={item.images[0].src.replace(
              "cigars.local",
              "dariwholesales.com"
            )}
            width="300px"
            height="300px"
            objectFit="cover"
          />
        ) : (
          <span>no image</span>
        )}
        <Card.Body css={{ overflow: "hidden" }}>
          {/* Using price * 1 to remove the trailing zeros from the number returned from wordpress */}
          {currentUser != null ? (
            <>
              {console.log(currentUser)}
              <PriceText>${item.price * 1}</PriceText>
            </>
          ) : (
            <PriceText>log in for prices</PriceText>
          )}
        </Card.Body>
        {/* <Card.Footer
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            auto
            shadow
            onClick={() => navigate("/wcProducts/" + item.slug)}
          >
            View Item
          </Button>
        </Card.Footer> */}
      </Card>
    </>
  );
};
