import * as React from "react";
import Layout from "../components/Layout";
import { Text } from "@nextui-org/react";

const IndexPage = () => {
  return (
    <Layout>
      <Text css={{ width: "80%", textAlign: "center", fontSize: "1.4rem" }}>
        Welcome to Dari Wholesales. We're a small business of about 10 people.
        We have been serving eastern North Carolina for 16 years, providing
        c-stores with affordable products at wholesale prices.
      </Text>

      <Text h2>Open Account</Text>
      <Text css={{ width: "80%", textAlign: "center", fontSize: "1.4rem" }}>
        Like to open an account? We'd love to have you as a customer!
        Unfortunatly, we currently only accept customers in North Carolina. In
        order to open an account, we will need your basic information, as well
        as information about your store, including your Federal tax-id number.
        We cannot open an account for you if you do not have a Federal tax-id
        number. We also cannot open an account if you require shipments across
        state lines, due to state tax regulations.
      </Text>
    </Layout>
  );
};

export default IndexPage;
