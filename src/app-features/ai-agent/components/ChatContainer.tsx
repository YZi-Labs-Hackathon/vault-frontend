import { get } from '@/app-helpers/misc';
import { useUrlQuery } from '@/app-hooks/common';
import { ChatSession } from '@/app-services/chat-session';
import { ChatMessage } from '@/app-types/ai-agent';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Image, InputGroup, Spinner } from 'react-bootstrap';

// Bot message
export const ChatLeft = ({ children }) => (
	<div className="d-flex gap-2 align-items-end">
		<Image
			src="/vault_icon.png"
			width={24}
			height={20}
			alt="vault"
			className="flex-shrink-0 mb-1"
		/>
		<div className="rounded-3 px-3 py-2 bg-light">{children}</div>
	</div>
);

// User message
export const ChatRight = ({ children }) => (
	<div className="d-flex gap-2 align-items-end">
		<div className="rounded-3 px-3 py-2 bg-primary text-white ms-auto">{children}</div>
	</div>
);

interface ChatContainerProps {
	sessionId: string;
}

// Main chat component
const ChatContainer: React.FC<ChatContainerProps> = ({ sessionId }) => {
	const chatSessionRef = useRef<ChatSession>(ChatSession.fromSessionId(sessionId));

	const [messages, setMessages] = useState(chatSessionRef.current.useDefaultIfEmpty());
	const [input, setInput] = useState('');
	const [isThinking, setIsThinking] = useState(false);

	const sendAndWaitForChatResponse = async (message: string) => {
		try {
			setIsThinking(true);
			const data = {
				reply: 'okay',
			};

			const botMsg: ChatMessage = {
				id: Date.now() + 1,
				from: 'bot',
				text: data.reply || 'Sorry, I didn’t get that.',
			};

			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					from: 'bot',
					text: 'Something went wrong. Please try again later.',
				},
			]);
		} finally {
			setIsThinking(false);
		}
	};

	const handleSend = async () => {
		const trimmed = input.trim();
		if (!trimmed || isThinking) return;

		const userMsg: ChatMessage = {
			id: Date.now(),
			from: 'user',
			text: trimmed,
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput('');
		sendAndWaitForChatResponse(trimmed);
	};

	useEffect(() => {
		chatSessionRef.current.persist(messages);
	}, [messages]);

	useEffect(() => {
		const messages = chatSessionRef.current.load();
		if (messages.length === 1 && messages[0].from === 'user') {
			sendAndWaitForChatResponse(messages[0].text);
		}
	}, []);

	return (
		<Card
			className="chatBox overflow-hidden shadow-sm rounded-4"
			style={{ height: 'calc(100dvh - 240px)' }}
		>
			<Card.Body className="overflow-x-hidden overflow-y-auto h-100">
				<div className="chatContent d-flex flex-column-reverse gap-2 h-100 overflow-y-auto px-4">
					{[...messages]
						.reverse()
						.map((msg) =>
							msg.from === 'user' ? (
								<ChatRight key={msg.id}>{msg.text}</ChatRight>
							) : (
								<ChatLeft key={msg.id}>{msg.text}</ChatLeft>
							),
						)}
				</div>
			</Card.Body>

			<Card.Footer className="py-3">
				<InputGroup>
					<Form.Control
						placeholder="Type to chat ..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						disabled={isThinking}
					/>
					<Button variant="primary" onClick={handleSend} disabled={isThinking}>
						{isThinking ? <Spinner animation="border" size="sm" /> : 'Send'}
					</Button>
				</InputGroup>
			</Card.Footer>
		</Card>
	);
};

export default ChatContainer;
