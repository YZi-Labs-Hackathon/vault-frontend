import { THINKING_MESSAGE, useChatSession } from '@/app-hooks/ai-agent';
import { Button, Card, Form, Image, InputGroup } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import MessageRenderer from './MessageRenderer';
import { noop } from 'lodash';
import { useState } from 'react';

// Bot message
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

// User message
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
		onAnimateStart={noop}
		onAnimateDone={noop}
	/>
);

interface ChatContainerProps {
	sessionId: string;
	vaultId?: string;
}

// Main chat component
const ChatContainer: React.FC<ChatContainerProps> = ({ sessionId, vaultId }) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const { messages, messageDraft, setMessageDraft, isThinking, commitMessageDraft } =
		useChatSession(sessionId, {
			vaultId,
		});
	const renderedMessages = [
		...messages,
		...(isThinking ? [THINKING_MESSAGE] : []),
	].reverse();
	const isInputControlsDisabled = isThinking || isAnimating;

	return (
		<Card
			className="chatBox overflow-hidden shadow-sm rounded-4"
			style={{ height: 'calc(100dvh - 240px)' }}
		>
			<Card.Body className="overflow-x-hidden overflow-y-auto h-100">
				<div className="chatContent d-flex flex-column-reverse gap-2 h-100 overflow-y-auto px-4">
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
								animateChar={'typingAnimation' in msg && msg.typingAnimation === true}
								onAnimateStart={() => setIsAnimating(true)}
								onAnimateDone={() => setIsAnimating(false)}
							/>
						);
					})}
				</div>
			</Card.Body>

			<Card.Footer className="py-3">
				<InputGroup>
					<Form.Control
						placeholder="Type to chat ..."
						value={messageDraft}
						onChange={(e) => setMessageDraft(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && commitMessageDraft()}
						disabled={isInputControlsDisabled}
					/>
					<Button
						variant="primary"
						onClick={commitMessageDraft}
						disabled={isInputControlsDisabled}
					>
						Send
					</Button>
				</InputGroup>
			</Card.Footer>
		</Card>
	);
};

export default ChatContainer;
