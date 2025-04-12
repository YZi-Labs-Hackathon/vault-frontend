'use client';

import { useAuthContext } from '@/app-contexts/auth';
import { useWeb3Wallet } from '@/app-contexts/thirdweb';
import { ChatSession } from '@/app-services/chat-session';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';

const AIQuickTerminal = () => {
	const router = useRouter();
	const [chatText, setChatText] = useState('');
	const [placeholder, setPlaceholder] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { connect, account, connectionStatus } = useWeb3Wallet();
	const { session } = useAuthContext();

	const placeholders = [
		"Help me find vaults that's suitable for me",
		'Create a vault please',
		'List out my vaults',
	];

	// Use refs for mutable values that don't trigger re-renders
	const typingIndexRef = useRef(0);
	const charIndexRef = useRef(0);
	const isDeletingRef = useRef(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const startChatFnRef = useRef<(() => void) | null>(null);

	const type = () => {
		const currentText = placeholders[typingIndexRef.current];
		let delay = 50;

		if (!isDeletingRef.current) {
			// Typing
			charIndexRef.current++;
			setPlaceholder(currentText.slice(0, charIndexRef.current));

			if (charIndexRef.current === currentText.length) {
				isDeletingRef.current = true;
				delay = 1500; // Wait before deleting
			}
		} else {
			// Deleting
			charIndexRef.current--;
			setPlaceholder(currentText.slice(0, charIndexRef.current));

			if (charIndexRef.current === 0) {
				isDeletingRef.current = false;
				typingIndexRef.current = (typingIndexRef.current + 1) % placeholders.length;
				delay = 500; // Wait before typing next sentence
			}
		}

		timeoutRef.current = setTimeout(type, delay);
	};

	const startChat = async () => {
		if (!chatText) return;

		const startChatFn = async () => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 0));
			await ChatSession.insertOne({
				id: Date.now(),
				from: 'user',
				content: [chatText],
			});
			router.push('/ai-agent/chat');
		};

		if (!account) {
			startChatFnRef.current = startChatFn;
			await connect();
			return;
		}

		startChatFn();
	};

	const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			startChat();
		}
	};

	useEffect(() => {
		type(); // Start typing animation

		return () => {
			// Clean up timeout
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	useEffect(() => {
		if (connectionStatus === 'connected' && session && !!startChatFnRef.current) {
			startChatFnRef.current();
			startChatFnRef.current = null;
		}
	}, [connectionStatus, session]);

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
						onKeyDown={onInputEnter}
						onChange={(e) => setChatText(e.target.value)}
						disabled={isLoading}
					/>
					<Button disabled={isLoading} variant="outline-secondary" onClick={startChat}>
						{!isLoading ? 'Send' : <Spinner size="sm" style={{ borderWidth: '2px' }} />}
					</Button>
				</InputGroup>
			</div>
		</div>
	);
};

export default AIQuickTerminal;
