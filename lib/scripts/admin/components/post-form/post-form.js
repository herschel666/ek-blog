import React from 'react';
import ReactAce from 'react-ace';
import marked from 'marked';
import PropTypes from 'prop-types';

import { ReducerContext } from '../../reduxxx';
import { addBlogpost, updateBlogpost } from '../../state';
import { Form } from '../form/form';
import { MediaLibrary } from '../media-library/media-library';

export class PostForm extends React.Component {
  static propTypes = {
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']),
    uid: PropTypes.string,
    defaultValues: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  static contextType = ReducerContext;

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

    const isUpdate = this.props.method === 'put';
    const thunk = isUpdate ? updateBlogpost : addBlogpost;
    const { categories, content, title } = this.state;
    const args = [{ categories, content, title }];

    if (isUpdate) {
      args.unshift(this.props.uid);
    }

    try {
      await this.context.dispatch(thunk(...args));
      if (!isUpdate) {
        this.setState({
          categories: [],
          title: '',
          content: '',
        });
      }
    } catch (err) {
      console.error(err);
    }

    this.setState({ disabled: false });
  };

  toggleMediaLibrary = () =>
    this.setState(({ mediaLibraryOpen }) => ({
      mediaLibraryOpen: !mediaLibraryOpen,
    }));

  addToEditor = (filePath, description) => () => {
    if (this.editor.current && this.editor.current.editor) {
      this.editor.current.editor.insert(`![${description}](${filePath})\n\n`);
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
    const toggleMediaLibraryPrefix = mediaLibraryOpen ? 'Close' : 'Open';
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
        <button onClick={this.toggleMediaLibrary}>
          {toggleMediaLibraryPrefix} Media Library
        </button>
        {!preview && mediaLibraryOpen && (
          <MediaLibrary addToEditor={this.addToEditor} />
        )}
        {!mediaLibraryOpen && title && content && (
          <button onClick={this.togglePreview}>{togglePreviewText}</button>
        )}
        {preview && (
          <>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          </>
        )}
        {!preview && (
          <Form {...formProps}>
            <select {...selectProps}>
              <option>Select category&hellip;</option>
              {this.context.state.app.categories.map(({ uid, title }) => (
                <option
                  value={uid}
                  key={uid}
                  selected={this.state.categories.includes(uid)}
                >
                  {title}
                </option>
              ))}{' '}
            </select>
            <br />
            <input {...inputProps} />
            <br />
            <ReactAce {...editorProps} />
          </Form>
        )}
      </>
    );
  }
}
