import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

import Calendar from 'react-calendar';
import { Container, Row, Col } from 'react-bootstrap';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

import 'react-calendar/dist/Calendar.css';

const MedicationReminder = () => {
	const { loading, data } = useQuery(QUERY_THOUGHTS);
	const thoughts = data?.thoughts || [];
	const [calendarValue, setCalendarValue] = useState(new Date());

	function onChangeCalendar(nextValue) {
		setCalendarValue(nextValue);
		console.log(calendarValue);
	}

	return (
		<main>
			<Container>
				<header>
					<h1>Medication Reminder</h1>
				</header>
				<Row>
					<Col>
						<div className="loader-container" id="pill-image">
							<div className="loader"></div>
						</div>
						<ul className="medication-list">
							<li>
								Medication Type 1
								<span className="medication-icon">Icon 1</span>
							</li>
							<li>
								Medication Type 2
								<span className="medication-icon">Icon 2</span>
							</li>
							<li>
								Medication Type 3
								<span className="medication-icon">Icon 3</span>
							</li>
							{/* Add more medication types and icons as needed */}
						</ul>
					</Col>
					<Col>
						<Calendar
							onChange={onChangeCalendar}
							value={calendarValue}
						/>
						<div className="reminder">
							{/* Add reminder component here */}
							{/* Example: <ReminderComponent /> */}
						</div>
					</Col>
				</Row>
			</Container>
		</main>
	);
};

export default MedicationReminder;
