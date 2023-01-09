import { Link, navigate } from "gatsby";
import React from "react";
import styled from "styled-components";
import { Product } from "../@types/product";

import { Card, Text, Button } from "@nextui-org/react";
import { useAuthValue } from "./AuthContext";

interface Props {
  item: SearchResultItem;
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

interface SearchResultItem {
  name: string,
  price: number,
  image: string,
  id: string,
  slug: string
}

export const ProductCardSearch = ({ item }: Props) => {
  const { currentUser } = useAuthValue();
  console.log(item)

  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

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
          <Card.Image
            src={item.image}
            width="300px"
            height="300px"
            objectFit="cover"
          />
        <Card.Body css={{ overflow: "hidden" }}>
          {/* Using price * 1 to remove the trailing zeros from the number returned from wordpress */}
          {currentUser != null ? (
            <>
              {currentUser.emailVerified ? (
                <PriceText>${item.price * 1}</PriceText>
              ) : (
                <PriceText>Please Verify Email</PriceText>
              )}
            </>
          ) : (
            <>
              <PriceText>log in for prices</PriceText>
            </>
          )}
        </Card.Body>
        <Card.Footer
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        {!currentUser && (
          <Link to="/register">Register to Shop Online</Link>
        )}
        </Card.Footer>
      </Card>
    </>
  );
};
