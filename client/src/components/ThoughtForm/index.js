import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const ThoughtForm = () => {
	const [thoughtText, setThoughtText] = useState('');

	const [characterCount, setCharacterCount] = useState(0);

	const [addThought, { error }] = useMutation(ADD_THOUGHT, {
		update(cache, { data: { addThought } }) {
			try {
				cache.modify({
					fields: {
						thoughts(existingThoughtRefs) {
							const newThoughtRef = cache.writeFragment({
								data: addThought,
								fragment: gql`
									fragment NewThought on Thought {
										_id
										thoughtText
										thoughtAuthor
									}
								`,
							});
							return [newThoughtRef, ...existingThoughtRefs];
						},
					},
				});
			} catch (error) {
				console.error(error);
			}
		},
	});

	const handleFormSubmit = async (event) => {
    // FIXME  handleFormSubmit not working offline.  
		event.preventDefault();

		const date = Date(Date.now());
		const dateId = date.toString();

		try {
			const { data } = await addThought({
				variables: {
					thoughtText,
					thoughtAuthor: Auth.getProfile().data.username,
				},
				// not sure if this is required.  doesn't seem to be working while mutations not working in offline mode.
        optimisticResponse: {
					addThought: {
						_id: `temp-${dateId}`,
						__typename: 'Thought',
						thoughtText: thoughtText,
						thoughtAuthor: Auth.getProfile().data.username,
					},
				},
			});
			console.log(data);
			setThoughtText('');
		} catch (err) {
			console.error(err);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === 'thoughtText' && value.length <= 280) {
			setThoughtText(value);
			setCharacterCount(value.length);
		}
	};

	return (
		<div>
			<h3>What's on your techy mind?</h3>

			{Auth.loggedIn() ? (
				<>
					<p
						className={`m-0 ${
							characterCount === 280 || error ? 'text-danger' : ''
						}`}
					>
						Character Count: {characterCount}/280
					</p>
					<form
						className="flex-row justify-center justify-space-between-md align-center"
						onSubmit={handleFormSubmit}
					>
						<div className="col-12 col-lg-9">
							<textarea
								name="thoughtText"
								placeholder="Here's a new thought..."
								value={thoughtText}
								className="form-input w-100"
								style={{
									lineHeight: '1.5',
									resize: 'vertical',
								}}
								onChange={handleChange}
							></textarea>
						</div>

						<div className="col-12 col-lg-3">
							<button
								className="btn btn-primary btn-block py-3"
								type="submit"
							>
								Add Thought
							</button>
						</div>
						{error && (
							<div className="col-12 my-3 bg-danger text-white p-3">
								{error.message}
							</div>
						)}
					</form>
				</>
			) : (
				<p>
					You need to be logged in to share your thoughts. Please{' '}
					<Link to="/login">login</Link> or{' '}
					<Link to="/signup">signup.</Link>
				</p>
			)}
		</div>
	);
};

export default ThoughtForm;
