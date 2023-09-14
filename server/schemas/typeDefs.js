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
    medName: String!
    maxDailyDoses: Int
    minTimeBetween: Int
    remindersBool: Boolean!
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
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(thoughtId: ID!): Thought
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addMed(medSettings: MedInput!): User
    addThought(thoughtText: String!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
    addNote(noteData: NoteInput!): User
    removeNote(noteId: ID!): User
  }
`;

module.exports = typeDefs;
