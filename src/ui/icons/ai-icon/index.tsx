import * as React from 'react';
import Svg, {Defs, ClipPath, Path, G} from 'react-native-svg';
import {SVGComponentProps} from '../knowledge-based-icon';
const AiIcon: React.FC<SVGComponentProps> = ({fill = '#fff', ...props}) => (
  <Svg viewBox="0 0 375 374.999991" {...props}>
    <Defs>
      <ClipPath id="a">
        <Path d="M9.41 51.336h356.25v272.25H9.41zm0 0" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#a)">
      <Path
        fill={fill}
        d="M161.55 217.445h-20.269c-8.582 0-15.601 7.024-15.601 15.602v20.27c0 8.578 7.02 15.601 15.601 15.601h20.27c8.578 0 15.601-7.023 15.601-15.602v-20.27c0-8.616-6.984-15.6-15.601-15.6M314.03 51.413v272.05h51.547V51.415zm-127.164 73.867c13.098 47.489 4.82 15.98 37.012 140.942l14.766 57.355h54.773L241.91 124.824c-12.68-48.926-39.062-73.41-79.601-73.41h-22.243c-40.312 0-66.96 24.484-79.64 73.563L9.41 323.465h54.625l51.016-198.563c4.21-16.285 13.703-24.332 28.203-24.332h15.676c14.16-.039 23.422 8.2 27.937 24.711"
        fillRule="evenodd"
      />
    </G>
  </Svg>
);

export default AiIcon;
