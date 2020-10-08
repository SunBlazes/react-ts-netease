import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import CategoryItem from "./categoryItem";

const iconclass = [
  "icon-diqiu",
  "icon-fengge",
  "icon-kafei",
  "icon-xiaolian",
  "icon-zhuti_"
];

const AllCategories: React.FC<AllCategoriesProps> = (props) => {
  const { categories, currCategory, changeCategory } = props;
  const [show, changeShow] = useState(false);

  function extendDropdown() {
    changeShow(!show);
  }

  function handleClick(category: string) {
    extendDropdown();
    changeCategory(category);
  }

  return (
    <div className="all-categories">
      <div className="all-categories-btn" onClick={extendDropdown}>
        {currCategory}
        <DownOutlined />
      </div>
      <div className={"all-categories-dropdown " + (show ? "show" : "")}>
        <div className="all-categories-dropdown-title">选择标签</div>
        <div className="all-categories-dropdown-content">
          <div>
            <div
              className={
                "all-categories-dropdown-content-top " +
                (currCategory === "全部歌单" ? "selected" : "")
              }
              onClick={() => handleClick("全部歌单")}
            >
              全部歌单
            </div>
            {categories.map((item, index) => {
              return (
                <CategoryItem
                  {...item}
                  icon={iconclass[index]}
                  key={item.categoryName}
                  onClick={handleClick}
                  currCategory={currCategory}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AllCategories);
