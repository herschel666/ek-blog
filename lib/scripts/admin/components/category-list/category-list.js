import React from 'react';
import { Query, Mutation } from 'react-apollo';

import { QUERY_GET_CATEGORIES, MUTATION_DELETE_CATEGORY } from '../../apollo';

export const CategoryList = () => (
  <ol>
    <Query query={QUERY_GET_CATEGORIES}>
      {({ data: { getCategoryList: categories }, loading }) => {
        if (loading || !categories) {
          return <p>Loading categories…</p>;
        }

        return categories.map(({ title, uid }) => (
          <li key={uid}>
            {title}
            <Mutation
              mutation={MUTATION_DELETE_CATEGORY}
              variables={{ category: { __typename: 'DeleteCategory', uid } }}
            >
              {(deleteCategory, { loading }) => (
                <button onClick={deleteCategory} disabled={loading}>
                  &times;
                </button>
              )}
            </Mutation>
          </li>
        ));
      }}
    </Query>
  </ol>
);
