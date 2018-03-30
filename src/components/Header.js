import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";

import Logo from "../components/Logo";

const HeaderWrapper = ({ className, children }) => (
  <div className={className}>{children}</div>
);

const HeaderDiv = styled(HeaderWrapper)`
  margin: 0 auto;
  max-width: 1100px;
  padding: 1.45rem 1.0875rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
`;

export default class Header extends Component {
  // define props
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      search: ""
    };
    this.toggleMobileNav = this.toggleMobileNav.bind(this);
    this.closeMobileNav = this.closeMobileNav.bind(this);
  }
  toggleMobileNav = e => {
    this.setState({
      mobileNavOpen: !this.state.mobileNavOpen
    });
  };
  closeMobileNav = e => {
    this.setState({
      mobileNavOpen: false
    });
  };
  updateSearch = e => {
    console.log(e.target.value);
    this.setState({
      search: e.target.value.substr(0, 50)
    });
  };
  render() {
    const menuClass = this.state.mobileNavOpen ? "active" : "";

    return (
      <header>
        <HeaderDiv className="header-wrapper">
          <h1 style={{ margin: 0 }}>
            <a
              href="/"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              {/* <Logo className="header-logo" /> */}
            </a>
          </h1>
          <input
            type="text"
            placeholder="Search..."
            value={this.state.search}
            onChange={this.updateSearch.bind(this)}
          />
          <button
            id="mobile-toggle"
            className={`toggle-icon ${menuClass}`}
            aria-label="Mobile menu"
            onClick={this.toggleMobileNav}
          >
            <span className="hide-text">Menu</span>
            <span className="line line-1" />
            <span className="line line-2" />
            <span className="line line-3" />
          </button>
          <nav id="main-nav" className="header-nav">
            <a href="/posts/" className="header-link">
              Blog
            </a>
            <a href="/snippets/" className="header-link">
              Snippets
            </a>
            <a href="/contact/" className="header-link">
              Contact
            </a>
          </nav>
        </HeaderDiv>
      </header>
    );
  }

  componentWillMount() {
    // fires immediately before the initial render
  }
  componentDidMount() {}
  componentWillReceiveProps() {
    // fires when component is receiving new props
  }
  // shouldComponentUpdate() {
  // // fires before rendering with new props or state
  // }
  componentWillUpdate() {
    // fires immediately before rendering
    // with new props or state
  }
  componentDidUpdate() {
    // fires immediately after rendering with new P or S
  }
  componentWillUnmount() {
    // fires immediately before component is unmounted
    // from DOM (removed)
  }
}
