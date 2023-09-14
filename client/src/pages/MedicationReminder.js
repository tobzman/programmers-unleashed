import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Calendar from 'react-calendar';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

import { QUERY_THOUGHTS } from '../utils/queries';

const MedicationReminder = () => {
	const { loading, data } = useQuery(QUERY_THOUGHTS);
	const thoughts = data?.thoughts || [];
  const [ calendarValue, setCalendarValue ] = useState(new Date());

  function onChangeCalendar(nextValue) {
    setCalendarValue(nextValue);
  }

	return (
		<main>
			<header>
				<h1>Medication Reminder</h1>
			</header>
			<div class="loader-container">
				<div class="loader"></div>
			</div>
			<div className="container">
				<div className="left-column">
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
				</div>
				<div className="right-column">
					<div className="calendar">
						{/* Add calendar component here */}
						{/* Example: <CalendarComponent /> */}
            <Calendar onChange={onChangeCalendar} value={calendarValue} />
					</div>
					<div className="reminder">
						{/* Add reminder component here */}
						{/* Example: <ReminderComponent /> */}
					</div>
				</div>
			</div>
		</main>
	);
};

export default MedicationReminder;
