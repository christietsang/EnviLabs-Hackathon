import PropTypes from 'prop-types';
import { Card, CardHeader, Box } from '@mui/material';
import AppFuelRateByType from './AppFuelRateByType';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppWebsiteVisits({ title, subheader }) {
 
  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 2, pb: 1 }} dir="ltr">
        <AppFuelRateByType title="Fuel Rate By Type" />
      </Box>
    </Card>
  );
}
