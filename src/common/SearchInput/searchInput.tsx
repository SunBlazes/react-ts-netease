import React, {
  useState,
  ChangeEvent,
  useEffect,
  useContext,
  useCallback,
  createContext
} from "react";
import classnames from "classnames";
import useDebounce from "../../hooks/useDebounce";
import SearchContent from "../SearchContent";
import { SearchOfResultContext } from "../../pages/Home";

interface SearchInputProps {
  style?: React.CSSProperties;
  onChange?: (value: any) => void;
  className?: string;
  placeholder?: string;
  debounce?: boolean;
  value?: string;
  suffix?: boolean;
  suffixIcon?: string;
  onSearch?: () => void;
}

interface ISearchInputContext {
  changeValue: (str: string) => void;
}

export const SearchInputContext = createContext<ISearchInputContext>({
  changeValue: () => {}
});

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const {
    placeholder,
    className,
    onChange,
    style,
    debounce,
    value,
    suffixIcon,
    suffix,
    onSearch
  } = props;
  const classes = classnames("zsw-input", className);
  const [inputValue, setValue] = useState(value);
  const debouncedValue = useDebounce(inputValue);
  const [isFocused, setFocused] = useState(false);
  const context = useContext(SearchOfResultContext);

  const changeValue = useCallback((value: string) => {
    setValue(value);
  }, []);

  const passedSearchInputContext: ISearchInputContext = {
    changeValue
  };

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setValue(value);
    if (!debounce && onChange) onChange(value);
  }

  function handleSearchClick() {
    if (inputValue) {
      context.changeKeywords(inputValue);
      onSearch && onSearch();
    }
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setTimeout(() => {
      setFocused(false);
    }, 200);
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
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {suffix && (
        <i
          className={suffixIcon + " suffix-icon"}
          onClick={handleSearchClick}
        />
      )}
      <SearchInputContext.Provider value={passedSearchInputContext}>
        {isFocused && <SearchContent value={inputValue ? inputValue : ""} />}
      </SearchInputContext.Provider>
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
