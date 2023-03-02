import { bookState } from "@/atoms/booksAtom";
import { postState } from "@/atoms/postsAtom";
import About from "@/components/Book/About";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import UpdatePostForm from "@/components/Posts/UpdatePostForm";
import { auth } from "@/firebase/clientApp";
import useBookData from "@/hooks/useBookData";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const bookStateValue = useRecoilValue(bookState);
  const postStateValue = useRecoilValue(postState);
  console.log("SubmitPostPage - POSTSTATEVALUE", postStateValue);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost?.id ? (
          <>
            <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
              <Text>Update a post</Text>
            </Box>
            {user && <UpdatePostForm />}
          </>
        ) : (
          <>
            <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
              <Text>Create a post</Text>
            </Box>
            {user && (
              <NewPostForm
                user={user}
                bookImageURL={bookStateValue.currentBook?.imageURL}
              />
            )}
          </>
        )}
      </>
      <>
        {bookStateValue.currentBook && (
          <About bookData={bookStateValue.currentBook} />
        )}
      </>
    </PageContent>
  );
};
export default SubmitPostPage;
