import ContentLoader from 'react-content-loader';

interface CellSkeletonProps {
	width?: string | number;
	height?: string | number;
	backgroundColor?: string;
	foregroundColor?: string;
}

const CellSkeleton = (props: CellSkeletonProps) => {
	const {
		width = '100%',
		height = 20,
		backgroundColor = '#f0f0f0',
		foregroundColor = '#e0e0e0',
	} = props;

	return (
		<>
			<ContentLoader
				width={width}
				height={height}
				backgroundColor={backgroundColor}
				foregroundColor={foregroundColor}
			>
				<rect x="0" y="0" rx="4" ry="4" width={width} height={height} />
			</ContentLoader>
		</>
	);
};

export default CellSkeleton;
