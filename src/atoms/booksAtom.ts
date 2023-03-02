import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Book {
  id: string;
  creatorId: string;
  createdAt: Timestamp;
  numberOfMembers: number;
  imageURL?: string;
  title: string;
  author: string;
  //category: ?
}

export interface BookSnippet {
  bookId: string;
  title: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface BookState {
  mySnippets: BookSnippet[];
  currentBook?: Book;
  snippetsFetched: boolean;
}

const defaultBookState: BookState = {
  mySnippets: [],
  snippetsFetched: false,
};

export const bookState = atom<BookState>({
  key: "booksState",
  default: defaultBookState,
});
