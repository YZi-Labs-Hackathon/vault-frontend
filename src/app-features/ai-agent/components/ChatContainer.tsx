import { THINKING_MESSAGE, useChatSession } from '@/app-hooks/ai-agent';
import { ChatMessage } from '@/app-types/ai-agent';
import { noop } from 'lodash';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Card, Image, InputGroup } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import { useActiveAccount } from 'thirdweb/react';
import ChatInput from './ChatInput';
import MessageAction from './MessageAction';
import MessageRenderer from './MessageRenderer';

// Bot message
const ChatLeft = memo(({ msg, onAnimateStart, onAnimateDone, onExecuteAction }: any) => {
	const [isShowAction, setIsShowAction] = useState(msg.typingAnimation ? false : true);
	const { content, typingAnimation, action } = msg as ChatMessage;

	const _onAnimateDone = () => {
		setIsShowAction(true);
		onAnimateDone();
	};

	return (
		<div className="d-flex gap-2 align-items-end">
			<Image
				src="/vault_icon.png"
				width={24}
				height={20}
				alt="vault"
				className="flex-shrink-0 mb-1"
			/>
			<div className="rounded-3 px-3 py-2 bg-light text-break">
				<MessageRenderer
					content={content}
					animateChar={typingAnimation}
					onAnimateStart={onAnimateStart}
					onAnimateDone={_onAnimateDone}
				/>
				{action && isShowAction ? (
					<MessageAction onExecuteAction={onExecuteAction} />
				) : null}
			</div>
		</div>
	);
});

// User message
const ChatRight = memo(({ msg }: any) => (
	<div className="d-flex gap-2 align-items-end">
		<div className="rounded-3 px-3 py-2 bg-primary text-white ms-auto text-break">
			<MessageRenderer content={msg.content} />
		</div>
	</div>
));

const ChatThinking = memo<any>(() => (
	<ChatLeft
		msg={{ content: <BeatLoader size={6} />, typingAnimation: false }}
		onAnimateStart={noop}
		onAnimateDone={noop}
		onExecuteAction={noop}
	/>
));

interface ChatContainerProps {
	sessionId: string;
	vaultId?: string;
}

// Main chat component
const ChatContainer: React.FC<ChatContainerProps> = ({ sessionId, vaultId }) => {
	const account = useActiveAccount();
	const [isAnimating, setIsAnimating] = useState(false);

	const {
		messages,
		messageDraft,
		setMessageDraft,
		isThinking,
		commitMessageDraft,
		executeAction,
	} = useChatSession(sessionId, {
		vaultId,
	});
	const renderedMessages = useMemo(() => {
		return [...messages, ...(isThinking ? [THINKING_MESSAGE] : [])].reverse();
	}, [messages, isThinking]);
	const isInputControlsDisabled = isThinking || isAnimating;

	const handleAnimateStart = useCallback(() => setIsAnimating(true), []);
	const handleAnimateDone = useCallback(() => setIsAnimating(false), []);
	const handleExecuteAction = useCallback(
		(msg: ChatMessage) => executeAction(msg),
		[executeAction],
	);

	if (!account) {
		return null;
	}

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
							<ChatRight key={msg.id} msg={msg} />
						) : (
							<ChatLeft
								key={msg.id}
								msg={msg}
								onAnimateStart={handleAnimateStart}
								onAnimateDone={handleAnimateDone}
								onExecuteAction={handleExecuteAction.bind(null, msg as ChatMessage)}
							/>
						);
					})}
				</div>
			</Card.Body>

			<Card.Footer className="py-3">
				<InputGroup>
					<ChatInput
						value={messageDraft}
						onChange={(e) => setMessageDraft(e.target.value)}
						onSubmit={commitMessageDraft}
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
