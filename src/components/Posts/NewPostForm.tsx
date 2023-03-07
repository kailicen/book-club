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
import { Post } from "../../atoms/postsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

type NewPostFormProps = {
  user: User;
  bookImageURL?: string;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user, bookImageURL }) => {
  const router = useRouter();
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePost = async () => {
    const { bookId } = router.query;
    // create new post object => type Post

    if (textInputs.title === "") {
      setError("Title cannot be empty. ");
      return;
    }
    setError("");
    const newPost: Post = {
      bookId: bookId as string,
      bookImageURL: bookImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setLoading(true);
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      // redirect the user back to the communityPage using the router
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(error.message);
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
          required
          name="title"
          value={textInputs.title}
          onChange={onTextChange}
          bg="gray.800"
          fontSize="10pt"
          borderRadius={4}
          borderColor="gray.700"
          placeholder="Title"
          _placeholder={{ color: "gray.500" }}
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
          placeholder="Text (optional)"
          _placeholder={{ color: "gray.500" }}
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
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Flex>
      </Stack>
      {error && (
        <Alert status="error" bg="red.200">
          <AlertIcon />
          <Text mr={2}>{error}</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
