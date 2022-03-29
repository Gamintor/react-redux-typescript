import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserEvent, updateUserEvent, UserEvent } from '../../redux/user-events';

interface Props {
	event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
	const [editable, setEditable] = useState(false);
	const [title, setTitle] = useState(event.title);
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editable) {
			inputRef.current.focus();
		}
	}, [editable]);

	const handleClickDelete = () => {
		dispatch(deleteUserEvent(event.id));
	};

	const handleClickTitle = () => {
		setEditable(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleBlur = () => {
		if (title !== event.title) {
			dispatch(updateUserEvent({ ...event, title }));
		}
		setEditable(false);
	};

	return (
		<div className='calendar-event'>
			<div className='calendar-event-info'>
				<div className='calendar-event-time'>10:00 - 12:00</div>
				<div className='calendar-event-title'>{editable ? <input onBlur={handleBlur} onChange={e => handleChange(e)} ref={inputRef} type='text' value={title} /> : <span onClick={handleClickTitle}>{event.title}</span>}</div>
			</div>
			<button className='calendar-event-delete-button' onClick={handleClickDelete}>
				X
			</button>
		</div>
	);
};

export default EventItem;
