import AIAgentChat from '@/app-features/ai-agent/screens/AIAgentChat';
import { ServerPropsWithLocale } from '@/app-types/common';

export default async function AIAgentChatPage({
	params,
}: ServerPropsWithLocale<{}, { session_id: string }>) {
	const { session_id } = await params;
	return <AIAgentChat sessionId={session_id} />;
}
