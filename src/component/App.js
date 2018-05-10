import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import style from '../css/style.css';

const App = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Robot visualization</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} componentClass="span">
                <Link to="/">Home</Link>
              </NavItem>
              <NavItem eventKey={2} componentClass="span">
                <Link to="/state">State</Link>
              </NavItem>
              <NavItem eventKey={3} componentClass="span">
                <Link to="/bar">Bar</Link>
              </NavItem>
              <NavItem eventKey={4} componentClass="span">
                <Link to="/myComponent">MyComponent</Link>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>

      <div style={{ marginTop: '50px' }}>{children}</div>
    </div>
  );
};

export default App;