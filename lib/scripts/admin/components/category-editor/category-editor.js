import React from 'react';

import { CategoryForm } from '../category-form/category-form';
import { CategoryList } from '../category-list/category-list';

export const CategoryEditor = () => (
  <details>
    <summary>Categories</summary>
    <CategoryForm />
    <CategoryList />
  </details>
);
