import React, { useState, ChangeEvent, useEffect } from "react";
import classnames from "classnames";
import useDebounce from "../../hooks/useDebounce";

interface SearchInputProps {
  style?: React.CSSProperties;
  onChange?: (value: any) => void;
  className?: string;
  placeholder?: string;
  debounce?: boolean;
  value?: string;
  suffix?: boolean;
  suffixIcon?: string;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const {
    placeholder,
    className,
    onChange,
    style,
    debounce,
    value,
    suffixIcon,
    suffix
  } = props;
  const classes = classnames("zsw-input", className);
  const [inputValue, setValue] = useState(value);
  const debouncedValue = useDebounce(inputValue);
  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setValue(value);
    if (!debounce && onChange) onChange(value);
  }

  useEffect(() => {
    if (onChange && debounce) onChange(debouncedValue);
  }, [onChange, debouncedValue, debounce]);

  return (
    <div className={classes} style={style}>
      <input
        type="text"
        onChange={handleInput}
        placeholder={placeholder}
        value={inputValue || ""}
      />
      {suffix && <i className={suffixIcon + " suffix-icon"} />}
    </div>
  );
};

SearchInput.defaultProps = {
  debounce: true,
  suffixIcon: "iconfont icon-xianxingtubiaozhizuomoban-20",
  suffix: true
};

SearchInput.displayName = "SearchInput";

export default React.memo(SearchInput);
