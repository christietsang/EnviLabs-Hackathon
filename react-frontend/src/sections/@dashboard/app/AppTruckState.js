import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { VictoryPie, VictoryTheme, VictoryLabel } from 'victory';


// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// // ----------------------------------------------------------------------

AppTruckState.propTypes = {
  title: PropTypes.string,
};

const jsonObject = {
  "data":[
    {
      'state': "empty",
      'value': 30,
    },
    {
      'state': "queue_at_LU",
      'value': 30,
    },
    {
      'state': "spot_at_LU",
      'value': 10,
    },
    {
      'state': "truck_loading",
      'value': 10,
    },
    {
      'state': "non_productive",
      'value': 5,
    },
    {
      'state': "queuing_at_dump",
      'value': 5,
    },
    {
      'state': "dumping",
      'value': 10,
    },
]};

export default function AppTruckState({ title }) {

  function convertJsonObject(jsonObject) {
    return jsonObject.data.map(item => ({ x: item.state, y: item.value }));
  }

  const APIData = convertJsonObject(jsonObject)

  return (
    <Card>
      {console.log(APIData)}
      <CardHeader title={title}/>
      <StyledChartWrapper dir="ltr">
        <VictoryPie
          data={APIData}
          innerRadius={60}
          labelRadius={130}
          labels={({ datum }) => `${datum.y}%`}
          theme={VictoryTheme.material}
        />
        <VictoryPie
          data={APIData}
          innerRadius={60}
          labelRadius={120}
          labels={({ datum }) => `${datum.y}%`}
          theme={VictoryTheme.material}
        />
      </StyledChartWrapper>
    </Card>
  );
}
