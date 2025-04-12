import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageRendererProps {
	content: string[] | React.ReactNode;
	charDelay?: number;
	lineDelay?: number;
	animateChar?: boolean;
	onAnimateStart?: () => void;
	onAnimateDone?: () => void;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
	content,
	charDelay = 10,
	lineDelay = 300,
	animateChar = false,
	onAnimateStart,
	onAnimateDone,
}) => {
	const [displayedLines, setDisplayedLines] = useState<string[]>([]);
	const [currentLine, setCurrentLine] = useState('');
	const [lineIndex, setLineIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);

	const lines: string[] = useMemo(() => {
		if (typeof content === 'string') return [content];
		if (Array.isArray(content)) {
			return content.flatMap((item) => item.split('\n'));
		}
		return [];
	}, [content]);

	useEffect(() => {
		if (!animateChar) {
			setDisplayedLines(lines);
			setCurrentLine('');
			return;
		}

		if (typeof content !== 'string' && !Array.isArray(content)) return;
		if (lineIndex >= lines.length) {
			onAnimateDone?.();
			return;
		}

		if (!hasStarted) {
			onAnimateStart?.();
			setHasStarted(true);
		}

		const currentFullLine = lines[lineIndex];

		if (charIndex <= currentFullLine.length) {
			const timeout = setTimeout(() => {
				setCurrentLine(currentFullLine.slice(0, charIndex));
				setCharIndex((prev) => prev + 1);
			}, charDelay);
			return () => clearTimeout(timeout);
		} else {
			const timeout = setTimeout(() => {
				setDisplayedLines((prev) => [...prev, currentFullLine]);
				setCurrentLine('');
				setCharIndex(0);
				setLineIndex((prev) => prev + 1);
			}, lineDelay);
			return () => clearTimeout(timeout);
		}
	}, [
		animateChar,
		charIndex,
		lineIndex,
		lines,
		charDelay,
		lineDelay,
		content,
		hasStarted,
		onAnimateStart,
		onAnimateDone,
	]);

	const renderMarkdown = (text: string, key?: React.Key) => {
		// Split on markdown image patterns, keep raw links handled by markdown itself
		const parts = text.split(/(\!\[[^\]]*\]\([^\)]+\))/g);

		return (
			<div key={key} className="line text-break">
				{parts.map((part, i) => (
					<ReactMarkdown
						key={i}
						components={{
							img: ({ alt, src }) => (
								<img
									src={src ?? ''}
									alt={alt ?? ''}
									loading="lazy"
									style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
								/>
							),
							a: ({ href, children }) => (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: '#0d6efd', textDecoration: 'underline' }}
								>
									{children}
								</a>
							),
						}}
					>
						{part}
					</ReactMarkdown>
				))}
			</div>
		);
	};

	if (typeof content !== 'string' && !Array.isArray(content)) {
		return <>{content}</>;
	}

	return (
		<div className="chat-reply-content">
			{displayedLines.map((line, i) => renderMarkdown(line, i))}
			{animateChar && currentLine && renderMarkdown(currentLine)}
		</div>
	);
};

export default MessageRenderer;
