import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface MessageActionProps {
	onExecuteAction: () => Promise<void>;
}

const MessageAction: React.FC<MessageActionProps> = ({ onExecuteAction }) => {
	const [isExecuting, setIsExecuting] = useState(false);

	const handleExecuteAction = async () => {
		setIsExecuting(true);
		try {
			await onExecuteAction();
		} finally {
			setIsExecuting(false);
		}
	};

	return (
		<Button
			disabled={isExecuting}
			className="mt-2"
			variant="outline-primary"
			onClick={handleExecuteAction}
		>
			{isExecuting ? (
				<Spinner className="me-2" size="sm" style={{ borderWidth: '2px' }} />
			) : null}
			Execute action
		</Button>
	);
};

export default MessageAction;
