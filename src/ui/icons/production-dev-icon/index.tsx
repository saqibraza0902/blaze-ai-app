import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

import {SVGComponentProps} from '../knowledge-based-icon';
const ProductionDevIcon: React.FC<SVGComponentProps> = ({fill, ...props}) => (
  <Svg viewBox="0 0 1024 1024" {...props}>
    <Path
      fill={fill}
      d="M128 384v448h768V384H128zm-32-64h832a32 32 0 0132 32v512a32 32 0 01-32 32H96a32 32 0 01-32-32V352a32 32 0 0132-32zM160 192h704v64H160zm96-128h512v64H256z"
    />
  </Svg>
);
export default ProductionDevIcon;
