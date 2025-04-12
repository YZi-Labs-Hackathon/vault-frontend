import React, { useEffect, useMemo, useState } from 'react';

interface MessageRendererProps {
	content: string[] | React.ReactNode;
	charDelay?: number; // delay per character (ms)
	lineDelay?: number; // delay after line completes (ms)
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

	if (typeof content !== 'string' && !Array.isArray(content)) {
		return <>{content}</>;
	}

	return (
		<div>
			{displayedLines.map((line, i) => (
				<div key={i}>{line}</div>
			))}
			{animateChar && currentLine && <div>{currentLine}</div>}
		</div>
	);
};

export default MessageRenderer;
