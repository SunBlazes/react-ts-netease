interface ICategoryItem {
  name: string;
  category: number;
  hot: boolean;
}

type CategoryType = Array<{
  categoryName: string;
  arr: Array<ICategoryItem>;
}>;

interface AllCategoriesProps {
  categories: CategoryType;
  currCategory: string;
  changeCategory: (category: string) => void;
  show: boolean;
  changeShow: (flag: boolean) => void;
}

interface CategoryItemProps {
  categoryName: string;
  arr: Array<ICategoryItem>;
  icon: string;
  onClick: (category: string) => void;
  currCategory: string;
}

interface IHotCategoryItem {
  name: string;
  id: string;
}
