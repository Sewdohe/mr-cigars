import { Input, Button, } from "@nextui-org/react";
import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const SearchInput = styled(Input)`
    width: 350px;
`

const Form = styled.form`
    display: flex;
    width: 100%;
    justify-content: center;
`

//@ts-ignore
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <SearchContainer>
    <Form action="/search" method="get" autoComplete="off">
      <SearchInput
        aria-label="Search"
        //@ts-ignore
        onInput={(e) => setSearchQuery(e.target.value)}
        type="text"
        id="header-search"
        placeholder="Search blog posts"
        name="s"
      />
      {/* <Button type="submit">Search</Button> */}
    </Form>
  </SearchContainer>
);

export default SearchBar;
