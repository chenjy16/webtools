import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Container,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import TheatersIcon from '@mui/icons-material/Theaters';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DiscFullIcon from '@mui/icons-material/DiscFull';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import BuildIcon from '@mui/icons-material/Build';

// 视频工具网站数据 - 已移除不可访问的URL
const videoToolsData = {
  "Video Tools": [ 
    { 
      "title": "Reincubate Camo", 
      "url": "https://reincubate.com/camo/" 
    }, 
    { 
      "title": "SimSwap", 
      "url": "https://github.com/neuralchen/SimSwap" 
    }, 
    { 
      "title": "Roop", 
      "url": "https://github.com/s0md3v/Roop" 
    }, 
    { 
      "title": "VideoHelp Forum", 
      "url": "https://forum.videohelp.com/" 
    }, 
    { 
      "title": "videoduplicatefinder", 
      "url": "https://github.com/0x90d/videoduplicatefinder" 
    }, 
    { 
      "title": "VidClue", 
      "url": "https://vidclue.com/" 
    } 
  ], 
  "Disc Utilities": [ 
    { 
      "title": "ImgBurn", 
      "url": "https://www.majorgeeks.com/files/details/imgburn.html" 
    }, 
    { 
      "title": "DVDStyler", 
      "url": "https://www.dvdstyler.org/" 
    }, 
    { 
      "title": "Alcohol Soft", 
      "url": "https://www.alcohol-soft.com/" 
    }, 
    { 
      "title": "MakeMKV", 
      "url": "https://www.makemkv.com/" 
    }, 
    { 
      "title": "VidCoder", 
      "url": "https://vidcoder.net/" 
    }, 
    { 
      "title": "PgcDemux", 
      "url": "https://www.videohelp.com/software/PgcDemux" 
    }
  ], 
  "Video File Hosts": [ 
    { 
      "title": "DoodStream", 
      "url": "https://doodstream.com/" 
    }, 
    { 
      "title": "Litterbox", 
      "url": "https://litterbox.catbox.moe/" 
    }, 
    { 
      "title": "Catbox", 
      "url": "https://catbox.moe/" 
    }, 
    { 
      "title": "Gofile", 
      "url": "https://gofile.io/" 
    }, 
    { 
      "title": "Pixeldrain", 
      "url": "https://pixeldrain.com/" 
    }, 
    { 
      "title": "VOE", 
      "url": "https://voe.sx/" 
    }, 
    { 
      "title": "MixDrop", 
      "url": "https://mixdrop.ag/" 
    }, 
    { 
      "title": "FEX.NET", 
      "url": "https://fex.net/" 
    }, 
    { 
      "title": "FileMoon", 
      "url": "https://filemoon.sx/" 
    }, 
    { 
      "title": "Fastupload.io", 
      "url": "https://fastupload.io/" 
    }, 
    { 
      "title": "Vidoza", 
      "url": "https://vidoza.net/" 
    }, 
    { 
      "title": "Streamtape", 
      "url": "https://streamtape.com/" 
    }, 
    { 
      "title": "Streamable", 
      "url": "https://streamable.com/" 
    }, 
    { 
      "title": "uguu", 
      "url": "https://uguu.se/" 
    }, 
    { 
      "title": "webmshare", 
      "url": "https://webmshare.com/" 
    }, 
    { 
      "title": "Videy", 
      "url": "https://videy.co/" 
    } 
  ], 
  "Screen Recording": [ 
    { 
      "title": "OBS", 
      "url": "https://obsproject.com/" 
    }, 
    { 
      "title": "gifcap", 
      "url": "https://gifcap.dev/" 
    }, 
    { 
      "title": "licecap", 
      "url": "https://www.cockos.com/licecap/" 
    }, 
    { 
      "title": "Shinobi", 
      "url": "https://shinobi.video/" 
    }, 
    { 
      "title": "MythTV", 
      "url": "https://www.mythtv.org/" 
    }, 
    { 
      "title": "tldv", 
      "url": "https://tldv.io/" 
    }, 
    { 
      "title": "FFmpeg", 
      "url": "https://ffmpeg.org/" 
    }, 
    { 
      "title": "Vileo", 
      "url": "https://lukasbach.github.io/Vileo/" 
    }, 
    { 
      "title": "Shar.ec", 
      "url": "https://shar.ec/" 
    }, 
    { 
      "title": "ScreenREC", 
      "url": "https://screen-rec.vercel.app/" 
    }, 
    { 
      "title": "RecordScreen", 
      "url": "https://recordscreen.io/" 
    }, 
    { 
      "title": "vokoscreenNG", 
      "url": "https://github.com/vkohaupt/vokoscreenNG" 
    }, 
    { 
      "title": "Google Screen Recorder", 
      "url": "https://toolbox.googleapps.com/apps/screenrecorder/" 
    } 
  ], 
  "Processing / Encoding": [ 
    { 
      "title": "HandBrake", 
      "url": "https://handbrake.fr/" 
    }, 
    { 
      "title": "Shutter Encoder", 
      "url": "https://www.shutterencoder.com/en/" 
    }, 
    { 
      "title": "StaxRip", 
      "url": "https://github.com/staxrip/staxrip" 
    }, 
    { 
      "title": "Avidemux", 
      "url": "https://avidemux.sourceforge.net/" 
    }, 
    { 
      "title": "FFmpeg", 
      "url": "https://ffmpeg.org/" 
    }, 
    { 
      "title": "Hybrid", 
      "url": "https://www.selur.de/" 
    }, 
    { 
      "title": "MeGUI", 
      "url": "https://sourceforge.net/projects/megui/" 
    }, 
    { 
      "title": "VidCoder", 
      "url": "https://vidcoder.net/" 
    }, 
    { 
      "title": "XMedia Recode", 
      "url": "https://www.xmedia-recode.de/" 
    } 
  ]
};

