/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const PropertySelectInput = withStyles(theme => ({
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.8125rem',
    borderRadius: '4px',
    padding: '3px 3px 3px 3px',
  },
}))(InputBase);

const PropertySelectElement = withStyles(theme => ({
  select: {
    height: 'auto',
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px'
    },
  },
}))(NativeSelect);

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.8125rem',
  },
  optionsHeader: {
    fontSize: '1pt',
    backgroundColor: '#000000',
  }
});

class PropertySelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    onChange: () => {
      console.info('PropertySelect.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      inputValue: this.props.value,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { values } = this.props;
    const { inputText } = this.state;
    return inputText !== nextProps.text || inputText !== nextState.inputText || values !== nextProps.values;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({
        inputValue: value,
      });
    }
  }

  handleOnChange = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
    this.props.onChange(e.target.value);
  };

  render () {
    const {classes, values} = this.props;
    const {inputValue} = this.state;
    return (
      <FormControl className={classes.root}>
        <PropertySelectElement
          value={inputValue}
          onChange={this.handleOnChange}
          input={<PropertySelectInput />}
        >
          <option value="" style={{color: '#cdcdcd'}}>not set</option>
          <option className={classes.optionsHeader} disabled={true}>
            &#9472;&#9472;&#9472;
          </option>
          {values && values.map((valueItem, valueIdx) => {
            return (
              <option key={'' + valueIdx} value={valueItem}>{valueItem}</option>
            );
          })}
        </PropertySelectElement>
      </FormControl>
    );
  }
}

export default withStyles(styles)(PropertySelect);
