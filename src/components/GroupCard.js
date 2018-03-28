import React from "react";
import PropTypes from "prop-types";
import GroupLinks from "./GroupLinks";

const GroupCard = ({
  Hex,
  GroupName,
  Location,
  Website,
  Facebook,
  Twitter,
  Meetup,
  FontIcon
}) => (
  <div className="col-12 col-sm-6 col-lg-4 p-0">
    <div className="card" style={{ backgroundColor: Hex }}>
      <div className="card-body">
        <div className="title">
          <span>
            <h2>{GroupName}</h2>
          </span>
        </div>

        {Location && (
          <div className="location">
            <span>
              <i className="fas fa-map-marker-alt mr-1" />{" "}
              <span>{Location}</span>
            </span>
          </div>
        )}

        <div className="next-event">
          <span>Next meetup: 3/12 @ 6:00pm</span>
        </div>

        <GroupLinks
          Website={Website}
          Facebook={Facebook}
          Twitter={Twitter}
          Meetup={Meetup}
        />

        <div
          className="icon d-flex align-items-center"
          dangerouslySetInnerHTML={{ __html: FontIcon }}
        />
      </div>
    </div>
  </div>
);

GroupCard.propTypes = {
  Hex: PropTypes.string,
  GroupName: PropTypes.string.isRequired,
  Location: PropTypes.string,
  Website: PropTypes.string,
  Facebook: PropTypes.string,
  Twitter: PropTypes.string,
  Meetup: PropTypes.string,
  FontIcon: PropTypes.string
};

GroupCard.defaultProps = {
  Hex: "#ddd"
};

export default GroupCard;
