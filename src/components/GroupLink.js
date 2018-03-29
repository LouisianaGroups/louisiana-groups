import React from "react";
import PropTypes from "prop-types";

const GroupLink = ({ url, description, icon }) => (
  <a href={url} target="group" rel="nofollow" className={icon}>
    <span style={{ display: "inline-block", textIndent: "-9999em" }}>
      This group’s {description}
    </span>
  </a>
);

GroupLink.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default GroupLink;
