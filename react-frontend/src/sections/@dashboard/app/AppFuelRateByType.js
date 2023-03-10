import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryAxis } from 'victory';


const haulingFuelRates = {"data":{"hauling":[{"fuel_rate":205.0365525808979,"truck_type":"0"},{"fuel_rate":205.08348484249228,"truck_type":"1"},{"fuel_rate":203.92440101721795,"truck_type":"3"}],"non_hauling":[{"fuel_rate":197.91279453606396,"truck_type":"0"},{"fuel_rate":197.83919995944515,"truck_type":"1"},{"fuel_rate":197.47581229210033,"truck_type":"3"}]}}

export default function AppFuelRateByType() {
  
  const sharedAxisStyles = {
    tickLabels: {
      fontSize: 13
    },
    axisLabel: {
      padding: 35,
      fontSize: 13,
      fontStyle: "italic"
    }
  };
  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [190, 206] }}
      >
        <VictoryGroup horizontal
          offset={13}
          style={{ data: { width: 12 } }}
          colorScale={"qualitative"}
        >
          <VictoryBar
            data={[
              { y: haulingFuelRates.data.hauling[0].fuel_rate, x: haulingFuelRates.data.hauling[0].truck_type },
              { y: haulingFuelRates.data.hauling[1].fuel_rate, x: haulingFuelRates.data.hauling[1].truck_type },
              { y: haulingFuelRates.data.hauling[2].fuel_rate, x: haulingFuelRates.data.hauling[2].truck_type },
            ]}
          />
          <VictoryBar
            data={[
              { y: haulingFuelRates.data.non_hauling[0].fuel_rate, x: haulingFuelRates.data.non_hauling[0].truck_type },
              { y: haulingFuelRates.data.non_hauling[1].fuel_rate, x: haulingFuelRates.data.non_hauling[1].truck_type },
              { y: haulingFuelRates.data.non_hauling[2].fuel_rate, x: haulingFuelRates.data.non_hauling[2].truck_type },
            ]}
          />
        </VictoryGroup>
        <VictoryAxis 
            label="Total # of Songs"
            style={sharedAxisStyles}
          />
        <VictoryAxis
            dependentAxis
            label="Avg Fuel Consumption (l/hour)"
            style={sharedAxisStyles}
          />
      </VictoryChart>
    </div>
  );
}





