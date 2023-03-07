import { Comment } from "@/atoms/notificationAtom";
import { Post, postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { query, collection, where, getDocs } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import { BiComment } from "react-icons/bi";
import { useSetRecoilState } from "recoil";

type NotificationsProps = {
  comments: Comment[]; // import from @/atoms/notificationAtom
};

const Notifications: React.FC<NotificationsProps> = ({ comments }) => {
  const setPostStateValue = useSetRecoilState(postState);
  const router = useRouter();

  const openComment = async (bookId: string, postId: string) => {
    // get posts for this book
    const postsQuery = query(
      collection(firestore, "posts"),
      where("bookId", "==", bookId),
      where("postId", "==", postId)
    );
    const postDocs = await getDocs(postsQuery);

    // Store in post state
    const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // update postState
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: posts[0] as Post,
    }));
    router.push(`/${bookId}/comments/${postId}`);
  };

  return (
    <>
      {comments?.map((item) => (
        <Flex
          key={item.id}
          bg="gray.800"
          borderRadius="4px"
          p={1}
          cursor="pointer "
          onClick={() => {
            openComment(item.bookId, item.postId);
          }}
        >
          <Icon as={BiComment} fontSize={20} ml={2} mt={2.5} />
          <Flex direction="column" width="100%">
            <Stack spacing={1} p="10px">
              <Flex fontSize="9pt" fontWeight={800}>
                @{item.bookId} · {item.postTitle}
              </Flex>
              <Stack
                direction="row"
                spacing={0.6}
                align="center"
                fontSize="9pt"
              >
                <Flex gap={1}>
                  <Text color="yellow.500">{item.creatorDisplayText}</Text>
                  {" commented · "}
                  {moment(new Date(item.createdAt?.seconds * 1000)).fromNow()}
                </Flex>
              </Stack>
              <Text fontSize="10pt">{item.text}</Text>
            </Stack>
          </Flex>
        </Flex>
      ))}
    </>
  );
};
export default Notifications;
