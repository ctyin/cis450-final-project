import React from 'react';

const LogoSVG = (props) => (
  <svg viewBox="0 0 76.45 31.05" width="8em" height="8em" {...props}>
    <defs>
      <style>
        {
          '.cls-1{fill:#fff;}.cls-1,.cls-2{stroke:#231f20;stroke-miterlimit:10;}.cls-2{fill:none;}.cls-3{font-size:14px;fill:#059bd4;font-family:Baloo-Regular, Baloo;}.cls-4{fill:#231f20;}'
        }
      </style>
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className="cls-1"
          d="M49.57.5H27.34a2.79,2.79,0,0,0-2.4,1.36L19.4,11.18a2.7,2.7,0,0,1-2.32,1.32h-13a2.3,2.3,0,0,0-2.28,2L.56,25.13H13.14"
        />
        <path
          className="cls-2"
          d="M12.6,25.13a5.42,5.42,0,1,0,10.83,0H53.92a5.42,5.42,0,0,0,10.84,0H75.89l-1.25-10.6a2.29,2.29,0,0,0-2.28-2H61A5,5,0,0,1,56.7,10L51.93,1.86A2.74,2.74,0,0,0,49.57.5H27.34"
        />
        <text className="cls-3" transform="translate(16.54 20.98)">
          {'car'}
          <tspan className="cls-4" x={20.22} y={0}>
            {'bon'}
          </tspan>
        </text>
      </g>
    </g>
  </svg>
);

export default LogoSVG;
