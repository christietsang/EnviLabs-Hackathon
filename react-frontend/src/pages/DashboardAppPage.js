import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// sections
import {
  AppNewsUpdate,
  AppTruckState,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppGoogleHeatmap
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const teckNews = [
  {title:"Teck Announces Appointment of Charlene Ripley as Senior Vice President and General Counsel",
  date: "January 5, 2023"},
  {title:"TotalEnergies Commences Proceedings Regarding Fort Hills Right of First Refusal",
  date: "December 23, 2022"},
  {title:"Teck Outlines Economic Contributions to Communities and Regions",
  date: "December 20, 2022"},
  {title:"Teck Announces Sale of Quintette Assets",
  date: "December 19, 2022"},
  {title:"Teck Announces Appointment of Greg Brouwer as SVP, Technology and Innovation",
  date: "December 15, 2022"},
]

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Teck Resources </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hello, welcome back!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Trucks" total={70} icon={'mdi:dump-truck'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Unique Paths" total={94} color="info" icon={'material-symbols:conversion-path'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Shovels" total={9} color="warning" icon={'material-symbols:front-loader-rounded'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Dumps" total={36} color="error" icon={'mdi:mountain'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTruckState
              title="Truck State by %"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWebsiteVisits
              title="Fuel Rate By Truck Type"
              subheader="Hauling and Overall"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Fuel Rate Prediction"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={teckNews.map((item, index) => ({
                id: index,
                title: item.title,
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                date: item.date,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppGoogleHeatmap />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
