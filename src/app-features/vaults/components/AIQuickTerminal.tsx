'use client';

import { ChatSession } from '@/app-services/chat-session';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

const AIQuickTerminal = () => {
	const router = useRouter();
	const [chatText, setChatText] = useState('');
	const [placeholder, setPlaceholder] = useState('');
	const placeholders = [
		"Help me find vaults that's fit to me",
		'Create a vault please',
		'What is my TVL now?',
	];
	let typingIndex = 0;
	let charIndex = 0;
	let isDeleting = false;

	useEffect(() => {
		const interval = setInterval(() => {
			const current = placeholders[typingIndex];
			if (!isDeleting) {
				setPlaceholder(current.slice(0, charIndex + 1));
				charIndex++;

				if (charIndex === current.length) {
					isDeleting = true;
					setTimeout(() => {}, 2000); // pause before delete
				}
			} else {
				setPlaceholder(current.slice(0, charIndex - 1));
				charIndex--;

				if (charIndex === 0) {
					isDeleting = false;
					typingIndex = (typingIndex + 1) % placeholders.length;
				}
			}
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const startChat = () => {
		if (!chatText) return;
		const session = ChatSession.create();
		session.insertOne({
			id: Date.now(),
			from: 'user',
			text: chatText,
		});
		router.push(`/ai-agent/chat/${session.getSessionId()}`);
	};

	const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			startChat();
		}
	};

	return (
		<div className="text-center">
			<div className="mb-3">
				<Image src="/vault_icon.png" width={64} height={53} alt="" />
			</div>
			<h1>I'm Terminal, your AI-powered DeFi assistant</h1>
			<p className="mb-4">Type a message to start chatting with the AI Agent.</p>
			<div className="col-md-6 mx-auto">
				<InputGroup className="mb-3">
					<Form.Control
						placeholder={placeholder}
						value={chatText}
						maxLength={100}
						onKeyDown={onInputEnter}
						onChange={(e) => setChatText(e.target.value)}
					/>
					<Button variant="outline-secondary" onClick={startChat}>
						Send
					</Button>
				</InputGroup>
			</div>
		</div>
	);
};

export default AIQuickTerminal;
