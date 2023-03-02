import React, { useEffect, useRef, useState } from "react";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import NotFound from "@/components/Book/NotFound";
import PageContent from "@/components/Layout/PageContent";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import usePosts from "@/hooks/usePosts";
import { Post } from "@/atoms/postsAtom";
import PostLoader from "@/components/Posts/PostLoader";
import {
  Box,
  Flex,
  Stack,
  Image,
  Text,
  Icon,
  Spinner,
  ListItem,
  List,
  Divider,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import PostItem from "@/components/Posts/PostItem";
import { FaUser } from "react-icons/fa";
import { BsBook, BsBookHalf, BsCamera } from "react-icons/bs";
import useSelectFile from "@/hooks/useSelectFile";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateProfile, User } from "firebase/auth";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import { useRecoilState, useRecoilValue } from "recoil";
import { profilePicState } from "@/atoms/profilePicAtom";
import { Book, bookState } from "@/atoms/booksAtom";
import useBookData from "@/hooks/useBookData";
import { useRouter } from "next/router";

type BookPageProps = {
  user: User;
};

const UserProfilePage: React.FC<BookPageProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { postStateValue, setPostStateValue, onDeletePost, onSelectPost } =
    usePosts();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePicStateValue, setProfilePicStateValue] =
    useRecoilState(profilePicState);
  const { bookStateValue } = useBookData();
  const router = useRouter();
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [books, setBooks] = useState<Book[]>();

  const getUserPosts = async () => {
    try {
      setLoading(true);
      // get posts
      const postsQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      // Store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getUserPosts error", error.message);
    }
    setLoading(false);
  };

  const getMemberNumbers = async () => {
    try {
      setLoadingBooks(true);
      // get books
      const booksQuery = query(
        collection(firestore, "books"),
        where("creatorId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      const bookDocs = await getDocs(booksQuery);

      // Store in book state
      const books = bookDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];

      setBooks(books);
    } catch (error: any) {
      console.log("getMemberNumbers error", error.message);
    }
    setLoadingBooks(false);
  };

  const onUpdateImage = async () => {
    const user: User | null = auth.currentUser;

    if (!selectedFile) return;
    setUploadingImage(true);
    if (user) {
      try {
        const imageRef = ref(storage, `users/${user.uid}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // Update the user's photoURL in Firebase Authentication
        await updateProfile(user, {
          photoURL: downloadURL,
        });

        // Update users in firebase database
        await updateDoc(doc(firestore, `users`, user.uid), {
          photoURL: downloadURL,
        });
        // Update comment photoURL
        const commentsQuery = query(
          collection(firestore, "comments"),
          where("creatorId", "==", user.uid)
        );

        const commentsSnapshot = await getDocs(commentsQuery);

        const batch = writeBatch(firestore);

        commentsSnapshot.forEach((doc) => {
          const commentRef = doc.ref;
          batch.update(commentRef, { creatorPhotoURL: downloadURL });
        });

        await batch.commit();

        // Update recoil state
        setProfilePicStateValue({ url: downloadURL });
      } catch (error) {
        console.log("onUpdateImage error", error);
      }
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    getUserPosts();
    getMemberNumbers();
  }, [user]);

  // use book not found page
  if (!user) {
    return <NotFound />;
  }

  return (
    <>
      <PageContent>
        <>
          {/* left session: user posts */}
          {loading ? (
            <PostLoader />
          ) : (
            <Stack>
              {postStateValue.posts.map((item) => (
                <PostItem
                  key={item.id}
                  post={item}
                  userIsCreator={user?.uid === item.creatorId}
                  onSelectPost={onSelectPost}
                  onDeletePost={onDeletePost}
                  homePage // display the book community
                />
              ))}
            </Stack>
          )}
        </>
        <>
          {/* right session: user info */}
          <Box position="sticky" top="14px">
            <Flex
              justify="flex-start"
              align="center"
              bg="yellow.500"
              color="white"
              borderRadius="4px 4px 0px 0px"
            >
              {user.photoURL ? (
                <Image
                  src={selectedFile ?? user.photoURL}
                  alt="user pic"
                  boxSize="90px"
                  objectFit="cover"
                  position="relative"
                  top={6}
                  left={4}
                  borderRadius={4}
                  border="4px solid"
                  borderColor="gray.800"
                />
              ) : (
                <>
                  {selectedFile ? (
                    <Image
                      src={selectedFile}
                      alt="user pic"
                      boxSize="90px"
                      objectFit="cover"
                      position="relative"
                      top={6}
                      left={4}
                      borderRadius={4}
                      border="4px solid"
                      borderColor="gray.800"
                    />
                  ) : (
                    <Flex
                      boxSize="85px"
                      position="relative"
                      top={6}
                      left={4}
                      align="center"
                      justify="center"
                      borderRadius={4}
                      border="4px solid"
                      borderColor="gray.800"
                      bg="gray.500"
                    >
                      <Icon as={FaUser} fontSize={50} color="white" />
                    </Flex>
                  )}
                </>
              )}
              <Flex
                bg="gray.900"
                position="relative"
                top={12}
                left={-5}
                borderRadius="full"
                border="1px solid gray"
                p={1.5}
                cursor="pointer"
                onClick={() => selectedFileRef.current?.click()}
              >
                <Icon as={BsCamera} fontSize={25} color="gray.100" />
              </Flex>
            </Flex>
            <Flex
              direction="column"
              p="30px 20px"
              bg="gray.800"
              borderRadius="0px 0px 4px 4px"
            >
              {selectedFile &&
                (uploadingImage ? (
                  <Spinner />
                ) : (
                  <Text
                    cursor="pointer"
                    fontSize="9pt"
                    color="yellow.500"
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
              <Stack fontSize="10pt">
                <Text>/{user.email?.split("@")[0]}</Text>
                <Divider />
                <Text color="gray.300">Moderating</Text>
                <List spacing={3} fontSize="9pt">
                  {loadingBooks ? (
                    <Stack mt={2} p={3}>
                      <Flex justify="space-between" align="center">
                        <Skeleton height="40px" width="12%" />
                        <Skeleton height="20px" width="80%" />
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Skeleton height="40px" width="12%" />
                        <Skeleton height="20px" width="80%" />
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Skeleton height="40px" width="12%" />
                        <Skeleton height="20px" width="80%" />
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Skeleton height="40px" width="12%" />
                        <Skeleton height="20px" width="80%" />
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Skeleton height="40px" width="12%" />
                        <Skeleton height="20px" width="80%" />
                      </Flex>
                    </Stack>
                  ) : (
                    <>
                      {bookStateValue.mySnippets
                        .filter((s) => s.isModerator)
                        .map((s) => (
                          <ListItem key={s.bookId} height="50px">
                            <Flex align="center">
                              {s.imageURL ? (
                                <Image
                                  width="28px"
                                  src={s.imageURL}
                                  alt="image"
                                  borderRadius="sm"
                                  mr={2}
                                />
                              ) : (
                                <Icon
                                  as={BsBookHalf}
                                  fontSize={30}
                                  color="yellow.500"
                                  mr={2}
                                />
                              )}
                              <Flex direction="column">
                                <Text
                                  cursor="pointer"
                                  _hover={{ textDecoration: "underline" }}
                                  onClick={() => router.push(`/${s.bookId}`)}
                                >
                                  {s.title}
                                </Text>
                                <Text>
                                  {books
                                    ?.filter((b) => b.id === s.bookId)
                                    .map((b) => b.numberOfMembers)}{" "}
                                  member
                                </Text>
                              </Flex>
                            </Flex>
                          </ListItem>
                        ))}
                    </>
                  )}
                </List>
              </Stack>
            </Flex>
          </Box>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get user data and pass it to client
  try {
    const bookDocRef = doc(firestore, "users", context.query.uid as string);
    const bookDoc = await getDoc(bookDocRef);

    return {
      props: {
        user: bookDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: bookDoc.id, ...bookDoc.data() }))
          : "",
      },
    };
  } catch (error) {
    // Could add error page here
    console.log("getServerSideProps error", error);
  }
}

export default UserProfilePage;
