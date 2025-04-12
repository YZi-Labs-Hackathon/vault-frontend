import { ChatSession } from '@/app-services/chat-session';
import { ChatMessage } from '@/app-types/ai-agent';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Collapse, Form, InputGroup, Spinner } from 'react-bootstrap';

// Chat bubbles
const ChatLeft = ({ children }) => (
	<div className="d-flex gap-2 align-items-end">
		<Image
			src="/vault_icon.png"
			width={24}
			height={20}
			alt="valt"
			className="flex-shirnk-0 mb-1"
		/>
		<div className="rounded-3 px-3 py-2 bg-light">{children}</div>
	</div>
);

const ChatRight = ({ children }) => (
	<div className="d-flex gap-2 align-items-end">
		<div className="rounded-3 px-3 py-2 bg-primary text-white ms-auto">{children}</div>
	</div>
);

const ChatWidget = () => {
	const router = useRouter();
	const chatSessionRef = useRef<ChatSession>(ChatSession.create());

	const [chatActivated, setChatActivated] = useState(false);
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [isThinking, setIsThinking] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>(
		chatSessionRef.current.useDefaultIfEmpty(),
	);

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
		setChatActivated(true);
		sendAndWaitForChatResponse(trimmed);
	};

	const onExpandChat = () => {
		router.push(`/ai-agent/chat/${chatSessionRef.current.getSessionId()}`);
	};

	useEffect(() => {
		if (!chatActivated) return;
		chatSessionRef.current.persist(messages);
	}, [messages, chatActivated]);

	return (
		<div className="position-fixed bottom-0 end-0 m-4">
			<Button
				variant="secondary"
				className="shadow p-2 d-inline-flex rounded-circle position-absolute bottom-0 end-0"
				onClick={() => setOpen(!open)}
			>
				<Image
					src="/vault_icon.png"
					width={40}
					height={40}
					alt="valt"
					style={{ objectFit: 'contain' }}
				/>
			</Button>

			<Collapse in={open}>
				<div style={{ width: 400 }}>
					<Card className="shadow overflow-hidden" style={{ height: 600 }}>
						<Card.Header className="d-flex align-items-center">
							<Card.Title className="my-1 flex-grow-1">DeFi Assistant</Card.Title>
							<a href={''} className="btn text-secondary border-0" onClick={onExpandChat}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									width={24}
									height={24}
									strokeWidth="1.5"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
									/>
								</svg>
							</a>
							<Button variant="close" onClick={() => setOpen(!open)} />
						</Card.Header>

						<Card.Body className="overflow-x-hidden overflow-y-auto h-100">
							<div className="chatContent d-flex flex-column-reverse gap-2 h-100 overflow-y-auto pe-2">
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

						<Card.Footer>
							<InputGroup>
								<Form.Control
									placeholder="Type to chat..."
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
				</div>
			</Collapse>
		</div>
	);
};

export default ChatWidget;
