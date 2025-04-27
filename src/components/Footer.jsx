import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ mt: 4, py: 3, textAlign: 'center', borderTop: '1px solid #eee' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} WebTools - 在线工具集
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        本网站使用 Google AdSense 提供的广告服务。
        <Link href="/privacy-policy" sx={{ ml: 1 }}>隐私政策</Link>
      </Typography>
    </Box>
  );
}