import React, {useState} from "react";
import { graphql, useStaticQuery, navigate } from "gatsby";
import styled from "styled-components";

import { Card, Switch } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import CategoryDropdown from "./CategoryDropdown";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "./IconButton";

import uuid from "react-uuid";
import { Category, Fullscreen, MenuTwoTone } from "@mui/icons-material";
import {Head} from "./Layout";

type Anchor = "top" | "left" | "bottom" | "right";

interface Categories {
  allWcProductsCategories: {
    edges: [
      {
        node: {
          name: string;
          id: string;
          slug: string;
          wordpress_parent_id: number;
          wordpress_children: [
            {
              name: string;
              slug: string;
            }
          ];
          wordpress_parent: {
            name: string;
            slug: string;
          };
        };
      }
    ];
  };
  allWcProductsTags: {
    edges: [{
      node: {
        id: string,
        name: string,
        slug: string
      }
    }]
  }
}

const Nav = styled.nav`
  margin: 1rem;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
`

const StyledSwitch = styled(Switch)`
  align-self: flex-end;
`

const Spacer = styled.span`
  flex-grow: 1;
`

export default function CategorySidebar() {
  const data: Categories = useStaticQuery(graphql`
    query {
      allWcProductsCategories {
        edges {
          node {
            name
            id
            slug
            wordpress_parent_id
            wordpress_children {
              name
              slug
            }
            wordpress_parent {
              name
              slug
            }
          }
        }
      }
      allWcProductsTags {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  `);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [displayTags, setDisplayTags] = useState(false);

  const categories = data.allWcProductsCategories.edges;
  const tags = data.allWcProductsTags.edges;

  // can pass a new state or let the function flip the state on its own
  const toggleDrawer = (newOpen?: boolean) => () => {
    if (newOpen) {
      setDrawerOpen(!drawerOpen);
    } else {
      setDrawerOpen(newOpen!);
    }
  };

  const toggleDrawerType = () => {
    setDisplayTags(!displayTags);
  }

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  console.log(tags)

  return (
    <>
      {isDesktopOrLaptop ? (
        <Card css={{ maxWidth: "10%", minWidth: "190px" }}>
            <SidebarHeader>
              {!displayTags ? 'Categories' : 'Tags'}
              <Spacer />
              <StyledSwitch onChange={toggleDrawerType}>View Tags</StyledSwitch>
            </SidebarHeader>

          <Divider />
          <Nav aria-label="categories">
            <List dense>
              {!displayTags ? <>
                {categories.map((category) => {
                  return category.node.wordpress_children.length! > 0 ? (
                      <CategoryDropdown key={uuid()} category={category} />
                  ) : category.node.wordpress_parent == null ? (
                      <ListItemButton
                          key={category.node.id}
                          onClick={() => {
                            navigate(`/category/${category.node.slug}`);
                          }}
                      >
                        <ListItemText primary={category.node.name} />
                      </ListItemButton>
                  ) : (
                      <></>
                  );
                })}
              </> : <>
                {tags.map(tag => {
                  return <>
                    <ListItemButton
                        key={tag.node.id}
                        onClick={() => {
                          navigate(`/tag/${tag.node.slug}`)
                        }}
                    >
                      {tag.node.name}
                    </ListItemButton>
                  </>
                })}
              </>}

            </List>
          </Nav>
        </Card>
      ) : (
        <span></span>
      )}
      {isTabletOrMobile ? (
        <div>
          <IconButton
            style={{ position: "fixed", bottom: 30, right: 20 }}
            onClick={toggleDrawer(true)}
          >
            <MenuTwoTone />
          </IconButton>
          <Drawer
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            variant="persistent"
          >
            <SidebarHeader>
              {!displayTags ? 'Categories' : 'Tags'}
              <Spacer />
              <StyledSwitch onChange={toggleDrawerType}>View Tags</StyledSwitch>
            </SidebarHeader>
            <List style={{minWidth: '200px'}} dense>
              {!displayTags ? <>
                {categories.map((category) => {
                  return category.node.wordpress_children.length! > 0 ? (
                      <CategoryDropdown key={uuid()} category={category} />
                  ) : category.node.wordpress_parent == null ? (
                      <ListItemButton
                          key={category.node.id}
                          onClick={() => {
                            navigate(`/category/${category.node.slug}`);
                          }}
                      >
                        <ListItemText primary={category.node.name} />
                      </ListItemButton>
                  ) : (
                      <></>
                  );
                })}
              </> : <>
                {tags.map(tag => {
                  return <>
                    <ListItemButton
                        key={tag.node.id}
                        onClick={() => {
                          navigate(`/tag/${tag.node.slug}`)
                        }}
                    >
                      {tag.node.name}
                    </ListItemButton>
                  </>
                })}
              </>}

            </List>
          </Drawer>
        </div>
      ) : (
        <span></span>
      )}
    </>
  );
}
