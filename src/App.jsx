import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import './App.css';
import CurrencyConverter from './tools/currency-converter/CurrencyConverter';

// 懒加载各个工具组件
const PasswordGenerator = lazy(() => import('./tools/password-generator/PasswordGenerator'));
const JsonFormatter = lazy(() => import('./tools/json-formatter/JsonFormatter'));
// 移除图片转换组件导入
// const ImageConverter = lazy(() => import('./tools/image-converter/ImageConverter'));
const HmacCalculator = lazy(() => import('./tools/hmac-calculator/HmacCalculator'));
// 移除文件转换组件导入
// const FileConverter = lazy(() => import('./tools/file-converter/FileConverter'));
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

// 加载指示器
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/password-generator" replace />} />
            <Route path="password-generator" element={<PasswordGenerator />} />
            <Route path="json-formatter" element={<JsonFormatter />} />
            {/* 移除图片转换路由 */}
            {/* <Route path="image-converter" element={<ImageConverter />} /> */}
            <Route path="hmac-calculator" element={<HmacCalculator />} />
            {/* 移除文件转换路由 */}
            {/* <Route path="file-converter" element={<FileConverter />} /> */}
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
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;