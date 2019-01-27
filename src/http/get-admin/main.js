const mount = document.getElementById('app');

const Form = (props) =>
  h(
    'form',
    {
      method: props.method,
      action: props.action,
      onSubmit: props.onSubmit,
    },
    h('fieldset', null, [
      h('legend', null, props.legend),
      props.children,
      h('button', null, 'Submit'),
    ])
  );

class CategoryForm extends Component {
  constructor() {
    super();

    this.state = {
      disabled: false,
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evnt) {
    this.setState({
      value: evnt.target.value,
    });
  }

  async handleSubmit(evnt) {
    evnt.preventDefault();
    this.setState({ disabled: true });

    try {
      await fetch(evnt.target.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(this.state.value)}`,
      });
      this.setState({ value: '', disabled: false });
    } catch (err) {
      console.error(err);
      this.setState({ disabled: false });
    }
  }

  render() {
    const { value, disabled } = this.state;
    const formProps = {
      method: 'post',
      action: `${baseUrl}api/category`,
      onSubmit: this.handleSubmit,
      legend: 'Create a category',
    };
    const inputProps = {
      type: 'text',
      placeholder: 'Category',
      onChange: this.handleChange,
      disabled,
      value,
    };

    return h(Form, formProps, h('input', inputProps));
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  async fetchCategories() {
    const request = await fetch(`${baseUrl}api/category`);
    const categories = await request.json();

    this.setState({ categories });
  }

  render() {
    return h('div', null, h(CategoryForm));
  }
}

render(h(App), mount);
