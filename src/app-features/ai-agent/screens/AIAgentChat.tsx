'use client';

import { PageContainer } from '@/app-components/layout/PageContainer';
import { useUrlQuery } from '@/app-hooks/common';
import { Breadcrumb, Container } from 'react-bootstrap';
import ChatContainer from '../components/ChatContainer';

interface AIAgentChatProps {
	sessionId: string;
}

const AIAgentChat: React.FC<AIAgentChatProps> = ({ sessionId }) => {
	const { vault_id: vaultId } = useUrlQuery();
	return (
		<PageContainer>
			<Container className="pt-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item active>DeFi Assistant</Breadcrumb.Item>
				</Breadcrumb>
				<section>
					<h1 className="mb-4">DeFi Assistant</h1>
					<ChatContainer sessionId={sessionId} vaultId={vaultId} />
				</section>
			</Container>
		</PageContainer>
	);
};

export default AIAgentChat;
