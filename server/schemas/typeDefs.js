const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  scalar Time
  scalar DateTime

  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
    savedNotes: [Note]!
    noteCount: Int
    userMeds: [Med]!
  }

  type Med {
    _id: ID
    userId: ID
    medName: String!
    maxDailyDoses: Int
    minTimeBetween: Int
    remindersBool: Boolean!
    doses: [Dose]!
  }

  type Dose {
    _id: ID!
    doseScheduled: DateTime
    doseLogged: DateTime
  }

  type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Note {
    _id: ID!
    title: String!
    medicine: String!
    startTime: String!
    period: String!
    numberOfTime: String!
    total: String!
    userId: String!
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input NoteInput {
    title: String!
    medicine: String!
    startTime: String!
    period: String!
    numberOfTime: String!
    total: String!
  }

  input MedInput {
    medName: String!
    maxDailyDoses: Int
    minTimeBetween: Int
    remindersBool: Boolean!
  }

  type Query {
    user(username: String!): User
    me: User
    meds(username: String!): [Med]
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    users: [User]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addMed(userId: ID!, medSettings: MedInput!): Med
    addDose(medId: ID!, doseScheduled: DateTime, doseLogged: DateTime): Med
    addThought(thoughtText: String!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
    addNote(noteData: NoteInput!): User
    removeNote(noteId: ID!): User
  }
`;

module.exports = typeDefs;
