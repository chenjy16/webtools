import { Box, Typography, Card, CardContent, Paper } from '@mui/material';
import AdBanner from './AdBanner';

export default function ToolLayout({ 
  title, 
  description, 
  adSlot, 
  children, 
  maxWidth = 800 
}) {
  return (
    <Box sx={{ maxWidth, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}

      {/* 工具上方广告 */}
      <AdBanner slot={adSlot} />

      <Paper 
        elevation={2} 
        sx={{ 
          mb: 4, 
          mt: 3, 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </CardContent>
      </Paper>
      
      {/* 工具下方广告 */}
      <AdBanner slot={adSlot} />
    </Box>
  );
}