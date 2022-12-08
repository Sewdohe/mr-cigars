import React from "react";
import styled from "styled-components";
import Nav from "../components/Nav";
import { NextUIProvider } from "@nextui-org/react";

// @ts-ignore
import { lightTheme } from "../styles/nextUITheme";

const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 1rem auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

type Props = {
  children: JSX.Element | JSX.Element[],
};

export function Head() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </>
  )
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <NextUIProvider theme={lightTheme}>
      <Nav />
      <SiteContainer>{children}</SiteContainer>
    </NextUIProvider>
  );
};

export default Layout;
