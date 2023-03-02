import { Comment } from "@/atoms/notificationAtom";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import { BiComment } from "react-icons/bi";

type NotificationsProps = {
  comments: Comment[] | undefined; // import from @/atoms/notificationAtom
};

const Notifications: React.FC<NotificationsProps> = ({ comments }) => {
  const router = useRouter();
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
            router.push(`/${item.bookId}/comments/${item.postId}`);
          }}
        >
          <Icon as={BiComment} fontSize={20} ml={2} mt={2.5} />
          <Flex direction="column" width="100%">
            <Stack spacing={1} p="10px">
              <Flex fontSize="9pt" fontWeight={800}>
                @{item.bookId}
              </Flex>
              <Stack
                direction="row"
                spacing={0.6}
                align="center"
                fontSize="9pt"
              >
                <Flex gap={1}>
                  <Text color="yellow.500">{item.creatorDisplayText}</Text>
                  {" commented on "}
                  <Text fontWeight={800}>{item.postTitle}</Text>{" "}
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
