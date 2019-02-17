import React from 'react';

import { CategoryForm } from '../category-form/category-form';
import { CategoryList } from '../category-list/category-list';

export const CategoryEditor = ({
  categories,
  categoryFormErrors,
  addCategory,
  deleteCategory,
}) => (
  <details>
    <summary>Categories</summary>
    <CategoryForm
      addCategory={addCategory}
      categoryFormErrors={categoryFormErrors}
    />
    <CategoryList categories={categories} deleteCategory={deleteCategory} />
  </details>
);

CategoryEditor.propTypes = {
  ...CategoryList.propTypes,
  ...CategoryForm.propTypes,
};
