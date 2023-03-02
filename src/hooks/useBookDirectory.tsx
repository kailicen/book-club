import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsBook } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { bookState } from "../atoms/booksAtom";
import {
  defaultMenuItem,
  BookDirectoryMenuItem,
  bookDirectoryMenuState,
} from "../atoms/bookDirectoryMenuAtom";

const useBookDirectory = () => {
  const [bookDirectoryState, setBookDirectoryState] = useRecoilState(
    bookDirectoryMenuState
  );
  const router = useRouter();
  const [bookStateValue, setBookStateValue] = useRecoilState(bookState);

  const onSelectMenuItem = (menuItem: BookDirectoryMenuItem) => {
    setBookDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
  };

  useEffect(() => {
    const { currentBook } = bookStateValue;

    if (currentBook) {
      setBookDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: currentBook.title,
          link: `/${currentBook.id}`,
          imageURL: currentBook.imageURL,
          icon: BsBook,
          iconColor: "yellow.500",
        },
      }));
      return;
    }
    setBookDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [bookStateValue.currentBook]);

  useEffect(() => {
    const { bookId } = router.query;

    if (!bookId) {
      setBookStateValue((prev) => ({
        ...prev,
        currentBook: undefined,
      }));
    }
  }, [router.query]);

  return { bookDirectoryState, onSelectMenuItem };
};
export default useBookDirectory;
