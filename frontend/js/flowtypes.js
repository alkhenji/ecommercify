/* @flow */

export type SubcategoryType = {
  name: string,
  slug: string
};

export type CategoryType = {
  name: string,
  slug: string,
};

export type SubcategoryWithCategoryType = {
  ...SubcategoryType,
  category: CategoryType
};

export type CategoryWithSubcategoriesType = {
  ...CategoryType,
  subcategories: Array<SubcategoryType>
}

export type StoreType = {
  name: string,
  slug: string,
  image: string | null
};

export type ProductType = {
  name: string,
  slug: string,
  description: string,
  price: string,
  hidden: boolean,
  subcategory: SubcategoryWithCategoryType,
  store: StoreType
};
