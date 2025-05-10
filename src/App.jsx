import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { lazy, Suspense, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import './App.css';
import CurrencyConverter from './tools/currency-converter/CurrencyConverter';
import PdfTools from './tools/pdf-tools/PdfTools';
import LoadingFallback from './components/LoadingFallback'; // 添加这一行
import VideoTools from './tools/video-tools/VideoTools';
import TempMail from './tools/temp-mail/TempMail';
import PublicHolidays from './tools/public-holidays/PublicHolidays';
import DnsLookup from './tools/dns-lookup/DnsLookup'; 
import SpeedTest from './tools/speed-test/SpeedTest';
import ApiTester from './tools/api-tester/ApiTester'; // 导入 ApiTester 组件
import WebsiteAnalyzer from './tools/website-analyzer/WebsiteAnalyzer';

// 添加网络延迟测试工具组件导入
const NetworkLatency = lazy(() => import('./tools/network-latency/NetworkLatency'));


// 懒加载各个工具组件
const PasswordGenerator = lazy(() => import('./tools/password-generator/PasswordGenerator'));
const JsonFormatter = lazy(() => import('./tools/json-formatter/JsonFormatter'));
// 添加图片压缩组件导入
const ImageCompressor = lazy(() => import('./tools/image-compressor/ImageCompressor'));
const HmacCalculator = lazy(() => import('./tools/hmac-calculator/HmacCalculator'));
const QRCodeGenerator = lazy(() => import('./tools/qrcode-generator/QRCodeGenerator'));
const UrlEncoder = lazy(() => import('./tools/url-encoder/UrlEncoder'));
const Base64Converter = lazy(() => import('./tools/base64-converter/Base64Converter'));
const HashCalculator = lazy(() => import('./tools/hash-calculator/HashCalculator'));
const ColorConverter = lazy(() => import('./tools/color-converter/ColorConverter'));
const IpLookup = lazy(() => import('./tools/ip-lookup/IpLookup'));

// 新增工具组件
const JwtDecoder = lazy(() => import('./tools/jwt-decoder/JwtDecoder'));
const DateCalculator = lazy(() => import('./tools/date-calculator/DateCalculator'));
const RegexTester = lazy(() => import('./tools/regex-tester/RegexTester'));
const Timer = lazy(() => import('./tools/timer/Timer'));
const CodeFormatter = lazy(() => import('./tools/code-formatter/CodeFormatter'));
const UnitConverter = lazy(() => import('./tools/unit-converter/UnitConverter'));
// 添加国家信息百科组件
const CountryInfo = lazy(() => import('./tools/country-info/CountryInfo'));
const About = lazy(() => import('./pages/About')); // 添加这一行，懒加载 About 组件

// 添加房贷计算器组件
const MortgageCalculator = lazy(() => import('./tools/mortgage-calculator/MortgageCalculator'));

// 添加假数据生成器组件
const FakeDataGenerator = lazy(() => import('./tools/fake-data-generator/FakeDataGenerator'));

// 添加Cron生成器组件
const CronGenerator = lazy(() => import('./tools/cron-generator/CronGenerator'));

// 添加游戏组件懒加载
const SnakeGame = lazy(() => import('./tools/games/snake/SnakeGame'));
const TetrisGame = lazy(() => import('./tools/games/tetris/TetrisGame'));
const StreamVideos=lazy(() => import('./tools/stream-videos/StreamVideos'));


function App() {
  const [mode, setMode] = useState('light');
  
  const toggleDarkMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}> {/* 使用 LoadingFallback 组件 */}
        <Routes>
          <Route path="/" element={<MainLayout toggleDarkMode={toggleDarkMode} currentMode={mode} />}>
            <Route index element={<Navigate to="/website-analyzer" replace />} />
            <Route path="password-generator" element={<PasswordGenerator />} />
            <Route path="json-formatter" element={<JsonFormatter />} />
            <Route path="hmac-calculator" element={<HmacCalculator />} />
            <Route path="qrcode-generator" element={<QRCodeGenerator />} />
            <Route path="url-encoder" element={<UrlEncoder />} />
            <Route path="base64-converter" element={<Base64Converter />} />
            <Route path="hash-calculator" element={<HashCalculator />} />
            <Route path="color-converter" element={<ColorConverter />} />
            <Route path="ip-lookup" element={<IpLookup />} />
            
            {/* 新增工具路由 */}
            <Route path="jwt-decoder" element={<JwtDecoder />} />
            <Route path="date-calculator" element={<DateCalculator />} />
            <Route path="regex-tester" element={<RegexTester />} />
            <Route path="timer" element={<Timer />} />
            <Route path="code-formatter" element={<CodeFormatter />} />
            <Route path="unit-converter" element={<UnitConverter />} />
            {/* 添加新工具路由 */}
            <Route path="CurrencyConverter" element={<CurrencyConverter />} />
            <Route path="mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="country-info" element={<CountryInfo />} />
            <Route path="about" element={<About />} />
            {/* 添加假数据生成器路由 */}
            <Route path="fake-data-generator" element={<FakeDataGenerator />} />
            {/* 添加Cron表达式生成与解析器路由 */}
            <Route path="cron-generator" element={<CronGenerator />} />
            <Route path="image-compressor" element={<ImageCompressor />} />
            <Route path="pdf-tools" element={<PdfTools />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/video-tools" element={<VideoTools />} />
            {/* 游戏路由 */}
            <Route path="games/snake" element={<SnakeGame />} />
            <Route path="games/tetris" element={<TetrisGame />} />
            <Route path="/stream-videos" element={<StreamVideos />} />
            <Route path="/temp-mail" element={<TempMail />} />
            <Route path="/public-holidays" element={<PublicHolidays />} />
            {/* 添加DNS查询工具路由 */}
            <Route path="/dns-lookup" element={<DnsLookup />} />
            {/* 添加网络速度测试路由 */}
            <Route path="/speed-test" element={<SpeedTest />} />
            {/* 添加网络延迟测试工具路由 */}
            <Route path="/network-latency" element={<NetworkLatency />} />
            {/* 添加API测试工具路由 */}
            <Route path="/api-tester" element={<ApiTester />} />
            {/* 新增 AI 网站分析工具路由 */}
            <Route path="/website-analyzer" element={<WebsiteAnalyzer />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;