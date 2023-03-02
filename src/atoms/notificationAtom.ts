import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorPhotoURL: string | null;
  bookId: string;
  postId: string;
  postCreatorId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
  read: boolean;
};

interface NotificationState {
  notification: boolean;
  comments: Comment[];
}

const defaultNotificationState: NotificationState = {
  notification: false,
  comments: [],
};

export const notificationState = atom<NotificationState>({
  key: "notificationState",
  default: defaultNotificationState,
});
