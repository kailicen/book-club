import PageContent from "@/components/Layout/PageContent";
import { Flex, Link, Stack, Text, textDecoration } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { Highlight } from "react-instantsearch-dom";

type Post = {
  objectID: string;
  bookId: string;
  title: string;
  body: string;
  creatorDisplayName: string;
  createdAt: Timestamp;
};

export function Hit({ hit }: { hit: Post }) {
  return (
    <PageContent>
      <>
        <Link
          href={`/${hit.bookId}/comments/${hit.objectID}`}
          _hover={{ borderColor: "gray.500", textDecoration: "none" }}
        >
          <Flex bg="gray.800" borderRadius="4px" cursor="pointer">
            <Flex direction="column" width="100%">
              <Stack spacing={1} p="10px">
                <Stack
                  direction="row"
                  spacing={0.6}
                  align="center"
                  fontSize="9pt"
                >
                  <Text
                    fontWeight={700}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {"@"}
                    <Highlight attribute="bookId" hit={hit} />
                    {" · "}
                  </Text>
                  <Text>
                    Posted by {hit.creatorDisplayName}
                    {" · "}
                    {hit.createdAt
                      ? moment(
                          new Date(hit.createdAt as unknown as string)
                        ).fromNow()
                      : ""}
                  </Text>
                </Stack>
                <Text fontSize="12pt" fontWeight={600}>
                  <Highlight attribute="title" hit={hit} />
                </Text>
                <Text fontSize="10pt">
                  <Highlight attribute="body" hit={hit} />
                </Text>
              </Stack>
            </Flex>
          </Flex>
        </Link>
      </>
      <></>
    </PageContent>
  );
}
