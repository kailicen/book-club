import useBookDirectory from "@/hooks/useBookDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Books from "./Books";

const BookDirectory: React.FC = () => {
  const { bookDirectoryState } = useBookDirectory();

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        bg="gray.800"
        borderRadius="full"
        height="34px"
        mt={0.5}
        mr={3}
        fontSize="10pt"
        _hover={{
          bg: "gray.700",
        }}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "300px" }}
        >
          <Flex align="center">
            {bookDirectoryState.selectedMenuItem.imageURL ? (
              <Image
                src={bookDirectoryState.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                ml={1.5}
                mr={1.5}
                alt="menu icon"
              />
            ) : (
              <Icon
                fontSize={24}
                mr={3}
                ml={3}
                as={bookDirectoryState.selectedMenuItem.icon}
                color={bookDirectoryState.selectedMenuItem.iconColor}
              />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontSize="10pt" lineHeight={1}>
                {bookDirectoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon mr={3} />
        </Flex>
      </MenuButton>
      <MenuList bg="gray.800" border="none">
        <Books />
      </MenuList>
    </Menu>
  );
};
export default BookDirectory;
