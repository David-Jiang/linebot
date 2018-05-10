import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

class MyComponent extends React.Component {
  state: { inputValue: string }

  constructor(props) {
    super(props);

    this.state = { inputValue: '' };
  }

  handleTextChange = (event: KeyboardEvent) => {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleItemAdd = () => {
    this.props.onItemAdd(
      {
        id: + new Date(),
        text: this.state.inputValue,
      });

    this.setState({
      inputValue: '',
    });
  }

  render() {
    const { items, onItemDel } = this.props;

    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleTextChange}
          />
          <button onClick={this.handleItemAdd}>
            新增項目
          </button>
        </div>
        <p>
          {
            items.map(item => (
              <li key={item.id}>
                <input
                  type="checkbox"
                  id={item.id}
                  onClick={() => onItemDel(item.id)}
                />
                {item.text}
              </li>
            ))
          }
        </p>

      </div>
    );
  }
}

const mapStateToProps = store => (
  { items: store.items }
);

export default connect(mapStateToProps, actionCreators)(MyComponent);
