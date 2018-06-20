import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import '../css/style.css';

const Layout = ({ children }) => {
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
                <Link to="/page1">Page1</Link>
              </NavItem>
              <NavItem eventKey={3} componentClass="span">
                <Link to="/stockPrice">股票手續費計算</Link>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      {children}
    </div>
  );
};

export default Layout;