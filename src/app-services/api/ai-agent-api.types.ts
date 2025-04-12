export interface AIChatParams {
	message: string;
	vaultId?: string;
}

export interface AIChatData {
	content: string[];
	requireSignature: boolean;
	dataToSign: string;
	contractAddress: string;
}
