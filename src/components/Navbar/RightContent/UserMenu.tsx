import React, { useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Image,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "../../../firebase/clientApp";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { profilePicState } from "@/atoms/profilePicAtom";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const profilePicStateValue = useRecoilValue(profilePicState);

  const logout = async () => {
    await signOut(auth);
    router.push("/");
    // clear community state
  };

  useEffect(() => {
    console.log(profilePicStateValue);
  }, []);

  return (
    <Menu>
      <MenuButton>
        <Flex ml={1} padding={2} cursor="pointer">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="user icon"
              boxSize="35px"
              objectFit="cover"
              borderRadius="full"
            />
          ) : (
            <Icon as={VscAccount} fontSize={20} />
          )}
        </Flex>
      </MenuButton>
      <MenuList bg="gray.800" border="none">
        <MenuItem
          bg="gray.800"
          fontSize="10pt"
          _hover={{ bg: "gray.700", color: "white" }}
          onClick={() => router.push(`/u/${user?.uid}`)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={CgProfile} />
            Profile
          </Flex>
        </MenuItem>
        <MenuDivider borderColor="gray.400" />
        <MenuItem
          bg="gray.800"
          fontSize="10pt"
          _hover={{ bg: "gray.700", color: "white" }}
          onClick={logout}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
            Log Out
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
