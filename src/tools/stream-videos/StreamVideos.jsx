import { useState, useEffect } from 'react';
// Import necessary MUI components
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Container,
  Chip,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';

// Import icons
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MovieIcon from '@mui/icons-material/Movie'; // Example icon, kept
import LiveTvIcon from '@mui/icons-material/LiveTv';
import TheatersIcon from '@mui/icons-material/Theaters';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

// Streaming Website Data
const streamingWebsites = [
  { title: "eja", url: "https://eja.tv" },
  { title: "Hexa", url: "https://hexa.watch" },
  { title: "XPrime", url: "https://xprime.tv" },
  { title: "Vidora", url: "https://watch.vidora.su" },
  { title: "Vidbox", url: "https://vidbox.to" },
  { title: "Rive", url: "https://rivestream.org" },
  { title: "Rive 2", url: "https://rivestream.xyz" },
  { title: "Rive 3", url: "https://cinemaos-v2.vercel.app" },
  { title: "Rive 4", url: "https://rivestream.net" },
  { title: "uira.live", url: "https://uira.live" },
  { title: "Ronny Flix", url: "https://ronnyflix.xyz" },
  { title: "EliteFlix", url: "https://eliteflix.xyz" },
  { title: "SpenFlix", url: "https://watch.spencerdevs.xyz" },
  { title: "Cineby", url: "https://www.cineby.app" },
  { title: "Bitcine", url: "https://www.bitcine.app" },
  { title: "HydraHD", url: "https://hydrahd.sh" },
  { title: "Nunflix", url: "https://nunflix.org" },
  { title: "Nunflix 2", url: "https://nunflix-firebase.web.app" },
  { title: "Nunflix 3", url: "https://nunflix-ey9.pages.dev" },
  { title: "Nunflix 4", url: "https://nunflix-firebase.firebaseapp.com" },
  { title: "FlickyStream", url: "https://flickystream.com" },
  { title: "1Shows", url: "https://www.1shows.live" },
  { title: "RgShows", url: "https://www.rgshows.me" },
  { title: "PopcornMovies", url: "https://popcornmovies.to" },
  { title: "MovieMaze", url: "https://moviemaze.cc" },
  { title: "Mocine", url: "https://mocine.cam" },
  { title: "7Xtream", url: "https://movies.7xtream.com" },
  { title: "7Xtream 2", url: "https://cinema.7xtream.com" },
  { title: "7Xtream 3", url: "https://movies2.7xtream.com" },
  { title: "Bingeflex", url: "https://bingeflix.tv" },
  { title: "456movie", url: "https://456movie.net" },
  { title: "345movie", url: "https://345movie.net" },
  { title: "Mapple.tv", url: "https://mapple.tv" },
  { title: "AlienFlix", url: "https://alienflix.net" },
  { title: "CookedMovies", url: "https://cookedmovies.xyz" },
  { title: "Broflix", url: "https://broflix.si" },
  { title: "NetPlay", url: "https://netplayz.ru" },
  { title: "Arabflix", url: "https://www.arabiflix.com" },
  { title: "EnjoyTown", url: "https://enjoytown.pro" },
  { title: "Kaido", url: "https://kaido.cc" },
  { title: "Willow", url: "https://willow.arlen.icu" },
  { title: "Salix", url: "https://salix.pages.dev" },
  { title: "catflix", url: "https://catflix.su" },
  { title: "Soaper.TV", url: "https://soaper.top" },
  { title: "Soaper 2", url: "https://soaper.vip" },
  { title: "Soaper 3", url: "https://soaper.cc" },
  { title: "Soaper 4", url: "https://soaper.live" },
  { title: "StreamFlix", url: "https://watch.streamflix.one" },
  { title: "M-Zone", url: "https://www.m-zone.org" },
  { title: "Cinema Deck", url: "https://cinemadeck.com" },
  { title: "Cinema Deck 2", url: "https://cinemadeck.st" },
  { title: "Flicker", url: "https://flickermini.pages.dev" },
  { title: "Flicker 2", url: "https://flickeraddon.pages.dev" },
  { title: "Lekuluent", url: "https://lekuluent.et" },
  { title: "StigStream", url: "https://stigstream.com" },
  { title: "StigStream 2", url: "https://stigstream.xyz" },
  { title: "StigStream 3", url: "https://stigstream.co.uk" },
  { title: "EE3", url: "https://ee3.me" },
  { title: "Rips", url: "https://rips.cc" }
];

// Icon list for random assignment to website cards
const icons = [
  <TheatersIcon sx={{ fontSize: 40 }} />,
  <LiveTvIcon sx={{ fontSize: 40 }} />,
  <OndemandVideoIcon sx={{ fontSize: 40 }} />,
  <SmartDisplayIcon sx={{ fontSize: 40 }} />,
  <VideoLibraryIcon sx={{ fontSize: 40 }} />,
  <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
];

// Color list for random assignment to website cards
const colors = [
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#009688', // Teal
  '#4caf50', // Green
  '#ff5722', // Deep Orange
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#f44336', // Red
  '#e91e63', // Pink
  '#00bcd4'  // Cyan
];

export default function StreamingVideoDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showJsonData, setShowJsonData] = useState(false);

  // Filter websites based on search term (case-insensitive)
  const filteredWebsites = streamingWebsites.filter(site =>
    site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open website in a new tab
  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Get random icon based on index
  const getRandomIcon = (index) => {
    return icons[index % icons.length];
  };

  // Get random color based on index
  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };

  // Render website cards
  const renderWebsiteGrid = () => {
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {filteredWebsites.map((site, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index} sx={{ 
            display: 'flex',
            width: { lg: '20%' }
          }}> 
            <Card
              sx={{
                height: '100%', 
                width: '100%', 
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
                  cursor: 'pointer'
                },
                borderRadius: '12px',
                overflow: 'hidden',
              }}
              onClick={() => openWebsite(site.url)}
            >
              <Box sx={{
                bgcolor: getRandomColor(index),
                color: 'white',
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
                flexShrink: 0
              }}>
                {getRandomIcon(index)}
              </Box>
              <CardContent sx={{
                flexGrow: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'space-between',
                height: '100px',
              }}>
                <Typography
                  variant="h6"
                  component="h2"
                  align="center"
                  noWrap
                  title={site.title}
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    maxWidth: '100%',
                    fontSize: '1rem',
                  }}
                >
                  {site.title}
                </Typography>
                <Chip
                  label={site.url.replace(/^https?:\/\//, '').split('/')[0]}
                  size="small"
                  sx={{
                    mt: 0,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render the JSON data block
  const renderJsonData = () => {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, overflow: 'auto', maxHeight: '500px', mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Website Data (JSON Format)
        </Typography>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.9rem', color: '#333' }}>
          {JSON.stringify(streamingWebsites, null, 2)}
        </pre>
      </Paper>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ 
      py: 4,
      px: { xs: 1, sm: 2, md: 3 },
    }}>
      {/* Page title and description */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Online Streaming Video Directory
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse various streaming video websites, click on the card to directly access the corresponding website
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Search input */}
      <Box sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}>
        <TextField
          fullWidth
          label="Search websites..."
          placeholder="e.g., Hexa, Rive, net"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Content area */}
      <>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            px: 1
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Website List ({filteredWebsites.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowJsonData(!showJsonData)}
            >
              {showJsonData ? 'Hide JSON Data' : 'Show JSON Data'}
            </Button>
          </Box>
          {renderWebsiteGrid()}
          {filteredWebsites.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No matching websites found
            </Typography>
          )}
        </Box>

        {showJsonData && renderJsonData()}
      </>
    </Container>
  );
}