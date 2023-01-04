import { Input, Button } from "@nextui-org/react";
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
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

//@ts-ignore
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <SearchContainer>
    <Form action="/search" method="get" autoComplete="off">
      <SearchInput
        aria-label="Search"
        // onInput={(e) => debounce(() => {
        //     console.log('running the thing')
        //     //@ts-ignore
        //     setSearchQuery(e.target.value)
        //   }, 250)
        // }
        //@ts-ignore
        onInput={debounce((e) => {
            console.log("performing search")
            setSearchQuery(e.target.value)
        }, 250)}
        type="text"
        id="header-search"
        placeholder="Search for an Item"
        name="s"
      />
      {/* <Button type="submit">Search</Button> */}
    </Form>
  </SearchContainer>
);

export default SearchBar;
