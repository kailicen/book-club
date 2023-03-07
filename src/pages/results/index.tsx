import useBookData from "@/hooks/useBookData";
import algoliasearch from "algoliasearch/lite";
import { useRouter } from "next/router";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import PageContent from "@/components/Layout/PageContent";
import { Flex, Link, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { Highlight } from "react-instantsearch-dom";

const searchClient = algoliasearch(
  "9BUVJOAJFP",
  "d1d89f97c8f1d8935deb94920144a4d2"
);

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

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const query = router.query.q;
  const { bookStateValue } = useBookData();

  return (
    <>
      <InstantSearch
        indexName="posts"
        searchClient={searchClient}
        searchState={{ query }}
      >
        <SearchBox />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </>
  );
};

export default ResultsPage;
