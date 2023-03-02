import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { Book, bookState } from "../../atoms/booksAtom";
import { firestore } from "../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import { useSetRecoilState } from "recoil";
import NotFound from "@/components/Book/NotFound";
import Header from "@/components/Book/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Book/CreatePostLink";
import About from "@/components/Book/About";
import Posts from "@/components/Posts/Posts";

type BookPageProps = {
  bookData: Book;
};

const BookPage: React.FC<BookPageProps> = ({ bookData }) => {
  console.log("here is data", bookData);
  const setBookStateValue = useSetRecoilState(bookState);

  useEffect(() => {
    setBookStateValue((prev) => ({
      ...prev,
      currentBook: bookData,
    }));
  }, [bookData]);

  if (!bookData) {
    return <NotFound />;
  }

  return (
    <>
      <Header bookData={bookData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts bookData={bookData} />
        </>
        <>
          <About bookData={bookData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get book data and pass it to client
  try {
    const bookDocRef = doc(firestore, "books", context.query.bookId as string);
    const bookDoc = await getDoc(bookDocRef);

    return {
      props: {
        bookData: bookDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: bookDoc.id, ...bookDoc.data() }))
          : "",
      },
    };
  } catch (error) {
    // Could add error page here
    console.log("getServerSideProps error", error);
  }
}

export default BookPage;
