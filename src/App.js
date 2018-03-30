import React, { Component } from "react";
import PropTypes from "prop-types";
import GroupCard from "./components/GroupCard";
import Footer from "./components/Footer";

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
    let filteredGroups = this.props.groups.filter(group => {
      // console.log(group.GroupName.indexOf(this.setState.search));
      console.log(this.setState.search);
      return group.GroupName.indexOf(this.setState.search) !== -1;
    });
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.search}
          onChange={this.updateSearch.bind(this)}
        />
        <div className="row m-0">
          {this.props.groups.map((group, i) => (
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
