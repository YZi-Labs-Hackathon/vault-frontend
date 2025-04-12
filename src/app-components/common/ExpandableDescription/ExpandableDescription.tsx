import { useState } from 'react';

interface ExpandableDescriptionProps {
	id: string;
	text: string;
	amountOfWords?: number;
	more?: React.ReactNode;
	less?: React.ReactNode;
	className?: string;
	anchorClass?: string;
}

const ExpandableDescription = ({
	id,
	text,
	amountOfWords = 36,
	className,
	anchorClass,
	more = 'View more',
	less = 'View less',
}: ExpandableDescriptionProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const preprocessText = (input: string) => {
		return input.replace(/\n/g, '<br />');
	};

	// Function to count words in HTML string while preserving markup
	const countWords = (htmlString: string) => {
		if (!htmlString) {
			return 0;
		}
		const textContent = htmlString
			.replace(/<[^>]*>/g, ' ') // Replace tags with spaces
			.replace(/\s+/g, ' ') // Normalize whitespace
			.trim();
		return textContent.split(' ').length;
	};

	// Function to split HTML content at a logical boundary (word and line)
	const splitHtmlContent = (htmlString: string, wordLimit: number) => {
		const wrappedHtml = `<div>${htmlString}</div>`;
		const parser = new DOMParser();
		const doc = parser.parseFromString(wrappedHtml, 'text/html');
		let wordCount = 0;
		let splitNode: Node | null = null;
		let splitOffset = 0;
		let lastBlockNode: Node | null = null;

		const walker = document.createTreeWalker(
			doc.body.firstChild!,
			NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
		);
		while (walker.nextNode() && wordCount < wordLimit) {
			const node = walker.currentNode;

			if (node.nodeType === Node.TEXT_NODE) {
				const words = node.textContent?.split(/\s+/).filter(Boolean) || [];
				if (wordCount + words.length >= wordLimit) {
					const wordsToTake = wordLimit - wordCount;
					let charCount = 0;
					for (let i = 0; i < wordsToTake; i++) {
						charCount += words[i].length;
						if (i < wordsToTake - 1) charCount += 1;
					}
					splitNode = node;
					splitOffset = charCount;
					break;
				}
				wordCount += words.length;
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const tagName = (node as Element).tagName.toLowerCase();
				if (['p', 'div', 'li', 'ul', 'ol', 'br'].includes(tagName)) {
					lastBlockNode = node;
				}
			}
		}

		const range = document.createRange();
		range.selectNodeContents(doc.body.firstChild!);

		if (lastBlockNode && wordCount < wordLimit) {
			range.setEndAfter(lastBlockNode);
		} else if (splitNode) {
			range.setEnd(splitNode, splitOffset);
		}

		const beginContent = range.cloneContents();
		const beginDiv = document.createElement('div');
		beginDiv.appendChild(beginContent);
		let beginHtml = beginDiv.innerHTML;

		const endRange = document.createRange();
		endRange.selectNodeContents(doc.body.firstChild!);
		if (lastBlockNode && wordCount < wordLimit) {
			endRange.setStartAfter(lastBlockNode);
		} else if (splitNode) {
			endRange.setStart(splitNode, splitOffset);
		} else {
			endRange.setStartAfter(doc.body.firstChild!.lastChild || doc.body.firstChild!);
		}

		const endContent = endRange.cloneContents();
		const endDiv = document.createElement('div');
		endDiv.appendChild(endContent);
		let endHtml = endDiv.innerHTML;

		if (beginHtml.startsWith('<div>')) {
			beginHtml = beginHtml.slice(5, -6);
		}
		if (endHtml.startsWith('<div>')) {
			endHtml = endHtml.slice(5, -6);
		}

		return {
			begin: beginHtml || (wordCount < wordLimit ? htmlString : ''),
			end: endHtml || (wordCount >= wordLimit ? htmlString : ''),
		};
	};

	const preprocessedText = preprocessText(text);
	const totalWords = countWords(preprocessedText);
	const canOverflow = totalWords > amountOfWords;
	const { begin, end } = canOverflow
		? splitHtmlContent(preprocessedText, amountOfWords)
		: { begin: preprocessedText, end: '' };

	return (
		<div className={className}>
			<span dangerouslySetInnerHTML={{ __html: begin }} />
			{canOverflow && (
				<>
					<span
						className={`${!isExpanded ? 'd-none' : ''}`}
						aria-hidden={!isExpanded}
						dangerouslySetInnerHTML={{ __html: end }}
					/>
					<span
						className={anchorClass}
						role="button"
						tabIndex={0}
						aria-expanded={isExpanded}
						aria-controls={id}
						style={{
							cursor: 'pointer',
							marginLeft: '0.25em', // Small inline spacing
						}}
						onClick={() => setIsExpanded(!isExpanded)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								setIsExpanded(!isExpanded);
							}
						}}
					>
						{isExpanded ? less : more}
					</span>
				</>
			)}
		</div>
	);
};

export default ExpandableDescription;
