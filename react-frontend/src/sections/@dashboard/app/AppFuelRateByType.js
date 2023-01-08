import React, { useState, useEffect } from 'react'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup } from 'victory';


const haulingFuelRates = [
  { x: 1, y: 2.3 },
  { x: 2, y: 2.3 },
  { x: 3, y: 2.3 },
  { x: 4, y: 2.3 },
  { x: 5, y: 2.3 },
]

export default function AppFuelRateByType() {
  
  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [0.5, 5.5] }}
      >
          <VictoryGroup horizontal
            offset={10}
            style={{ data: { width: 6 } }}
            colorScale={"qualitative"}
          >
            <VictoryBar
              data={[
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
                { x: 4, y: 2 },
                { x: 5, y: 1 }
              ]}
            />
            <VictoryBar
              data={[
                { x: 1, y: 2 },
                { x: 1, y: 3 },
                { x: 3, y: 4 },
                { x: 4, y: 5 },
                { x: 5, y: 5 }
              ]}
            />
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}