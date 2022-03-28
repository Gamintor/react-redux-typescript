import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectUserEventsArray, loadUserEvents, UserEvent } from '../../redux/user-events';
import { addZero } from '../Recorder/Recorder';
import './Calendar.css';

const mapState = (state: RootState) => ({
	events: selectUserEventsArray(state),
});

const mapDispatch = {
	loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	return `${addZero(year)}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
	const groups: Record<string, UserEvent[]> = {};

	const addToGroup = (dateKey: string, event: UserEvent) => {
		if (groups[dateKey] === undefined) {
			groups[dateKey] = [];
		}
		groups[dateKey].push(event);
	};

	events.forEach(event => {
		const dateStartKey = createDateKey(new Date(event.dateStart));
		const dateEndKey = createDateKey(new Date(event.dateEnd));

		addToGroup(dateStartKey, event);

		if (dateEndKey !== dateStartKey) {
			addToGroup(dateEndKey, event);
		}
	});
	return groups;
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
	useEffect(() => {
		loadUserEvents();
		// eslint-disable-next-line
	}, []);

	let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
	let sortedGroupKeys: string[] | undefined;

	if (events.length) {
		groupedEvents = groupEventsByDay(events);
		sortedGroupKeys = Object.keys(groupedEvents).sort((d1, d2) => +new Date(d1) - +new Date(d2));
	}

	return groupedEvents && sortedGroupKeys ? (
		<div className='calendar'>
			{sortedGroupKeys.map(day => {
				const events = groupedEvents[day];
				const groupDate = new Date(day);
				const dan = groupDate.getDate();
				const month = groupDate.toLocaleString(undefined, { month: 'long' });
				return (
					<div className='calendar-day'>
						<div className='calendar-day-label'>
							<span>
								{dan} {month}
							</span>
						</div>
						<div className='calendar-events'>
							{events.map(event => {
								return (
									<div key={event.id} className='calendar-event'>
										<div className='calendar-event-info'>
											<div className='calendar-event-time'>10:00 - 12:00</div>
											<div className='calendar-event-title'>{event.title}</div>
										</div>
										<button className='calendar-event-delete-button'>X</button>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	) : (
		<h2>Loading ...</h2>
	);
};

export default connector(Calendar);