import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";
import { SvgProps } from "react-native-svg";
interface SVGComponentProps extends SvgProps {}

const BlueBubbleIcon: React.FC<SVGComponentProps> = (props) => (
  <Svg viewBox="0 0 345 130" {...props}>
    <Defs>
      <ClipPath id="clip1">
        <Path
          fill={"red"}
          d="M 16.492188 62.980469 L 336.515625 62.980469 L 336.515625 135.949219 L 16.492188 135.949219 Z M 16.492188 62.980469 "
        />
      </ClipPath>
    </Defs>
    <G id="surface1">
      <G clipPath="url(#clip1)" clipRule="nonzero">
        <Path
          stroke="none"
          fillRule="nonzero"
          fillOpacity={1}
          fill="#68BEBF"
          d="M 300.058594 62.976562 L 52.941406 62.976562 C 32.8125 62.976562 16.492188 79.335938 16.492188 99.511719 C 16.492188 108.527344 19.753906 116.773438 25.15625 123.144531 C 21.8125 131.355469 16.492188 136.042969 16.492188 136.042969 C 23.65625 135.558594 30.0625 133.421875 34.902344 131.253906 C 40.222656 134.296875 46.378906 136.042969 52.941406 136.042969 L 300.058594 136.042969 C 320.191406 136.042969 336.511719 119.6875 336.511719 99.511719 C 336.511719 79.335938 320.191406 62.976562 300.058594 62.976562 "
        />
      </G>
    </G>
  </Svg>
);
export default BlueBubbleIcon;
