import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { bookState } from "../atoms/booksAtom";
import { Post, postState } from "../atoms/postsAtom";
import { auth, firestore } from "../firebase/clientApp";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentBook = useRecoilValue(bookState).currentBook;

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/${post.bookId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // delete post document from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!user || !currentBook?.id) return;
  }, [user, currentBook]);

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
