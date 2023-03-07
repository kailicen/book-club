import { postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import {
  Button,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  Textarea,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { useSetRecoilState } from "recoil";

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

type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  userId,
}) => {
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [updatedComment, setUpdatedComment] = useState<Comment>();
  const setPostState = useSetRecoilState(postState);
  const [error, setError] = useState("");

  const onUpdateComment = async (comment: Comment) => {
    if (commentText === "") {
      setError("Text cannot be empty. ");
      return;
    }
    try {
      setError("");
      const batch = writeBatch(firestore);

      // update comment document
      setUpdatedComment({ ...comment, text: commentText });
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.update(commentDocRef, { text: commentText });

      await batch.commit();

      // update notification state
      setPostState((prev) => ({
        ...prev,
        notification: "edit",
      }));

      setEditingCommentId("");
    } catch (error) {
      console.log("onUpdateComment error", error);
    }
  };

  return (
    <Flex>
      <Flex mr={2}>
        {comment.creatorPhotoURL ? (
          <Image
            src={comment.creatorPhotoURL}
            alt="user pic"
            objectFit="cover"
            borderRadius="full"
            boxSize="32px"
          />
        ) : (
          <Icon as={VscAccount} fontSize={30} color="gray.300" />
        )}
      </Flex>
      <Stack spacing={1} width="90%">
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontWeight={700}>{comment.creatorDisplayText}</Text>
          <Text color="gray.600">
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>

        {editingCommentId === comment.id ? (
          <Stack direction="column" width="100%">
            <Textarea
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fontSize="10pt"
              width="100%"
            />
            <Flex gap={2}>
              <Button
                variant="outline"
                height="26px"
                width="100px"
                disabled={!commentText.length}
                onClick={() => {
                  setEditingCommentId("");
                }}
              >
                Cancel
              </Button>
              <Button
                height="26px"
                width="100px"
                disabled={!commentText.length}
                onClick={() => {
                  onUpdateComment(comment);
                }}
              >
                Update
              </Button>
            </Flex>
            {error && (
              <Alert status="error" bg="red.200">
                <AlertIcon />
                <Text mr={2}>{error}</Text>
              </Alert>
            )}
          </Stack>
        ) : (
          <>
            {updatedComment ? (
              <Text fontSize="10pt">{updatedComment.text}</Text>
            ) : (
              <Text fontSize="10pt">{comment.text}</Text>
            )}
          </>
        )}

        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          {userId === comment.creatorId && (
            <>
              {editingCommentId !== comment.id && (
                <>
                  <Text
                    fontSize="9pt"
                    _hover={{ color: "yellow.500" }}
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setCommentText(comment.text);
                    }}
                  >
                    Edit
                  </Text>
                  <Text
                    fontSize="9pt"
                    _hover={{ color: "yellow.500" }}
                    onClick={() => onDeleteComment(comment)}
                  >
                    Delete
                  </Text>
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default CommentItem;
