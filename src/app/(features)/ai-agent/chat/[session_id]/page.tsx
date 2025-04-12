'use client';
import { NoSsrLayout } from '@/app-components/layout/NoSsrLayout';
import AIAgentChat from '@/app-features/ai-agent/screens/AIAgentChat';
import { ServerPropsWithLocale } from '@/app-types/common';
import { useParams } from 'next/navigation';

export default function AIAgentChatPage() {
	const { session_id } = useParams<{ session_id: string }>();
	return (
		<NoSsrLayout>
			<AIAgentChat sessionId={session_id} />
		</NoSsrLayout>
	);
}
