import { auth } from "@/firebase/clientApp";
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex
      height="50px"
      padding="6px 15px"
      justify="space-between"
      align="center"
    >
      <Link href="/" _hover={{ textDecoration: "none" }}>
        <Flex
          align="center"
          width={{ base: "34px", md: "auto" }}
          mr={3}
          cursor="pointer"
          color="yellow.400"
        >
          <Image src="/images/logo192-wisingup.png" height="30px" alt="logo" />
          <Text fontSize="17px" display={{ base: "none", md: "block" }}>
            Book Clubs
          </Text>
        </Flex>
      </Link>

      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
