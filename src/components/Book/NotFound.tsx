import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const BookNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, the page does not exist or has been banned
      <Link href="/">
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  );
};
export default BookNotFound;
