import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Book, BookSnippet, bookState } from "../atoms/booksAtom";
import { auth, firestore } from "../firebase/clientApp";

const useBookData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [bookStateValue, setBookStateValue] = useRecoilState(bookState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveBook = (bookData: Book, isJoined: boolean) => {
    // is the user signed in?
    // if not => open auth modal
    if (!user) {
      // open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveBook(bookData.id);
      return;
    }
    joinBook(bookData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      // get users snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/bookSnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setBookStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as BookSnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinBook = async (bookData: Book) => {
    try {
      const batch = writeBatch(firestore);

      // creating a new book snippet
      const newSnippet: BookSnippet = {
        bookId: bookData.id,
        title: bookData.id,
        imageURL: bookData.imageURL || "",
        isModerator: user?.uid === bookData.creatorId,
      };
      batch.set(
        doc(firestore, `users/${user?.uid}/bookSnippets`, bookData.id),
        newSnippet
      );

      batch.update(doc(firestore, "books", bookData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state - bookState.mySnippets
      setBookStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinBook error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveBook = async (bookId: string) => {
    // batch write
    try {
      const batch = writeBatch(firestore);

      // deleting the book snippet from user
      batch.delete(doc(firestore, `users/${user?.uid}/bookSnippets`, bookId));

      // updating the numberOfMembers (-1)
      batch.update(doc(firestore, "books", bookId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update recoil state - bookState.mySnippets
      setBookStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((item) => item.bookId !== bookId),
      }));
    } catch (error: any) {
      console.log("leaveBook error", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  const getBookData = async (bookId: string) => {
    try {
      const bookDocRef = doc(firestore, "books", bookId);
      const bookDoc = await getDoc(bookDocRef);

      setBookStateValue((prev) => ({
        ...prev,
        currentBook: {
          id: bookDoc.id,
          ...bookDoc.data(),
        } as Book,
      }));
    } catch (error) {
      console.log("getBookData", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setBookStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user, bookStateValue.currentBook]);

  useEffect(() => {
    const { bookId } = router.query;

    if (bookId && !bookStateValue.currentBook) {
      getBookData(bookId as string);
    }
  }, [router.query, bookStateValue.currentBook]);

  return {
    // data and functions
    bookStateValue,
    onJoinOrLeaveBook,
    loading,
  };
};
export default useBookData;
