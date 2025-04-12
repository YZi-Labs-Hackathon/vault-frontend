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
		backgroundColor = '#333',
		foregroundColor = '#555',
	} = props;
	return (
		<div>
			<ContentLoader
				width={width}
				height={height}
				backgroundColor={backgroundColor}
				foregroundColor={foregroundColor}
			>
				<rect x="0" y="0" rx="4" ry="4" width={width} height={height} />
			</ContentLoader>
		</div>
	);
};

export default CellSkeleton;
