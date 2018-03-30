import React from "react";
import { Query } from "react-apollo";
import GroupCard from "./components/GroupCard";
import Footer from "./components/Footer";
import { GROUPS_QUERY } from "./graphql";

export default ({ groups }) => (
  <div>
    <div className="row m-0">
      <Query query={GROUPS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return "Loading…";
          if (error) return error.message;

          return data.groupsByEventDate.map((group, i) => {
            if (!group.isActive) return "";

            return (
              <GroupCard
                key={i}
                hex={group.hex}
                name={group.name}
                Location={group.location}
                website={group.website}
                facebook={group.facebook}
                twitter={group.twitter}
                meetup={group.meetup}
                fontIcon={group.fontIcon}
                events={group.events}
                isActive={group.isActive}
              />
            );
          });
        }}
      </Query>
    </div>

    <Footer />
  </div>
);
