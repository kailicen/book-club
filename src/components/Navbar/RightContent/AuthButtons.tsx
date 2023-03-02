import { Button, Icon } from "@chakra-ui/react";
import { BiUserCircle } from "react-icons/bi";
import React from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";

const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height={{ base: "30px", md: "35px" }}
        display="flex"
        width={{ base: "90px", md: "100px" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        <Icon
          as={BiUserCircle}
          fontSize={{ base: "20px", md: "25px" }}
          fontWeight={1}
          mr={1.5}
        />
        Log In
      </Button>
    </>
  );
};
export default AuthButtons;
