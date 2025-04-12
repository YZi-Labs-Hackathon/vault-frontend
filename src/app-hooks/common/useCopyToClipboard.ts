import copyToClipboard from 'copy-to-clipboard';
import { useState } from 'react';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [
	CopiedValue,
	CopyFn,
	React.Dispatch<React.SetStateAction<CopiedValue>>,
] {
	const [copiedText, setCopiedText] = useState<CopiedValue>(null);

	const copy: CopyFn = async (text) => {
		try {
			copyToClipboard(text);
			setCopiedText(text);
			return true;
		} catch (error) {
			console.warn('Copy failed', error);
			setCopiedText(null);
			return false;
		}
	};

	return [copiedText, copy, setCopiedText];
}
