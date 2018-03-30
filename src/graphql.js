import { gql } from "apollo-boost";

export const GROUPS_QUERY = gql`
  query GroupsQuery {
    groupsByEventDate {
      name
      hex
      icon
      fontIcon
      website
      facebook
      twitter
      meetup
      isActive

      events {
        dateTime
      }
    }
  }
`;
