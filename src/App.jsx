import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import './App.css';

// 懒加载各个工具组件
const PasswordGenerator = lazy(() => import('./tools/password-generator/PasswordGenerator'));
const JsonFormatter = lazy(() => import('./tools/json-formatter/JsonFormatter'));
const ImageConverter = lazy(() => import('./tools/image-converter/ImageConverter'));
const HmacCalculator = lazy(() => import('./tools/hmac-calculator/HmacCalculator'));
const FileConverter = lazy(() => import('./tools/file-converter/FileConverter'));
const QRCodeGenerator = lazy(() => import('./tools/qrcode-generator/QRCodeGenerator'));
const UrlEncoder = lazy(() => import('./tools/url-encoder/UrlEncoder'));
const Base64Converter = lazy(() => import('./tools/base64-converter/Base64Converter'));
const HashCalculator = lazy(() => import('./tools/hash-calculator/HashCalculator'));
const ColorConverter = lazy(() => import('./tools/color-converter/ColorConverter'));


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
            <Route path="image-converter" element={<ImageConverter />} />
            <Route path="hmac-calculator" element={<HmacCalculator />} />
            <Route path="file-converter" element={<FileConverter />} />
            <Route path="qrcode-generator" element={<QRCodeGenerator />} />
            <Route path="url-encoder" element={<UrlEncoder />} />
            <Route path="base64-converter" element={<Base64Converter />} />
            <Route path="hash-calculator" element={<HashCalculator />} />
            <Route path="color-converter" element={<ColorConverter />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;