import React, { useState, useEffect, useContext } from "react";
import axios from "../../network";
import { SearchInputContext } from "../SearchInput";

const HotSearchContent: React.FC<HotSearchContentProps> = () => {
  const [data, setData] = useState<string[]>([]);
  const context = useContext(SearchInputContext);

  function handleItemClick(str: string) {
    context.changeValue(str);
  }

  useEffect(() => {
    let isUnmount = false;
    async function fetchData() {
      const { data } = await axios.get("/search/hot");
      const arr = data.result.hots as any[];

      !isUnmount &&
        setData(
          arr.map((item) => {
            return item.first;
          })
        );
    }
    fetchData();

    return () => {
      isUnmount = true;
    };
  }, []);

  return (
    <div className="hot-search-content">
      <div className="hot-search-content-title">热门搜索</div>
      {data.map((item) => {
        return (
          <div
            className="search-item"
            key={item}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
export default React.memo(HotSearchContent);
