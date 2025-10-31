import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

// interface (bauplan) structures this class, sets properties and types
// this class must recieve a prop DashboardProps
interface DashboardProps {
  // type: a function stat takes no arguments and returns nothing
  onSelectMap: () => void;
  isDataLoaded: boolean;
}

function Dashboard({ onSelectMap, isDataLoaded }: DashboardProps) {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom textAlign="center">
        Interactive Historical Perspectives on Hans Kelsen
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid>
          {/*here is where the Cards go*/}
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Map Project One
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Project discripion, can be a little bit longer maybe this long
                ...
              </Typography>
            </CardContent>
            <CardActions>
              {/* onClick calls the function passed down from App.tsx  -> onSelectMap but we only provide the function, the acctual call happens at runtime*/}
              <Button
                size="small"
                variant="contained"
                onClick={onSelectMap}
                disabled={!isDataLoaded}
              >
                {/* here should go the button text, but we whant it to be dynamic*/}
                {isDataLoaded ? "Open Map" : "Loading..."}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
