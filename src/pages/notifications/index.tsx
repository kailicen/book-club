import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { notificationState, Comment } from "@/atoms/notificationAtom";
import PageContent from "@/components/Layout/PageContent";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { BiComment } from "react-icons/bi";
import useBookData from "@/hooks/useBookData";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import Notifications from "@/components/Notifications/Notifications";

const NotificationPage: React.FC = () => {
  const [notificationStateValue, setNotificationStateValue] =
    useRecoilState(notificationState);
  const { bookStateValue } = useBookData();
  const [user, loading, error] = useAuthState(auth);
  const [readComments, setReadComments] = useState<Comment[]>();

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
        where("postCreatorId", "==", user?.uid)
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
  }, [user]);

  return (
    <>
      <PageContent>
        <>
          <Stack>
            <Text color="gray.300">New comments</Text>
            {Object.keys(notificationStateValue.comments).length > 0 ? (
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
                <Notifications comments={notificationStateValue.comments} />
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
