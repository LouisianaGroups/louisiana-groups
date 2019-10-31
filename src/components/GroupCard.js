import React from "react";
import PropTypes from "prop-types";
import FormattedDateTime from "./FormattedDateTime";
import GroupLinks from "./GroupLinks";

const GroupCard = ({
  hex,
  name,
  location,
  website,
  facebook,
  twitter,
  meetup,
  fontIcon,
  events
}) => (
  <div className="col-12 col-sm-6 col-lg-4 p-0">
    <div className="card" style={{ backgroundColor: hex }}>
      <div className="card-body">
        <div className="title">
          <span>
            <h2>{name}</h2>
          </span>
        </div>

        {location && (
          <div className="location">
            <span>
              <i className="fas fa-map-marker-alt mr-1" />{" "}
              <span>{location}</span>
            </span>
          </div>
        )}

        {events.length > 0 && (
          <FormattedDateTime dateString={events[0].dateTime} />
        )}

        <GroupLinks
          Website={website}
          Facebook={facebook}
          Twitter={twitter}
          Meetup={meetup}
        />

        <div
          className="icon d-flex align-items-center"
          dangerouslySetInnerHTML={{ __html: fontIcon }}
        />
      </div>
    </div>
  </div>
);

GroupCard.propTypes = {
  hex: PropTypes.string,
  name: PropTypes.string.isRequired,
  location: PropTypes.string,
  website: PropTypes.string,
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  meetup: PropTypes.string,
  fontIcon: PropTypes.string
};

GroupCard.defaultProps = {
  Hex: "#ddd"
};

export default GroupCard;
