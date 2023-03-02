import {
  Box,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
//import useDirectory from "../../../hooks/useDirectory";

type CreateBookModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateBookModal: React.FC<CreateBookModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  let [title, setTitle] = useState("");
  let [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const resetInputFields = () => {
    setTitle("");
    setAuthor("");
  };

  const handleCreateBook = async () => {
    if (error) setError("");

    // Validate the book title
    const titleFormat = /^[a-zA-Z0-9][a-zA-Z0-9\s:'’-]*[a-zA-Z0-9]$/;

    if (!titleFormat.test(title)) {
      setError(
        "Book titles can only contain letters, numbers, spaces, colons, apostrophes, hyphens, and must begin and end with a letter or number"
      );
      return;
    }

    setLoading(true);
    try {
      const bookDocRef = doc(firestore, "books", title);
      await runTransaction(firestore, async (transaction) => {
        // Check if a book title exists in db
        const bookDoc = await transaction.get(bookDocRef);
        if (bookDoc.exists()) {
          throw new Error(`Sorry, ${title} is taken. Try another.`);
        }

        // Create book
        transaction.set(bookDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          title: title,
          author: author,
        });

        // create bookSnippet on user
        transaction.set(
          doc(firestore, `users/${user?.uid}/bookSnippets`, title),
          {
            bookId: title,
            title: title,
            isModerator: true,
          }
        );
      });

      handleClose();

      router.push(`/${title}`);
      resetInputFields();
    } catch (error: any) {
      console.log("handleCreateBook error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a book community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Input
                required
                value={title}
                onChange={handleTitleChange}
                variant="filled"
                mb={3}
                placeholder="Enter a book title"
              />
              <Input
                required
                value={author}
                onChange={handleAuthorChange}
                variant="filled"
                mb={3}
                placeholder="Enter the author"
              />
            </ModalBody>
            <Text fontSize="9pt" color="red" pt={1}>
              {error}
            </Text>
          </Box>

          <ModalFooter borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateBook}
              isLoading={loading}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateBookModal;
