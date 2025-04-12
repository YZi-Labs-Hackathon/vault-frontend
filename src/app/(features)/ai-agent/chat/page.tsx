'use client';
import { NoSsrLayout } from '@/app-components/layout/NoSsrLayout';
import AIAgentChat from '@/app-features/ai-agent/screens/AIAgentChat';

export default function AIAgentChatPage() {
	return (
		<NoSsrLayout>
			<AIAgentChat />
		</NoSsrLayout>
	);
}
