import { gql } from '@apollo/client';

export const QUERY_THOUGHTS = gql`
	query getThoughts {
		thoughts {
			_id
			thoughtText
			thoughtAuthor
			createdAt
		}
	}
`;

// TODO
// export const QUERY_MEDS = gql`
//   query meds {
//     thoughts {
//       _id
//       thoughtText
//       thoughtAuthor
//       createdAt
//     }
//   }
// `;

export const QUERY_SINGLE_THOUGHT = gql`
	query getSingleThought($thoughtId: ID!) {
		thought(thoughtId: $thoughtId) {
			_id
			thoughtText
			thoughtAuthor
			createdAt
			comments {
				_id
				commentText
				commentAuthor
				createdAt
			}
		}
	}
`;

export const QUERY_ME = gql`
	query Me {
		me {
			_id
			username
			email
			password
			savedNotes {
				_id
				title
				medicine
				startTime
				period
				numberOfTime
				total
				userId
			}
			noteCount
			userMeds {
				_id
				userId
				medName
				maxDailyDoses
				minTimeBetween
				remindersBool
				doses {
					_id
					doseScheduled
					doseLogged
				}
			}
		}
	}
`;
