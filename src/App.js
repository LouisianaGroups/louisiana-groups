import React from "react";
import PropTypes from "prop-types";
import GroupCard from "./components/GroupCard";
import Footer from "./components/Footer";

const App = ({ groups }) => (
  <div>
    <div className="row m-0">
      {groups.map((group, i) => (
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

App.propTypes = {
  groups: PropTypes.array.isRequired
};

export default App;
