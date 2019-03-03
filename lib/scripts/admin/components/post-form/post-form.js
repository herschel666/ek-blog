import React from 'react';
import ReactAce from 'react-ace';
import { Query } from 'react-apollo';
import marked from 'marked';
import PropTypes from 'prop-types';

import { QUERY_GET_CATEGORIES } from '../../apollo';
import { Form } from '../form/form';
import { ErrorFeedback } from '../error-feedback/error-feedback';
import { MediaLibrary } from '../media-library/media-library';
import styles from './post-form.css';

export class PostForm extends React.Component {
  static propTypes = {
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']),
    onSubmit: PropTypes.func.isRequired,
    defaultValues: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  editor = React.createRef();

  constructor(props) {
    super(props);

    const state = {
      title: '',
      content: '',
      categories: [],
      disabled: false,
      preview: false,
      mediaLibraryOpen: false,
      errors: [],
    };
    const { categories = [], ...defaultValues } = props.defaultValues || {};
    this.state = {
      ...state,
      ...defaultValues,
      categories: state.categories.concat(categories),
    };
  }

  togglePreview = () =>
    this.setState(({ preview }) => ({
      preview: !preview,
    }));

  handleCategoryChange = (evnt) => {
    const categories = Array.from(evnt.target.options)
      .filter(({ selected }) => selected)
      .map(({ value }) => value);

    this.setState({ categories });
  };

  handleTitleChange = (evnt) =>
    this.setState({
      title: evnt.target.value,
    });

  handleContentChange = (content) =>
    this.setState({
      content,
    });

  handlePostSubmit = async (evnt) => {
    evnt.preventDefault();
    this.setState({ disabled: true });

    const { categories, content, title } = this.state;

    await this.props.onSubmit({ categories, content, title }).catch((err) => {
      console.error('Failed to save blogpost.', err);
    });
    this.setState({ disabled: false });
  };

  toggleMediaLibrary = ({ target }) =>
    this.setState({
      mediaLibraryOpen: target.open,
    });

  addToEditor = ({
    root,
    filehash,
    ext,
    description,
    size = 'medium',
  }) => () => {
    if (this.editor.current && this.editor.current.editor) {
      const isPdf = ext === 'pdf';
      const filename = isPdf
        ? `${filehash}.${ext}`
        : `${filehash}-${size}.${ext}`;
      const snippet = `[${description}](${root}${filename})\n\n`;
      const prefix = isPdf ? '' : '!';
      this.editor.current.editor.insert(`${prefix}${snippet}`);
      this.editor.current.editor.focus();
    }
    this.setState({
      mediaLibraryOpen: false,
    });
  };

  render() {
    const {
      categories,
      content,
      title,
      disabled,
      preview,
      mediaLibraryOpen,
    } = this.state;
    const togglePreviewText = preview ? 'Show form' : 'Show preview';
    const formProps = {
      method: this.props.method || 'post',
      action: '',
      onSubmit: this.handlePostSubmit,
      legend: 'Add post',
      submitLabel: 'Save post',
    };
    const selectProps = {
      name: 'categories',
      value: categories,
      onChange: this.handleCategoryChange,
      multiple: true,
      disabled,
    };
    const inputProps = {
      type: 'text',
      value: title,
      placeholder: 'Title',
      onChange: this.handleTitleChange,
      disabled,
    };
    const editorProps = {
      ref: this.editor,
      width: '100%',
      fontSize: '1em',
      showGutter: false,
      showPrintMargin: false,
      wrapEnabled: true,
      name: 'blogpost-editor',
      mode: 'markdown',
      theme: 'github',
      value: content,
      onChange: this.handleContentChange,
      readOnly: disabled,
      editorProps: {
        $blockScrolling: Infinity,
        useSoftTabs: true,
      },
    };

    return (
      <>
        <details
          open={mediaLibraryOpen}
          onToggle={this.toggleMediaLibrary}
          className={styles.mediaLibrary}
        >
          <summary>Media Library</summary>
          <MediaLibrary addToEditor={this.addToEditor} />
        </details>
        <hr />
        {!preview && (
          <>
            <ErrorFeedback type="Post" />
            <Form {...formProps}>
              <select {...selectProps}>
                <option>Select category&hellip;</option>
                <Query query={QUERY_GET_CATEGORIES}>
                  {({ data: { getCategoryList } }) =>
                    getCategoryList
                      ? getCategoryList.map(({ uid, title }) => (
                          <option
                            value={uid}
                            key={uid}
                            selected={this.state.categories.includes(uid)}
                          >
                            {title}
                          </option>
                        ))
                      : null
                  }
                </Query>
              </select>
              <br />
              <input {...inputProps} />
              <br />
              <ReactAce {...editorProps} />
            </Form>
          </>
        )}
        {preview && (
          <>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          </>
        )}
        {title && content && (
          <button onClick={this.togglePreview}>{togglePreviewText}</button>
        )}
      </>
    );
  }
}
