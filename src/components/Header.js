import React, { Component } from "react";
import PropTypes from "prop-types";
import GroupCard from "./components/GroupCard";
import "./styles/header.css";

export default class App extends Component {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    search: PropTypes.string
  };
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
    document.body.classList.toggle("active");
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
    let filteredGroups = this.props.groups.filter(group => {
      return group.GroupName.toLowerCase().indexOf(this.state.search) !== -1;
    });
    return (
      <div className={`site__wrapper ${menuClass}`}>
        <div className={`nav__wrapper ${menuClass}`}>
          <input
            type="text"
            placeholder="Search..."
            className="search"
            value={this.state.search}
            onChange={this.updateSearch.bind(this)}
          />
          <nav id="main-nav" className="header-nav">
            <a href="/" className="header-link">
              Link 1
            </a>
            <a href="/" className="header-link">
              Link 2
            </a>
            <a href="/" className="header-link">
              Link 3
            </a>
          </nav>
        </div>
        <header>
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
        </header>
        <div className="row m-0">
          {filteredGroups.map((group, i) => (
            <GroupCard
              key={i}
              Hex={group.Hex}
              GroupName={group.GroupName}
              Location={group.Location}
              Website={group.Website}
              Facebook={group.Facebook}
              Twitter={group.Twitter}
              Meetup={group.Meetup}
              FontIcon={group.FontIcon}
            />
          ))}
        </div>

        <Footer />
      </div>
    );
  }
}

const styles = {
  header: {
    position: "absolute",
    zIndex: "1",
    background: "blue",
    height: "100vh",
    maxWidth: "250px",
    width: "100%",
    transform: "translateX(0%)",
    transition: "transform .3s ease-in"
  },
  menuOpen: {
    transform: "translateX(-100%)"
  }
};
