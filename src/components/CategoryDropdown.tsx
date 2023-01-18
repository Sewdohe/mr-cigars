import React, { useState } from "react";
import { navigate } from "gatsby";

import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import uuid from "react-uuid";

interface Category {
  category: {
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
  };
}

const CategoryDropdown = (category: Category) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItemButton key={uuid()} onClick={handleClick}>
        <ListItemText primary={category.category.node.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {category.category.node.wordpress_children.map((child) => {
            return (
              <ListItemButton key={uuid()} sx={{ pl: 4, py: 0 }}>
                <ListItemText
                  onClick={() => {
                    navigate(`/category/${child.slug}`);
                  }}
                  key={uuid()}
                  primary={child.name}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </div>
  );
};

export default CategoryDropdown;
