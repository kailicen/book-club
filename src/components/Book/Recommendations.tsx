import { Book } from "@/atoms/booksAtom";
import useBookData from "@/hooks/useBookData";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBookHalf } from "react-icons/bs";
import { firestore } from "../../firebase/clientApp";

const Recommendations: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { bookStateValue, onJoinOrLeaveBook } = useBookData();
  const [isHidden, setIsHidden] = useState(false);

  const getBookRecommendations = async () => {
    setLoading(true);
    try {
      const bookQuery = query(
        collection(firestore, "books"),
        orderBy("numberOfMembers", "desc"),
        limit(5) // set limit
      );
      const bookDocs = await getDocs(bookQuery);
      const books = bookDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(books as Book[]);
      setIsHidden(false);
    } catch (error) {
      console.log("getBookRecommendations error", error);
    }
    setLoading(false);
  };

  const getAllBooks = async () => {
    setLoading(true);
    try {
      const bookQuery = query(
        collection(firestore, "books"),
        orderBy("numberOfMembers", "desc")
      );
      const bookDocs = await getDocs(bookQuery);
      const books = bookDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(books as Book[]);

      setIsHidden(true);
    } catch (error) {
      console.log("getAllBooks error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBookRecommendations();
  }, []);

  return (
    <Flex direction="column" bg="gray.800" borderRadius={4}>
      <Flex
        justify="space-between"
        align="center"
        bg="yellow.500"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          Top Book Communities
        </Text>
      </Flex>

      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <Skeleton height="40px" width="12%" />
              <Skeleton height="20px" width="80%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <Skeleton height="40px" width="12%" />
              <Skeleton height="20px" width="80%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <Skeleton height="40px" width="12%" />
              <Skeleton height="20px" width="80%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <Skeleton height="40px" width="12%" />
              <Skeleton height="20px" width="80%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <Skeleton height="40px" width="12%" />
              <Skeleton height="20px" width="80%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {books.map((item, index) => {
              const isJoined = !!bookStateValue.mySnippets.find(
                (snippet) => snippet.bookId === item.id
              );
              return (
                <Link key={item.id} href={`/${item.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    borderBottom="1px solid"
                    borderColor="gray.700"
                    p="10px"
                    fontSize="9pt"
                    color="white"
                  >
                    <Flex width="80%" align="center">
                      <Flex width="10%">
                        <Text>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="85%">
                        {item.imageURL ? (
                          <Image
                            width="28px"
                            src={item.imageURL}
                            alt="image"
                            borderRadius="sm"
                            mr={2}
                          />
                        ) : (
                          <Icon
                            as={BsBookHalf}
                            fontSize={30}
                            color="yellow.500"
                            mr={2}
                          />
                        )}
                        <Text>{`@${item.id}`}</Text>
                      </Flex>
                    </Flex>
                    <Box
                      position="absolute"
                      right="10px"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        height="22px"
                        width="60px"
                        fontSize="8pt"
                        variant={isJoined ? "outline" : "solid"}
                        onClick={(event) => {
                          event.preventDefault();
                          onJoinOrLeaveBook(item, isJoined);
                        }}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p="10px 20px">
              {isHidden ? (
                <Button
                  height="30px"
                  width="100%"
                  onClick={getBookRecommendations}
                >
                  View Less
                </Button>
              ) : (
                <Button height="30px" width="100%" onClick={getAllBooks}>
                  View All
                </Button>
              )}
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
