import React from "react";

const CategoryItem: React.FC<CategoryItemProps> = (props) => {
  const { icon, categoryName, arr, onClick, currCategory } = props;

  return (
    <div className="all-categories-dropdown-content-item">
      <div className="all-categories-dropdown-content-item-left">
        <div>
          <i className={"iconfont " + icon}></i>
          <span>{categoryName}</span>
        </div>
      </div>
      <div className="all-categories-dropdown-content-item-right">
        <div>
          {arr.map((item) => {
            return (
              <div
                className={
                  "all-categories-dropdown-content-item-right-item " +
                  (currCategory === item.name ? "selected" : "")
                }
                key={item.name}
                onClick={() => onClick(item.name)}
              >
                {item.name}
                {item.hot && (
                  <span className="all-categories-dropdown-content-item-right-item-hot">
                    HOT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoryItem);
