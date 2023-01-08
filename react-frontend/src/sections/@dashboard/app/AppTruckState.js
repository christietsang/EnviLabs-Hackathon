import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { VictoryPie } from 'victory';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, FormControl, Select, InputLabel, MenuItem, CircularProgress } from '@mui/material';

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};


export default function AppTruckState({ title }) {


  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [truckID, setTruckID] = useState(1)

  const baseURL = `http://127.0.0.1:5000/api/truck_status_count/${truckID}`


  const handleChange = (event) => {
    setIsLoading(true);
    setTruckID(event.target.value);
  }

  React.useEffect(() => {
    console.log(baseURL)
    axios.get(baseURL).then((response => {
      console.log(response.data)
      setPost(response.data);
      setIsLoading(false);
    }))
  }, [truckID]);

  if (!post) return null;

  function convertJsonObject(object) {
    return object.data.map(item => ({ x: item.status, y: Number(item.value.toFixed(1)) }));
  }

  const APIData = convertJsonObject(post)

  const createDropDown = () => {
    const numsList = [...Array(69).keys()]
    return numsList.map((item) => {
      return <MenuItem value={item} key={item}>{item}</MenuItem>
    })
  }

  return (
    <Card>
      <CardHeader title={title} />
      <StyledChartWrapper dir="ltr">
        <div>
        <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
          <InputLabel id="demo-simple-select-label">Truck ID</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={truckID}
            label="Age"
            defaultValue={0}
            onChange={handleChange}
            MenuProps={MenuProps}
          >
            {createDropDown()}
          </Select>
        </FormControl>
        </div>
        { !isLoading && <svg viewBox="-270 0 800 400">
          <VictoryPie
            data={APIData}
            colorScale="qualitative"
            innerRadius={60}
            labelRadius={180}
            standalone={false}
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
            sortOrder="ascending"
          />
        </svg> }
          {isLoading && <CircularProgress />}
      </StyledChartWrapper>
    </Card>
  );
}
