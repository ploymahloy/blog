interface InProgressStampProps {
	id: string;
}

const STAMP_COLOR = '#fbbf24';

export function InProgressStamp({ id }: InProgressStampProps) {
	const filterId = `${id}-stamp-distress`;

	return (
		<div className='pointer-events-none absolute right-5 bottom-5 z-10' aria-hidden>
			<svg
				viewBox='0 0 220 88'
				className='w-40 -rotate-[17deg]'
				fill='none'
				role='presentation'
				xmlns='http://www.w3.org/2000/svg'>
				<defs>
					<filter id={filterId} x='-20%' y='-20%' width='140%' height='140%' colorInterpolationFilters='sRGB'>
						<feTurbulence type='fractalNoise' baseFrequency='0.05 0.09' numOctaves='3' seed='6' result='warpNoise' />
						<feDisplacementMap in='SourceGraphic' in2='warpNoise' scale='2' xChannelSelector='R' yChannelSelector='G' />
					</filter>
				</defs>

				<g filter={`url(#${filterId})`}>
					<rect x='6' y='6' width='208' height='76' rx='5' stroke={STAMP_COLOR} strokeWidth='3.5' fill='none' />
					<text
						x='110'
						y='52'
						textAnchor='middle'
						fill={STAMP_COLOR}
						fontSize='23'
						fontWeight='800'
						letterSpacing='2.5'
						fontFamily='ui-sans-serif, system-ui, sans-serif'>
						IN PROGRESS
					</text>
				</g>
			</svg>
		</div>
	);
}
