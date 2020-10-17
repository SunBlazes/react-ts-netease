import React, { useRef } from "react";
import { PaginationProps } from "antd/es/pagination";
import { Pagination } from "antd";

interface ResultOfPaginationProps {
  handlePageSizeChange: (page: number) => void;
  attrs: PaginationProps;
  defaultPageSize: number;
}

const ResultOfPagination: React.FC<ResultOfPaginationProps> = (props) => {
  const { handlePageSizeChange, attrs, defaultPageSize } = props;

  const defaultPagination = useRef<PaginationProps>({
    defaultCurrent: 1,
    defaultPageSize: defaultPageSize,
    hideOnSinglePage: true,
    size: "small",
    showSizeChanger: false,
    onChange: handlePageSizeChange
  });

  return (
    <div className="result-of-pagination">
      <Pagination {...defaultPagination.current} {...attrs} />
    </div>
  );
};

export default React.memo(ResultOfPagination);
