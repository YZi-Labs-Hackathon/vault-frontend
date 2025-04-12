import { useEffect, useState } from 'react';

const useThreeDots = () => {
	const [dots, setDots] = useState('');

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return [dots];
};

export default useThreeDots;
