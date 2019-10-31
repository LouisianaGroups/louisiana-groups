import React from "react";
import PropTypes from "prop-types";
import GroupLink from "./GroupLink";

const GroupLinks = ({ Website, Facebook, Twitter, Meetup }) => (
  <div className="links">
    {Website && (
      <GroupLink url={Website} description="website" icon="fas fa-link" />
    )}

    {Facebook && (
      <GroupLink
        url={Facebook}
        description="Facebook page"
        icon="fab fa-facebook"
      />
    )}

    {Twitter && (
      <GroupLink
        url={Twitter}
        description="Twitter account"
        icon="fab fa-twitter"
      />
    )}

    {Meetup && (
      <GroupLink url={Meetup} description="Meetup page" icon="fab fa-meetup" />
    )}
  </div>
);

GroupLinks.propTypes = {
  Website: PropTypes.string,
  Facebook: PropTypes.string,
  Twitter: PropTypes.string,
  Meetup: PropTypes.string
};

export default GroupLinks;
