import React from "react";
import { graphql, useStaticQuery, navigate } from "gatsby";
import styled from "styled-components";

import { Card } from '@nextui-org/react'
import { useMediaQuery } from 'react-responsive'
import CategoryDropdown from './CategoryDropdown'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from './IconButton';

import uuid from "react-uuid";
import { MenuTwoTone } from "@mui/icons-material";


type Anchor = 'top' | 'left' | 'bottom' | 'right';


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
}

const Nav = styled.nav`
  margin: 1rem;
`;

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
    }
  `);

	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-width: 1224px)'
	})
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

	// can pass a new state or let the function flip the state on its own
	const toggleDrawer = (newOpen?: boolean) => () => {
		if (newOpen) {
			setDrawerOpen(!drawerOpen)
		} else {
			setDrawerOpen(newOpen!);
		}
	};

	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const list = (anchor: Anchor) => (
		<Box
			sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
			role="presentation"
			// onClick={toggleDrawer()}
			onKeyDown={toggleDrawer()}
		>
			<List dense>
				{data.allWcProductsCategories.edges.map((category) => {
					{
						return category.node.wordpress_children.length! > 0 ? (
							<CategoryDropdown key={uuid()}
								category={category} />
						) : (
							<ListItemButton
								key={category.node.id}
								onClick={() => {
									navigate(`/wcProductsCategories/${category.node.slug}`)
								}}
							>
								<ListItemText primary={category.node.name} />
							</ListItemButton>
						);
					}
				})}
			</List>
		</Box>
	);

	return (
		<>
			{isDesktopOrLaptop ? (
				<Card css={{ maxWidth: '10%', minWidth: '190px' }}>
					<Card.Header>
						Categories
					</Card.Header>

					<Divider />
					<Nav aria-label="categories">
						<List dense>
							{data.allWcProductsCategories.edges.map((category) => {
								{
									return category.node.wordpress_children.length! > 0 ? (
										<CategoryDropdown key={uuid()}
											category={category} />
									) : (
										<ListItemButton
											key={uuid()}
											onClick={() => {
												navigate(`/wcProductsCategories/${category.node.slug}`);
											}}
										>
											<ListItemText primary={category.node.name} />
										</ListItemButton>
									);
								}
							})}
						</List>
					</Nav>
				</Card>
			) : <span></span>}
			{isTabletOrMobile ? (
				<div>
					<IconButton style={{ position: "fixed", bottom: 30, right: 20 }} onClick={toggleDrawer(true)}>
						<MenuTwoTone />
					</IconButton>
					<Drawer
						open={drawerOpen}
						onClose={toggleDrawer(false)}
						variant="persistent"
					>
						{list('right')}
					</Drawer>
				</div>
			) : <span></span>}
		</>

	);
}
