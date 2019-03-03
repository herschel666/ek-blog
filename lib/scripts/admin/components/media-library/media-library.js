import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import { QUERY_GET_MEDIA_LIST } from '../../apollo';
import { MediaForm } from '../media-form/media-form';
import { MediaLibraryItem } from '../media-library-item/media-library-item';

export class MediaLibrary extends React.Component {
  static propTypes = {
    addToEditor: PropTypes.func,
  };
  static defaultProps = {
    addToEditor: () => () => void 0,
  };

  state = {
    page: 1,
    sizes: [],
  };

  setSizeValue = (index) => (evnt) =>
    this.setState((state) => {
      const sizes = state.sizes.slice();
      sizes[index] = evnt.target.value;

      return {
        sizes,
      };
    });

  setPrevPage = () => this.setState(({ page }) => ({ page: page - 1 }));

  setNextPage = () => this.setState(({ page }) => ({ page: page + 1 }));

  render() {
    const { mediaFormErrors } = this.props;

    return (
      <>
        <MediaForm page={this.state.page} />
        <Query
          query={QUERY_GET_MEDIA_LIST}
          variables={{ page: this.state.page }}
        >
          {({ data: { getMediaList: mediaList } }) => {
            return mediaList ? (
              <>
                <ul>
                  {mediaList.media.map((props) => (
                    <MediaLibraryItem
                      key={props.uid}
                      {...props}
                      page={this.state.page}
                      addToEditor={this.props.addToEditor}
                    />
                  ))}
                </ul>
                {this.state.page > 1 && (
                  <button onClick={this.setPrevPage}>Prev page</button>
                )}
                {mediaList.nextPage && (
                  <button onClick={this.setNextPage}>Next page</button>
                )}
              </>
            ) : null;
          }}
        </Query>
      </>
    );
  }
}
