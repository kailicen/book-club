import useBookData from "@/hooks/useBookData";
import algoliasearch from "algoliasearch/lite";
import { useRouter } from "next/router";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import { Hit } from "./Results";

const searchClient = algoliasearch(
  "9BUVJOAJFP",
  "d1d89f97c8f1d8935deb94920144a4d2"
);

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
