import React from 'react';
import { Form } from 'react-bootstrap';

interface ChatInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onSubmit: () => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

const ChatInput: React.FC<ChatInputProps> = ({
	value,
	onChange,
	onSubmit,
	placeholder = 'Type to chat (Ctrl or Cmd + Enter to send)',
	disabled = false,
	className = '',
	style = {},
}) => {
	return (
		<Form.Control
			as="textarea"
			rows={1}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			onKeyDown={(e) => {
				if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
					e.preventDefault();
					onSubmit();
				}
			}}
			disabled={disabled}
			className={className}
			style={{
				resize: 'none',
				overflowY: 'auto',
				maxHeight: '6em',
				lineHeight: '1.5em',
				...style,
			}}
		/>
	);
};

export default ChatInput;
