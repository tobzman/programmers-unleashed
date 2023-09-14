const { AuthenticationError } = require("apollo-server-express");
const { User, Thought, Note } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("thoughts").populate("savedNotes");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    
    addMed: async (parent, { medSettings }, context) => {
      console.log("addMed resolver");

      if (context.user) {
        console.log("context.user exists");
        console.log(medSettings);
        try {
          const updateUserWithMed = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { 
              userMeds: medSettings
            }},
            { new: true, runValidators: true }
          );
          
          console.log(updateUserWithMed);
          return updateUserWithMed;
        } catch (err) {
          throw new Error(err);
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeNote: async (parent, { noteId }, context) => {
      if (context.user) {
        const note = await Note.findOneAndDelete({
          _id: noteId,
          userId: context.user._id,
        });

        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedNotes: note._id,
            },
          }
        );

        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addNote: async (parent, { noteData }, context) => {
      console.log("I am now in addNote.");

      if (context.user) {
        console.log("context.user exists");
        const { title, medicine, startTime, period, numberOfTime, total } =
          noteData;
        const note = await Note.create({
          title: title,
          medicine: medicine,
          startTime: startTime,
          period: period,
          numberOfTime: numberOfTime,
          total: total,
          userId: context.user._id,
        });

        try {
          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedNotes: note._id } },
            { new: true, runValidators: true }
          ).populate("savedNotes");

          return user;
        } catch (err) {
          throw new AuthenticationError(err);
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeNote: async (parent, { noteId }, context) => {
      if (context.user) {
        const note = await Note.findOneAndDelete({
          _id: noteId,
          userId: context.user._id,
        });

        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedNotes: note._id,
            },
          }
        );

        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
