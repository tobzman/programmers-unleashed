const { AuthenticationError } = require('apollo-server-express');
const { User, Thought, Note, Med, Dose } = require('../models');
const { signToken } = require('../utils/auth');
const {
	DateScalar,
	TimeScalar,
	DateTimeScalar,
} = require('graphql-date-scalars');

const resolvers = {
	Date: DateScalar,
	Time: TimeScalar,
	DateTime: DateTimeScalar,

	Query: {
		users: async () => {
			return User.find().populate('thoughts').populate('savedNotes');
		},
		me: async (parent, args, context) => {
			if (context.user) {
				try {
					const userData = await User.findOne({
						_id: context.user._id,
					}).populate('userMeds');
					console.log(userData);
					return userData;
				} catch (err) {
					console.error(err);
				}
			}
			throw new AuthenticationError('You need to be logged in!');
		},
		// TODO 
		meds: async (parent, args, context) => {
			if (context.user) {
				try {
					const medsData = await Med.find({
						userId: context.user._id,
					}).populate('doses');

					console.log(medsData);
					return medsData;
				} catch (err) {
					console.error(err);
				}
			}
			throw new AuthenticationError('You need to be logged in!');
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
				throw new AuthenticationError(
					'No user found with this email address'
				);
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		},
		// WORKS
		addMed: async (parent, { medSettings }, context) => {
			console.log('addMed resolver');
			console.log(medSettings);
			try {
				const newMed = await Med.create({
					userId: context.user._id,
					...medSettings,
				});
				console.log(newMed);

				try {
					const userUpdate = await User.findOneAndUpdate(
						{ _id: context.user._id },
						{ $addToSet: { userMeds: newMed._id } },
						{ new: true, runValidators: true }
					).populate('userMeds');

					console.log(userUpdate);
				} catch (err) {
					console.log('update user failed');
					throw new Error(err);
				}

				return newMed;
			} catch (err) {
				console.log('add med failed');
				throw new Error(err);
			}
		},
		addDose: async (
			parent,
			{ medId, doseScheduled, doseLogged },
			context
		) => {
			console.log('addDose resolver');
			console.log({ medId, doseScheduled, doseLogged });
			if (context.user) {
				console.log('context.user exists');
				try {
					const newDose = await Dose.create({
						userId: context.user._id,
						medId: medId,
						doseScheduled: doseScheduled,
						doseLogged: doseLogged,
					});
					console.log(newDose);
					const updateMed = await Med.findOneAndUpdate(
						{ _id: medId },
						{ $addToSet: { doses: newDose._id } },
						{ new: true }
					).populate('doses');
					console.log(updateMed);
					return newDose;
				} catch (err) {
					throw new Error(err);
				}
			}
			throw new AuthenticationError('You need to be logged in!');
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
			throw new AuthenticationError('You need to be logged in!');
		},
		addNote: async (parent, { noteData }, context) => {
			console.log('I am now in addNote.');

			if (context.user) {
				console.log('context.user exists');
				const {
					title,
					medicine,
					startTime,
					period,
					numberOfTime,
					total,
				} = noteData;
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
					).populate('savedNotes');

					return user;
				} catch (err) {
					throw new AuthenticationError(err);
				}
			}
			throw new AuthenticationError('You need to be logged in!');
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
			throw new AuthenticationError('You need to be logged in!');
		},
	},
};

module.exports = resolvers;
