'use client';

import { THINKING_MESSAGE, useChatSession } from '@/app-hooks/ai-agent';
import { ChatSession } from '@/app-services/chat-session';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button, Card, Collapse, Form, InputGroup, Spinner } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import MessageRenderer from './MessageRenderer';

// Chat bubbles
const ChatLeft = ({ content, animateChar, onAnimateStart, onAnimateDone }) => (
	<div className="d-flex gap-2 align-items-end">
		<Image
			src="/vault_icon.png"
			width={24}
			height={20}
			alt="vault"
			className="flex-shrink-0 mb-1"
		/>
		<div className="rounded-3 px-3 py-2 bg-light">
			<MessageRenderer
				content={content}
				animateChar={animateChar}
				onAnimateStart={onAnimateStart}
				onAnimateDone={onAnimateDone}
			/>
		</div>
	</div>
);

const ChatRight = ({ content }) => (
	<div className="d-flex gap-2 align-items-end">
		<div className="rounded-3 px-3 py-2 bg-primary text-white ms-auto">
			<MessageRenderer content={content} />
		</div>
	</div>
);

const ChatThinking = () => (
	<ChatLeft
		content={<BeatLoader size={6} />}
		animateChar={false}
		onAnimateStart={() => {}}
		onAnimateDone={() => {}}
	/>
);

const ExpandButton = ({ onClick }) => (
	<button type="button" className="btn text-secondary border-0" onClick={onClick}>
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
	</button>
);

interface ChatWidgetProps {
	vaultId?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ vaultId }) => {
	const router = useRouter();
	const sessionRef = useRef(ChatSession.create());
	const sessionId = sessionRef.current.getSessionId();

	const [open, setOpen] = useState(false);
	const [chatActivated, setChatActivated] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const { messages, messageDraft, setMessageDraft, isThinking, commitMessageDraft } =
		useChatSession(sessionId, {
			persistEnabled: chatActivated,
			vaultId,
		});

	const handleSend = async () => {
		if (!messageDraft.trim() || isThinking || isAnimating) return;
		setChatActivated(true);
		await commitMessageDraft();
	};

	const onExpandChat = () => {
		router.push(`/ai-agent/chat/${sessionId}?vault_id=${vaultId}`);
	};

	const renderedMessages = [
		...messages,
		...(isThinking ? [THINKING_MESSAGE] : []),
	].reverse();

	const isInputControlsDisabled = isThinking || isAnimating;

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
					alt="vault"
					style={{ objectFit: 'contain' }}
				/>
			</Button>

			<Collapse in={open}>
				<div style={{ width: 400 }}>
					<Card className="shadow overflow-hidden" style={{ height: 600 }}>
						<Card.Header className="d-flex align-items-center">
							<Card.Title className="my-1 flex-grow-1">DeFi Assistant</Card.Title>
							<ExpandButton onClick={onExpandChat} />
							<Button variant="close" onClick={() => setOpen(false)} />
						</Card.Header>

						<Card.Body className="overflow-x-hidden overflow-y-auto h-100">
							<div className="chatContent d-flex flex-column-reverse gap-2 h-100 overflow-y-auto pe-2">
								{renderedMessages.map((msg) => {
									if ('thinking' in msg && msg.thinking) {
										return <ChatThinking key="thinking" />;
									}

									return msg.from === 'user' ? (
										<ChatRight key={msg.id} content={msg.content} />
									) : (
										<ChatLeft
											key={msg.id}
											content={msg.content}
											animateChar={
												'typingAnimation' in msg && msg.typingAnimation === true
											}
											onAnimateStart={() => setIsAnimating(true)}
											onAnimateDone={() => setIsAnimating(false)}
										/>
									);
								})}
							</div>
						</Card.Body>

						<Card.Footer>
							<InputGroup>
								<Form.Control
									placeholder="Type to chat..."
									value={messageDraft}
									onChange={(e) => setMessageDraft(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSend()}
									disabled={isInputControlsDisabled}
								/>
								<Button
									variant="primary"
									onClick={handleSend}
									disabled={isInputControlsDisabled}
								>
									Send
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
