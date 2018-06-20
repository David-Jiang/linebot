import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">理財機器人</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={() => browserHistory.push('/')}>
                Home
              </NavItem>
              <NavItem eventKey={2} onClick={() => browserHistory.push('/page1')}>
                Page1
              </NavItem>
              <NavItem eventKey={3} onClick={() => browserHistory.push('/stockPrice')}>
                股票手續費計算
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