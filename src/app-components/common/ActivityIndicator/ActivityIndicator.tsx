import React from 'react';
import { Spinner, SpinnerProps } from 'react-bootstrap';

const ActivityIndicator = (props: SpinnerProps) => {
	return (
		<div className={props.className}>
			<Spinner variant="primary" animation="border" size="sm" {...props} />
		</div>
	);
};

export default ActivityIndicator;
