/* @flow */

export type SubcategoryType = {
  name: string,
  slug: string
};

export type CategoryType = {
  name: string,
  slug: string,
  subcategories: Array<SubcategoryType>
};

export type SubcategoryWithCategoryType = {
  ...SubcategoryType,
  category: CategoryType
};

export type CategoryWithSubcategoriesType = {
  ...CategoryType,
  subcategories: Array<SubcategoryType>
};

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
  quantity: number,
  subcategory: SubcategoryWithCategoryType,
  store: StoreType
};

export type CartProductType = {
  id: number,
  quantity: number,
  product: ProductType
};
