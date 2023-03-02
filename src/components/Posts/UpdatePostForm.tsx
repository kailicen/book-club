import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Post, postState } from "../../atoms/postsAtom";
import { useRouter } from "next/router";
import { collection, doc, runTransaction } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { useRecoilState } from "recoil";

const UpdatePostForm: React.FC = () => {
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  let [textInputs, setTextInputs] = useState({
    title: postStateValue.selectedPost?.title,
    body: postStateValue.selectedPost?.body,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleUpdatePost = async () => {
    const { bookId } = router.query;
    // update post object => type Post

    if (textInputs.title === "") {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const postsCollection = collection(firestore, "posts");
      const postId = postStateValue.selectedPost?.id;
      const postRef = doc(postsCollection, postId);

      await runTransaction(firestore, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);
        if (!postSnapshot.exists()) {
          throw new Error("Post does not exist");
        }

        transaction.update(postRef, {
          title: textInputs.title,
          body: textInputs.body,
        });
      });

      // update client recoil state
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          title: textInputs.title,
          body: textInputs.body,
        } as Post,
      }));

      // redirect the user back to the singlePost page using the router
      router.push(`/${bookId}/comments/${postId}`);
    } catch (error: any) {
      console.log("handleUpdatePost error", error.message);
      setError(true);
    }
    setLoading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" mt={2}>
      <Stack spacing={3} width="100%" p={3} bg="gray.800" borderRadius={4}>
        <Input
          name="title"
          value={textInputs.title}
          onChange={onTextChange}
          bg="gray.800"
          fontSize="10pt"
          borderRadius={4}
          borderColor="gray.700"
          _hover={{
            bg: "gray.700",
          }}
          _focus={{
            bg: "gray.700",
          }}
        />
        <Textarea
          name="body"
          value={textInputs.body}
          onChange={onTextChange}
          bg="gray.800"
          fontSize="10pt"
          borderRadius={4}
          borderColor="gray.700"
          minHeight="300px"
          _hover={{
            bg: "gray.700",
          }}
          _focus={{
            bg: "gray.700",
          }}
        />
        <Flex justify="flex-end">
          <Button
            height="34px"
            padding="0px 30px"
            disabled={!textInputs.title}
            isLoading={loading}
            onClick={handleUpdatePost}
          >
            Update
          </Button>
        </Flex>
      </Stack>
      {error && (
        <Alert status="error" bg="red.200">
          <AlertIcon />
          <Text mr={2}>Error updating post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default UpdatePostForm;
