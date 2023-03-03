import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import CreateBookModal from "@/components/Modal/CreateBook/CreateBookModal";
import { User } from "firebase/auth";
import BookDirectory from "./BookDirectory/BookDirectory";
import { useRecoilState } from "recoil";
import { notificationState, Comment } from "@/atoms/notificationAtom";
import { getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useRouter } from "next/router";

type IconsProps = {
  user?: User | null;
};

const Icons: React.FC<IconsProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [notificationStateValue, setNotificationStateValue] =
    useRecoilState(notificationState);
  const [comments, setComments] = useState<Comment[]>();
  const router = useRouter();

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("read", "==", false),
        where("postCreatorId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
      console.log(`comments: ${comments.map((c) => c.id)}`);

      // set notification state to true, and comments to unreadComments when getting date from database
      if (Object.keys(comments).length > 0) {
        setNotificationStateValue({
          notification: true,
          comments: comments as Comment[],
        });
      }
    } catch (error) {
      console.log("getPostComments error", error);
    }
  };

  const handleNotifications = () => {
    // set notification state to false when clicked the notification button
    setNotificationStateValue((prev) => ({
      ...prev,
      notification: false,
    }));
    router.push("/notifications");
  };

  useEffect(() => {
    getPostComments();
  }, [user]);

  return (
    <Flex align="center">
      <CreateBookModal open={open} handleClose={() => setOpen(false)} />
      {user && <BookDirectory />}
      <Flex position="relative">
        <Flex
          mr={1}
          ml={1}
          padding={2}
          borderRadius={20}
          bg="gray.800"
          _hover={{ bg: "gray.700" }}
          cursor="pointer"
          onClick={handleNotifications}
        >
          <Icon as={IoNotificationsOutline} fontSize={22} />
        </Flex>
        {notificationStateValue.notification && (
          <Box
            position="absolute"
            top="0px"
            right="0px"
            width={4}
            height={4}
            borderRadius="full"
            bg="red.500"
          />
        )}
      </Flex>
    </Flex>
  );
};
export default Icons;
