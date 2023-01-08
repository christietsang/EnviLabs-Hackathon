import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { VictoryPie, VictoryTheme, VictoryLabel } from 'victory';
import axios from 'axios'
import React, { useState, useEffect } from 'react'

// ----------------------------------------------------------------------

const CHART_HEIGHT = 500;
const LEGEND_HEIGHT = 90;

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

const baseURL = "http://127.0.0.1:5000/api/truck_status_count/1"


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

  const [post, setPost] = useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response => {
      setPost(response.data);
    }))
  }, []);
  
  if (!post) return null;

  function convertJsonObject(object) {
    return object.data.map(item => ({ x: item.status, y: Number(item.value.toFixed(1))}));
  }

  const APIData = convertJsonObject(post)

  return (
    <Card>
      <CardHeader title={title}/>
      <StyledChartWrapper dir="ltr">
        <svg viewBox="-50 -40 450 450">
          <VictoryPie
            data={APIData}
            colorScale="qualitative"
            innerRadius={60}
            labelRadius={180}
            standalone={false}
            origin={{ x: 150, y: 160 }}
            sortOrder="ascending"
            labelPlacement={({ index }) => index
            ? "vertical"
            : "vertical"
            }
          />
          <VictoryPie
            data={APIData}
            colorScale="qualitative"
            innerRadius={60}
            labelRadius={100}
            standalone={false}
            labels={({ datum }) => `${datum.y}%`}
            origin={{ x: 150, y: 160 }}
            sortOrder="ascending"
          />
        </svg>

      </StyledChartWrapper>
    </Card>
  );
}
