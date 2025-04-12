'use client';

import { THINKING_MESSAGE, useChatSession } from '@/app-hooks/ai-agent';
import { ChatMessage } from '@/app-types/ai-agent';
import { noop } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Card, Collapse, InputGroup } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import { useActiveAccount } from 'thirdweb/react';
import ChatInput from './ChatInput';
import MessageAction from './MessageAction';
import MessageRenderer from './MessageRenderer';

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

const ChatRight = memo(({ msg }: any) => (
	<div className="d-flex gap-2 align-items-end">
		<div className="rounded-3 px-3 py-2 bg-primary text-white ms-auto text-break">
			<MessageRenderer content={msg.content} />
		</div>
	</div>
));

const ChatThinking = memo(() => (
	<ChatLeft
		msg={{ content: <BeatLoader size={6} />, typingAnimation: false }}
		onAnimateStart={noop}
		onAnimateDone={noop}
		onExecuteAction={noop}
	/>
));

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
	const account = useActiveAccount();

	const [open, setOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const {
		messages,
		messageDraft,
		setMessageDraft,
		isThinking,
		commitMessageDraft,
		executeAction,
	} = useChatSession({
		vaultId,
	});

	const handleSend = async () => {
		if (!messageDraft.trim() || isThinking || isAnimating) return;
		await commitMessageDraft();
	};

	const onExpandChat = () => {
		router.push(`/ai-agent/chat?vault_id=${vaultId}`);
	};

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

						<Card.Footer>
							<InputGroup>
								<ChatInput
									value={messageDraft}
									onChange={(e) => setMessageDraft(e.target.value)}
									onSubmit={commitMessageDraft}
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
