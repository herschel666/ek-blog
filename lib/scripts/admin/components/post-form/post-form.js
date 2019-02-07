import React from 'react';
import ReactAce from 'react-ace';
import marked from 'marked';
import PropTypes from 'prop-types';

import { Form } from '../form/form';

export class PostForm extends React.Component {
  static propTypes = {
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']),
    mediaLibrary: PropTypes.element.isRequired,
    onSubmit: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
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

    this.props.onSubmit({ categories, content, title }).catch((err) => {
      console.error('Failed to save blogpost.', err);
      this.setState({ disabled: false });
    });
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
        {!preview && (
          <button onClick={this.toggleMediaLibrary}>
            {toggleMediaLibraryPrefix} Media Library
          </button>
        )}
        {!preview &&
          mediaLibraryOpen &&
          React.createElement(this.props.mediaLibrary.type, {
            ...this.props.mediaLibrary.props,
            addToEditor: this.addToEditor,
          })}
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
              {this.props.categories.map(({ uid, title }) => (
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
