import {
  Alert,
  AlertIcon,
  Box,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Book, bookState } from "../../atoms/booksAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import { BsBookHalf } from "react-icons/bs";

type AboutProps = {
  bookData: Book;
};

const About: React.FC<AboutProps> = ({ bookData }) => {
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setBookStateValue = useSetRecoilState(bookState);
  const [editingBookId, setEditingBookId] = useState<string>("");
  const [deletingBookId, setDeletingBookId] = useState<string>("");
  let [textInputs, setTextInputs] = useState({
    title: bookData.title,
    author: bookData.author,
  });
  const [updatedBook, setUpdatedBook] = useState({
    title: "",
    author: "",
  });
  const router = useRouter();
  const [error, setError] = useState("");

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `books/${bookData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "books", bookData.id), {
        imageURL: downloadURL,
      });
      await updateDoc(
        doc(firestore, `users/${user?.uid}/bookSnippets`, bookData.title),
        {
          imageURL: downloadURL,
        }
      );

      setBookStateValue((prev) => ({
        ...prev,
        currentBook: {
          ...prev.currentBook,
          imageURL: downloadURL,
        } as Book,
      }));
    } catch (error) {
      console.log("onUpdateImage error", error);
    }
    setUploadingImage(false);
  };

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onUpdateBook = async () => {
    if (textInputs.title === "" || textInputs.author === "") {
      setError("Title/author cannot be empty. ");
      return;
    }

    setError("");
    try {
      setUpdatedBook({ title: textInputs.title, author: textInputs.author });

      await updateDoc(doc(firestore, "books", bookData.id), {
        title: textInputs.title,
        author: textInputs.author,
      });
      await updateDoc(
        doc(firestore, `users/${user?.uid}/bookSnippets`, bookData.id),
        {
          title: textInputs.title,
        }
      );

      setBookStateValue((prev) => ({
        ...prev,
        currentBook: {
          ...prev.currentBook,
          title: textInputs.title,
          author: textInputs.author,
        } as Book,
      }));
      setEditingBookId("");
    } catch (error) {
      console.log("onUpdateBook error", error);
    }
  };

  const onDeleteBook = async (bookId: string) => {
    try {
      const batch = writeBatch(firestore);

      // delete book document
      const bookDocRef = doc(firestore, "books", bookId);
      batch.delete(bookDocRef);

      // delete user book snippet
      const bookSnippetDocRef = doc(
        firestore,
        `users/${user?.uid}/bookSnippets`,
        bookId
      );
      batch.delete(bookSnippetDocRef);

      await batch.commit();

      router.push("/");
    } catch (error) {
      console.log("onDeleteBook error", error);
    }
  };

  useEffect(() => {
    console.log(`about page: ${bookData}`);
  }, [bookData]);

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="yellow.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Group
        </Text>
      </Flex>
      <Flex
        direction="column"
        p={3}
        bg="gray.800"
        borderRadius="0px 0px 4px 4px"
      >
        <Stack>
          <Flex direction="column" width="100%" p={2} fontSize="10pt" gap={3}>
            {editingBookId === bookData.id ? (
              <>
                <Input
                  name="title"
                  value={textInputs.title}
                  onChange={onTextChange}
                  variant="filled"
                ></Input>
                <Input
                  name="author"
                  value={textInputs.author}
                  onChange={onTextChange}
                  variant="filled"
                ></Input>
                {error && (
                  <Alert status="error" bg="red.200">
                    <AlertIcon />
                    <Text mr={2}>{error}</Text>
                  </Alert>
                )}
              </>
            ) : (
              <>
                {updatedBook.title !== "" ? (
                  <>
                    <Link href={`/${bookData.id}`}>
                      <Text
                        fontWeight={700}
                        color="white"
                        _hover={{ textDecoration: "underline" }}
                      >
                        {updatedBook.title}
                      </Text>
                    </Link>

                    <Text fontWeight={500}>by {updatedBook.author}</Text>
                  </>
                ) : (
                  <>
                    <Link href={`/${bookData.id}`}>
                      <Text
                        fontWeight={700}
                        color="white"
                        _hover={{ textDecoration: "underline" }}
                      >
                        {bookData.title}
                      </Text>
                    </Link>

                    <Text fontWeight={500}>by {bookData.author}</Text>
                  </>
                )}
              </>
            )}

            {user?.uid === bookData.creatorId && (
              <>
                {editingBookId === bookData.id ? (
                  <Text
                    color="yellow.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={onUpdateBook}
                  >
                    Save Changes
                  </Text>
                ) : (
                  <>
                    {deletingBookId !== bookData.id && (
                      <Flex gap={2}>
                        <Text
                          color="yellow.500"
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                          onClick={() => {
                            setEditingBookId(bookData.id);
                          }}
                        >
                          Edit
                        </Text>
                        <Text
                          color="yellow.500"
                          cursor="pointer"
                          _hover={{ textDecoration: "underline" }}
                          onClick={() => {
                            setDeletingBookId(bookData.id);
                          }}
                        >
                          Delete
                        </Text>
                      </Flex>
                    )}
                  </>
                )}
                {deletingBookId === bookData.id && (
                  <Flex gap={2}>
                    <Text
                      color="yellow.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => {
                        setDeletingBookId("");
                      }}
                    >
                      Cancel
                    </Text>
                    <Text
                      color="yellow.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => {
                        onDeleteBook(bookData.id);
                      }}
                    >
                      Confirm to Delete
                    </Text>
                  </Flex>
                )}
              </>
            )}
          </Flex>
          <Flex align="right" width="100%" p={2} fontSize="9pt">
            {bookData.createdAt && (
              <Text>
                Group since{" "}
                {moment(new Date(bookData.createdAt.seconds * 1000)).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            )}
          </Flex>
          {user?.uid === bookData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt" p={2}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="yellow.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {bookData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || bookData.imageURL}
                      objectFit="cover"
                      borderRadius="full"
                      boxSize="40px"
                      alt="Book Image"
                    />
                  ) : (
                    <Icon
                      as={BsBookHalf}
                      fontSize={20}
                      color="yellow.500"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={onUpdateImage}
                    >
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
