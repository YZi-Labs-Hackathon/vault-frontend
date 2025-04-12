'use client';

import { PageContainer } from '@/app-components/layout/PageContainer';
import { useOnEventCallback, useUrlQuery } from '@/app-hooks/common';
import { useRef } from 'react';
import { Breadcrumb, Button, Container } from 'react-bootstrap';
import ChatContainer, { ChatContainerHandle } from '../components/ChatContainer';

interface AIAgentChatProps {}

const AIAgentChat: React.FC<AIAgentChatProps> = () => {
	const { vault_id: vaultId } = useUrlQuery();
	const chatRef = useRef<ChatContainerHandle>(null);

	const onClearChatHistory = useOnEventCallback(() => {
		chatRef.current?.clearMessages();
	});

	return (
		<PageContainer>
			<Container className="pt-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item active>DeFi Assistant</Breadcrumb.Item>
				</Breadcrumb>
				<section>
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h1>DeFi Assistant</h1>
						<Button variant="outline-dark" onClick={onClearChatHistory}>
							Clear history
						</Button>
					</div>
					<ChatContainer ref={chatRef} vaultId={vaultId} />
				</section>
			</Container>
		</PageContainer>
	);
};

export default AIAgentChat;
