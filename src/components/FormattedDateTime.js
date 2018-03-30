import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const FormattedDateTime = ({ dateString }) => (
  <div className="next-event">
    <span>
      Next meetup: {moment(dateString, moment.ISO_8601).format("M/D @ h:mm A")}
    </span>
  </div>
);

FormattedDateTime.propTypes = {
  dateString: PropTypes.string.isRequired
};

export default FormattedDateTime;
