import React from "react";
import SearchKeywords from "./searchKeywords";
import HotSearchContent from "./hotSearchList";

const SearchContent: React.FC<SearchContentProps> = (props) => {
  const { value } = props;

  return (
    <div className="zsw-search-content">
      {value && <SearchKeywords value={value} />}
      {!value && <HotSearchContent />}
    </div>
  );
};
export default React.memo(SearchContent);
