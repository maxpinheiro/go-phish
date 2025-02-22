export const modelTypeDefs = /* GraphQL */ `
  type UserAvatar {}
  type Avatar {}

  type User {
    id: Int!
    username: String!
    name: String
    bio: String
    homemtown: String
    email: String
    image: String
    admin: Boolean!
    avatar: Avatar
    avatarType: String
    friend_ids: [Int!]!
    guesses: [Guess!]!
  }

  type Venue {
    id: Int!
    name: String!
    name_abbr: String
    city: String
    state: String
    country: String
    tz_id: String!
    tz_name: String
    runs: [Run!]!
    shows: [Show!]!
  }

  type Run {
    id: Int!
    name: String!
    dates: [Date!]! # db.date ?
    venueId: Int!
    venue: Venue!
    shows: [Show!]!
  }

  type Show {
    id: Int!
    runId: Int!
    run: Run!
    runNight: Int!
    date: Date! # db.date ?
    timestamp: Date! # db.timestamptz ?
    venueId: Int!
    venue: Venue!
  }

  type Guess {
    id: Int!
    userId: Int!
    songId: String!
    songName: String!
    showId: Int!
    runId: Int!
    encore: Boolean!
    completed: Boolean!
    points: Float!
    user: User!
  }

  type Song {
    id: String!
    name: String!
    averageGap: Float!
    points: Float!
    tags: [String!]
  }
`;
