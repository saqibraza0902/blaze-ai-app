import * as React from 'react';
import Svg, {Defs, ClipPath, Path, G, SvgProps} from 'react-native-svg';
export interface IProp extends SvgProps {
  fill?: string;
}

const RemoveUserIcon = (props: IProp) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 375 374.999991"
    preserveAspectRatio="xMidYMid meet"
    {...props}>
    <Defs>
      <ClipPath id="2bc13a793d">
        <Path
          d="M 51.902344 51.902344 L 323.402344 51.902344 L 323.402344 323.402344 L 51.902344 323.402344 Z M 51.902344 51.902344 "
          clipRule="nonzero"
        />
      </ClipPath>
    </Defs>
    <G clipPath="url(#2bc13a793d)">
      <Path
        fill="#e94b35"
        d="M 323.402344 187.652344 C 323.402344 262.597656 262.597656 323.402344 187.652344 323.402344 C 112.707031 323.402344 51.902344 262.597656 51.902344 187.652344 C 51.902344 112.707031 112.707031 51.902344 187.652344 51.902344 C 262.597656 51.902344 323.402344 112.707031 323.402344 187.652344 Z M 323.402344 187.652344 "
        fillOpacity={1}
        fillRule="evenodd"
      />
    </G>
    <Path
      fill="#ffffff"
      d="M 125.949219 175.3125 L 249.355469 175.3125 L 249.355469 199.992188 L 125.949219 199.992188 Z M 125.949219 175.3125 "
      fillOpacity={1}
      fillRule="evenodd"
    />
  </Svg>
);
export default RemoveUserIcon;
