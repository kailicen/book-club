import { postState } from "@/atoms/postsAtom";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { auth } from "../../firebase/clientApp";
import { Post } from "../../atoms/postsAtom";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostStateValue = useSetRecoilState(postState);

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { bookId } = router.query;

    if (bookId) {
      // clear selectedPost in postState
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: null,
      }));
      router.push(`/${bookId}/submit`);
      return;
    }
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.700"
      bg="gray.800"
      p={2}
      mb={4}
    >
      <Icon as={VscAccount} fontSize={36} color="gray.300" mr={3} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "gray.900",
        }}
        _focus={{
          outline: "none",
          bg: "gray.700",
          border: "1px solid",
          borderColor: "yellow.500",
        }}
        bg="black"
        border="none"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
    </Flex>
  );
};
export default CreatePostLink;
