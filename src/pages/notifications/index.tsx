import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notificationState, Comment } from "@/atoms/notificationAtom";
import PageContent from "@/components/Layout/PageContent";
import { Flex, Stack, Text } from "@chakra-ui/react";
import useBookData from "@/hooks/useBookData";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import Notifications from "@/components/Notifications/Notifications";
import { useRouter } from "next/router";

const NotificationPage: React.FC = () => {
  const [notificationStateValue, setNotificationStateValue] =
    useRecoilState(notificationState);
  const { bookStateValue } = useBookData();
  const [user, loading, error] = useAuthState(auth);
  const [unreadComments, setUnreadComments] = useState<Comment[]>([]);
  const [readComments, setReadComments] = useState<Comment[]>([]);
  const router = useRouter();

  const updateReadStatus = async () => {
    try {
      // look for "unread" comments
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("read", "==", false),
        where("postCreatorId", "==", user?.uid)
      );
      const commentDocs = await getDocs(commentsQuery);

      // Update the "read" field to true for all the documents
      const batch = writeBatch(firestore);

      commentDocs.forEach((doc) => {
        const docRef = doc.ref;
        batch.update(docRef, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.log("updateReadStatus error", error);
    }
  };

  const getReadComments = async () => {
    try {
      // look for "read" comments
      const readCommentsQuery = query(
        collection(firestore, "comments"),
        where("read", "==", true),
        where("postCreatorId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      const readCommentDocs = await getDocs(readCommentsQuery);

      const comments = readCommentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReadComments(comments as Comment[]);
    } catch (error) {
      console.log("getReadComments error", error);
    }
  };

  useEffect(() => {
    getReadComments();
    updateReadStatus();
    if (notificationStateValue.comments.length > 0) {
      setUnreadComments(notificationStateValue.comments);
    } else {
    }
  }, [user]);

  useEffect(() => {
    const handleRouteChange = () => {
      // Do something when the user leaves the page
      console.log("Leaving page");
      // empty recoil state: comments
      setNotificationStateValue((prev) => ({
        ...prev,
        comments: [],
      }));
    };

    // Add event listener for when the route changes
    router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <PageContent>
        <>
          <Stack>
            <Text color="gray.300">New comments</Text>
            {unreadComments.length > 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                pt={2}
                pb={2}
                gap={2}
              >
                <Notifications comments={unreadComments} />
              </Flex>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No New Comments
                </Text>
              </Flex>
            )}

            <Text color="gray.300">Past received comments</Text>
            <Flex
              direction="column"
              justify="center"
              align="center"
              borderTop="1px solid"
              borderColor="gray.100"
              pt={2}
              pb={2}
              gap={2}
            >
              <Notifications comments={readComments} />
            </Flex>
          </Stack>
        </>
        <></>
      </PageContent>
    </>
  );
};

export default NotificationPage;
