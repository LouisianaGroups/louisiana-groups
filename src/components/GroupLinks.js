import React from "react";
import PropTypes from "prop-types";

const GroupLinks = ({ Website, Facebook, Twitter, Meetup }) => (
  <div className="links">
    {Website && (
      <a href={Website}
        target="group"
        rel="nofollow"
        className="fas fa-link"
      />
    )}

    {Facebook && (
      <a
        href={Facebook}
        target="group"
        rel="nofollow"
        className="fab fa-facebook"
      />
    )}

    {Twitter && (
      <a
        href={Twitter}
        target="group"
        rel="nofollow"
        className="fab fa-twitter"
      />
    )}

    {Meetup && (
      <a
        href={Meetup}
        target="group"
        rel="nofollow"
        className="fab fa-meetup"
      />
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
