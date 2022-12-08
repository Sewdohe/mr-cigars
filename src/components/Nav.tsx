import React from "react";
import { navigate, Link } from "gatsby";
import { Navbar, Button, Text, Avatar, Row, Tooltip } from "@nextui-org/react";
import { LogoutTwoTone } from "@mui/icons-material";

import { NextCart } from "./NextCart";

import { useAuthValue } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./Firebase";

import Logo from '../../assets/mr-cigars-logo-web.svg'

import uuid from 'react-uuid';
import Notifications from "./Notifications";
import styled from "styled-components";

const NavItems = [
  {
    displayName: "Home",
    url: "/",
    key: "home",
  },
  {
    displayName: "Shop",
    url: "/shop/",
    key: "shop",
  },
];

function handleSignOut() {
  signOut(auth);
}

const isBrowser = typeof window !== "undefined"

const LogoSVG = styled(Logo)`
  height: 60px;
  width: auto;
`

// TODO: Show Mr.Cigars logo

// @ts-ignore
const Nav = () => {
  let url: string = ""

  if (isBrowser) {
    url = window.location.pathname ? window.location.pathname : "";
  } else {
    url = ""
  }

  const { currentUser } = useAuthValue();

  let details;

  if (!currentUser) {
    details = (
      <Row>
        <Navbar.Item>
          <Button
            size="sm"
            flat
            css={{ margin: "0 0.5rem" }}
            onClick={() => navigate("/register/")}
          >
            Register
          </Button>
        </Navbar.Item>
        <Navbar.Item>
          <Button
            size="sm"
            flat
            css={{ margin: "0 0.5rem" }}
            onClick={() => navigate("/login/")}
          >
            Sign In
          </Button>
        </Navbar.Item>
      </Row>
    );
  } else {
    details = (
      <Row justify="center" align="center">
        <Tooltip placement="left" content={"View Profile"}>
          <Avatar onClick={() => navigate('/profile')} color="primary" bordered css={{ margin: '0 1rem' }} text={currentUser.displayName!} />
        </Tooltip>
        <Tooltip placement="left" content={"Sign Out"}>
          <Button color="warning" size="sm" rounded auto flat onClick={handleSignOut}>
            <LogoutTwoTone />
          </Button>
        </Tooltip>
      </Row>
    );
  }

  const collapseItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "Cart",
      link: "/cart",
    },
  ];

  return (
    <div>
      <Navbar maxWidth="fluid" variant="static">
        <Navbar.Toggle showIn="sm" aria-label="toggle navigation" />
        <Navbar.Brand hideIn="xs">
          <LogoSVG />
        </Navbar.Brand>
        <Navbar.Content variant="highlight" hideIn="xs">
          {NavItems.map((navItem) => {
            return (
              <Navbar.Link
                isActive={navItem.url == url ? true : false}
                key={uuid()}
                onClick={() => {
                  navigate(navItem.url);
                }}
              >
                {navItem.displayName}
              </Navbar.Link>
            );
          })}
        </Navbar.Content>
        {/* user account area */}
        <Navbar.Content activeColor="primary" showIn="xs" >
          <Navbar.Collapse>
            {collapseItems.map((item, index) => (
              <Navbar.CollapseItem key={uuid()}>
                <Link
                  color="inherit"
                  style={{
                    minWidth: "100%",
                  }}
                  to={item.link}
                >
                  {item.name}
                </Link>
              </Navbar.CollapseItem>
            ))}
          </Navbar.Collapse>
        </Navbar.Content>

        <Navbar.Content>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Notifications />
              <NextCart />
            </div>
          ) : (<></>)}
          {details}
        </Navbar.Content>
      </Navbar>
    </div>
  );
};

export default Nav;
