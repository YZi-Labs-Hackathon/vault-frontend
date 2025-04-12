import classNames from 'classnames';
import React, { useEffect, useRef, useImperativeHandle } from 'react';
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

const MAX_ROWS = 4;
const LINE_HEIGHT = 16; // adjust if needed based on styling

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
	(
		{
			value,
			onChange,
			onSubmit,
			placeholder = 'Type to chat (Ctrl or Cmd + Enter to send)',
			disabled = false,
			className = '',
			style = {},
		},
		ref,
	) => {
		const internalRef = useRef<HTMLTextAreaElement>(null);

		// Expose internalRef to parent
		useImperativeHandle(ref, () => internalRef.current!);

		// Auto-resize effect
		useEffect(() => {
			const el = internalRef.current;
			if (!el) return;

			el.style.height = 'auto'; // Reset height to get scrollHeight correctly
			const scrollHeight = el.scrollHeight;
			const maxHeight = LINE_HEIGHT * MAX_ROWS;

			el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
		}, [value]);

		return (
			<Form.Control
				as="textarea"
				ref={internalRef}
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
					lineHeight: `${LINE_HEIGHT}px`,
					maxHeight: `${LINE_HEIGHT * MAX_ROWS}px`,
					...style,
				}}
			/>
		);
	},
);

export default ChatInput;