// 图标列表，用于随机分配给网站卡片
const categoryIcons = {
  "Video Tools": <MovieIcon sx={{ fontSize: 40 }} />,
  "Disc Utilities": <DiscFullIcon sx={{ fontSize: 40 }} />,
  "Video File Hosts": <CloudUploadIcon sx={{ fontSize: 40 }} />,
  "Screen Recording": <ScreenShareIcon sx={{ fontSize: 40 }} />,
  "Processing / Encoding": <BuildIcon sx={{ fontSize: 40 }} />
};

// 颜色列表，用于随机分配给网站卡片
const colors = [
  '#3f51b5', // 靛蓝色
  '#2196f3', // 蓝色
  '#009688', // 青色
  '#4caf50', // 绿色
  '#ff5722', // 深橙色
  '#9c27b0', // 紫色
  '#673ab7', // 深紫色
  '#f44336', // 红色
  '#e91e63', // 粉色
  '#00bcd4'  // 青色
];

export default function VideoTools() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const categories = Object.keys(videoToolsData);

  // 根据搜索词过滤网站（不区分大小写）
  const filterWebsites = (category) => {
    return videoToolsData[category].filter(site =>
      site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 在新标签页中打开网站
  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 根据索引获取随机颜色
  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };

  // 处理标签页变更
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 渲染网站卡片网格
  const renderWebsiteGrid = (category) => {
    const filteredSites = filterWebsites(category);
    
    return (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {filteredSites.map((site, index) => (
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={index} sx={{ 
            display: 'flex',
            width: { md: '25%', lg: '25%', xl: '25%' } // 固定为25%宽度，确保一行四列
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
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              onClick={() => openWebsite(site.url)}
            >
              <Box sx={{
                bgcolor: getRandomColor(index),
                color: 'white',
                p: 1.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70px', // 减小顶部区域高度
                flexShrink: 0
              }}>
                {categoryIcons[category] || <MovieIcon sx={{ fontSize: 36 }} />}
              </Box>
              <CardContent sx={{
                flexGrow: 1,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'space-between',
                minHeight: '90px', // 增加内容区域最小高度
                height: 'auto', // 改为自动高度，确保内容完全显示
              }}>
                <Typography
                  variant="subtitle1"
                  component="h2"
                  align="center"
                  title={site.title}
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5, // 增加底部外边距
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box', // 允许多行显示
                    WebkitLineClamp: 2, // 最多显示2行
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2, // 减小行高
                    fontSize: '0.9rem', // 调整字体大小
                    height: 'auto', // 自动高度
                  }}
                >
                  {site.title}
                </Typography>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                    mt: 'auto' // 将按钮推到底部
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openWebsite(site.url);
                  }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
      Video Tools Directory
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
      A collection of practical tool websites for video processing, recording, encoding, and hosting to help you handle video content more efficiently.
      </Typography>

      {/* 搜索框 */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for video tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* 分类标签页 */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category, index) => (
          <Tab 
            key={category} 
            label={category} 
            id={`tab-${index}`}
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              minWidth: { xs: 'auto', sm: '120px' }
            }}
          />
        ))}
      </Tabs>

      {/* 网站卡片 */}
      {categories.map((category, index) => (
        <Box
          key={category}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          {activeTab === index && renderWebsiteGrid(category)}
        </Box>
      ))}
    </Box>
  );
}