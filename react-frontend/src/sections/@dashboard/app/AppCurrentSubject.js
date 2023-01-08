import {useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { styled } from '@mui/material/styles';
import { Card, CardHeader, TextField, Button, Grid, MenuItem, Select, InputLabel } from '@mui/material';
// components
import AppWidgetSummary from './AppWidgetSummary';


// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;

const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
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

// ----------------------------------------------------------------------

AppCurrentSubject.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const fuelPredictionEndpoint = 'http://127.0.0.1:5000/api/predict_fuel_rate';

export default function AppCurrentSubject({ title, subheader, chartData, chartColors, chartLabels, ...other }) {
  const [tructId, setTruckId] = useState('');
  const [truckTypeId, setTruckTypeId] = useState('');
  const [payload, setPayload] = useState('');
  const [status, setStatus] = useState('Dumping');
  const [preductedFuelRate, setPredictedFuelRate] = useState();

  const handleButtonClick = () => {
    const data = {
      truck_id: tructId,
      truck_type_id: truckTypeId,
      payload,
      status
    }

    axios.post(fuelPredictionEndpoint, data)
    .then((response) => {
      const preductedFuelRate = response.data.predicted_fuel_rate;
      setPredictedFuelRate(preductedFuelRate);
    }, (error) => {
      console.log(error);
    });
  }

  const createDropDown = () => {
    const numsList = ["Dumping", "Hauling", "Empty", "NON_PRODUCTIVE", "Queue At LU", "Queuing at Dump", "Spot at LU", "Truck Loading"]
    return numsList.map((item) => {
      return <MenuItem value={item} key={item}>{item}</MenuItem>
    })
  }
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

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Grid container spacing={3} padding={2}>
        <Grid item xs={12} md={6}>
        <TextField id="outlined-basic" label="truck-id" variant="outlined" name="truck-id" value={tructId} onChange={(e) => setTruckId(e.target.value)}/>
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField id="outlined-basic" label="truck-type-id" variant="outlined" name="truck-type-id" value={truckTypeId} onChange={(e) => setTruckTypeId(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField id="outlined-basic" label="payload" variant="outlined" name="payload" value={payload} onChange={(e) => setPayload(e.target.value)}/>
        </Grid>
        <Grid item xs={12} md={6}>
        {/* <InputLabel id="demo-simple-select-label">Status</InputLabel> */}
        <Select

            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
            MenuProps={MenuProps}
          >
            {createDropDown()}
          </Select>
        {/* <TextField id="outlined-basic" label="status" variant="outlined" name="status" value={status} onChange={(e) => setStatus(e.target.value)} /> */}
        </Grid>
        <Grid item xs={12} md={6}>
        <Button variant="contained" onClick={handleButtonClick}>Predict</Button>
        </Grid>
        <Grid item xs={12} md={6}>
        <AppWidgetSummary title="Predicted Fuel Rate" total={preductedFuelRate} icon={'mdi:dump-truck'} />
        </Grid>
      </Grid>
    </Card>
  );
}
