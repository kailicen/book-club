import { IconType } from "react-icons";
import { BsBook } from "react-icons/bs";
import { atom } from "recoil";

export type BookDirectoryMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

interface BookDirectoryMenuState {
  selectedMenuItem: BookDirectoryMenuItem;
}

export const defaultMenuItem: BookDirectoryMenuItem = {
  displayText: "Choose a book",
  link: "/",
  icon: BsBook,
  iconColor: "yellow.500",
};

export const defaultMenuState: BookDirectoryMenuState = {
  selectedMenuItem: defaultMenuItem,
};

export const bookDirectoryMenuState = atom<BookDirectoryMenuState>({
  key: "bookDirectoryMenuState",
  default: defaultMenuState,
});
