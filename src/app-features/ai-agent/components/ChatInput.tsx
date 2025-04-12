import { useOnEventCallback } from '@/app-hooks/common';
import classNames from 'classnames';
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
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
const LINE_HEIGHT = 16;

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
	(
		{
			value,
			onChange,
			onSubmit,
			placeholder = 'Ask anything about Partnr Vaults',
			disabled = false,
			className,
			style,
		},
		ref,
	) => {
		const internalRef = useRef<HTMLTextAreaElement>(null);

		useImperativeHandle(ref, () => internalRef.current!);

		useEffect(() => {
			const el = internalRef.current;
			if (!el) return;

			el.style.height = 'auto';
			const scrollHeight = el.scrollHeight;
			const maxHeight = LINE_HEIGHT * MAX_ROWS;
			el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
		}, [value]);

		const handleKeyDown = useOnEventCallback(
			(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
				if (e.key === 'Enter') {
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						const target = e.currentTarget;
						const { selectionStart, selectionEnd } = target;
						const newValue =
							value.slice(0, selectionStart) + '\n' + value.slice(selectionEnd);
						const event = {
							...e,
							target: {
								...target,
								value: newValue,
							},
						} as unknown as React.ChangeEvent<HTMLTextAreaElement>;
						onChange(event);
						setTimeout(() => {
							target.selectionStart = target.selectionEnd = selectionStart + 1;
						}, 0);
					} else {
						e.preventDefault();
						onSubmit();
					}
				}
			},
		);

		return (
			<Form.Control
				as="textarea"
				ref={internalRef}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				className={classNames('chat-input', className)}
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
