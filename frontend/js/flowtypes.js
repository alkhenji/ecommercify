/* @flow */

export type SubcategoryType = {
  name: String,
  slug: String
};

export type CategoryType = {
  name: String,
  slug: String,
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
  name: String,
  slug: String,
  image: String | null
};

export type ProductType = {
  name: String,
  slug: String,
  description: String,
  price: String,
  hidden: Boolean,
  subcategory: SubcategoryWithCategoryType,
  store: StoreType
};
