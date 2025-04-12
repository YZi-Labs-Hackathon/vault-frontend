export interface AIChatParams {
	message: string;
	llmModel?: 'CLAUDE' | 'OPENAI';
	vaultId?: string;
}

export interface AIChatData {
	content: string[];
	requireSignature: boolean;
	dataToSign: string;
	contractAddress: string;
}
