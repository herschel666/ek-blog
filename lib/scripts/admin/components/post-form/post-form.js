import React from 'react';
import ReactAce from 'react-ace';
import marked from 'marked';
import PropTypes from 'prop-types';

import { Form } from '../form/form';

export class PostForm extends React.Component {
  static propTypes = {
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']),
    apiUrl: PropTypes.string.isRequired,
    addBlogpost: PropTypes.func,
    updateBlogpost: PropTypes.func,
    defaultValues: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  constructor(props) {
    super(props);

    const state = {
      title: '',
      content: '',
      categories: [],
      disabled: false,
      preview: false,
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

    const isUpdate = this.props.method === 'put' && this.props.updateBlogpost;
    const fn = isUpdate ? this.props.updateBlogpost : this.props.addBlogpost;
    const { categories, content, title } = this.state;
    const params = new URLSearchParams({
      content: content.trim(),
      title: title.trim(),
    });
    categories.forEach((uid) => params.append('categories', uid));

    try {
      await fn(params.toString());
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

  render() {
    const { categories, content, title, disabled } = this.state;
    const toggleText = this.state.preview ? 'Show form' : 'Show preview';
    const formProps = {
      method: this.props.method || 'post',
      action: this.props.apiUrl,
      onSubmit: this.handlePostSubmit,
      legend: 'Add post',
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
      mode: 'markdown',
      theme: 'github',
      value: content,
      onChange: this.handleContentChange,
      readOnly: disabled,
      editorProps: {
        $blockScrolling: Infinity,
      },
    };

    return (
      <>
        {title && content && (
          <button onClick={this.togglePreview}>{toggleText}</button>
        )}
        {this.state.preview && (
          <>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          </>
        )}
        {!this.state.preview && (
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
