import * as React from 'react';
import Svg, {Defs, ClipPath, Path, G, SvgProps} from 'react-native-svg';
const InteruptIcon = (props: SvgProps) => (
  <Svg
    height={props.height}
    width={props.width}
    viewBox="0 0 375 374.999991"
    {...props}>
    <Defs>
      <ClipPath id="a">
        <Path d="M77.926 77.926h219v219h-219zm0 0" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#a)">
      <Path d="M187.426 77.926c-60.38 0-109.5 49.12-109.5 109.5 0 60.383 49.12 109.5 109.5 109.5 60.383 0 109.5-49.117 109.5-109.5 0-60.38-49.117-109.5-109.5-109.5zm54.75 148.61c0 8.6-7.04 15.64-15.64 15.64H148.32c-8.605 0-15.644-7.04-15.644-15.64V148.32c0-8.605 7.039-15.644 15.644-15.644h78.215c8.602 0 15.64 7.039 15.64 15.644zM148.32 148.32h78.215v78.215H148.32zm0 0" />
    </G>
  </Svg>
);
export default InteruptIcon;
