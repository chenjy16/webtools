// 确保在文件顶部正确导入所有需要的组件和库
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AdBanner from '../../components/AdBanner';

export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [formula, setFormula] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 单位转换类别
  const categories = [
    { id: 'length', name: '长度' },
    { id: 'area', name: '面积' },
    { id: 'volume', name: '体积' },
    { id: 'weight', name: '重量' },
    { id: 'temperature', name: '温度' },
    { id: 'time', name: '时间' },
    { id: 'speed', name: '速度' },
    { id: 'data', name: '数据存储' }
  ];

  // 各类别的单位定义
  const units = {
    length: [
      { id: 'km', name: '千米 (km)', factor: 1000 },
      { id: 'm', name: '米 (m)', factor: 1 },
      { id: 'dm', name: '分米 (dm)', factor: 0.1 },
      { id: 'cm', name: '厘米 (cm)', factor: 0.01 },
      { id: 'mm', name: '毫米 (mm)', factor: 0.001 },
      { id: 'um', name: '微米 (μm)', factor: 0.000001 },
      { id: 'nm', name: '纳米 (nm)', factor: 0.000000001 },
      { id: 'mile', name: '英里 (mi)', factor: 1609.344 },
      { id: 'yard', name: '码 (yd)', factor: 0.9144 },
      { id: 'foot', name: '英尺 (ft)', factor: 0.3048 },
      { id: 'inch', name: '英寸 (in)', factor: 0.0254 }
    ],
    area: [
      { id: 'km2', name: '平方千米 (km²)', factor: 1000000 },
      { id: 'ha', name: '公顷 (ha)', factor: 10000 },
      { id: 'm2', name: '平方米 (m²)', factor: 1 },
      { id: 'dm2', name: '平方分米 (dm²)', factor: 0.01 },
      { id: 'cm2', name: '平方厘米 (cm²)', factor: 0.0001 },
      { id: 'mm2', name: '平方毫米 (mm²)', factor: 0.000001 },
      { id: 'acre', name: '英亩 (acre)', factor: 4046.8564224 },
      { id: 'mile2', name: '平方英里 (mi²)', factor: 2589988.110336 },
      { id: 'yard2', name: '平方码 (yd²)', factor: 0.83612736 },
      { id: 'foot2', name: '平方英尺 (ft²)', factor: 0.09290304 },
      { id: 'inch2', name: '平方英寸 (in²)', factor: 0.00064516 }
    ],
    volume: [
      { id: 'm3', name: '立方米 (m³)', factor: 1 },
      { id: 'dm3', name: '立方分米 (dm³)', factor: 0.001 },
      { id: 'cm3', name: '立方厘米 (cm³)', factor: 0.000001 },
      { id: 'mm3', name: '立方毫米 (mm³)', factor: 0.000000001 },
      { id: 'l', name: '升 (L)', factor: 0.001 },
      { id: 'ml', name: '毫升 (mL)', factor: 0.000001 },
      { id: 'gallon_us', name: '美制加仑 (gal)', factor: 0.003785411784 },
      { id: 'gallon_uk', name: '英制加仑 (gal)', factor: 0.00454609 },
      { id: 'quart', name: '夸脱 (qt)', factor: 0.000946352946 },
      { id: 'pint', name: '品脱 (pt)', factor: 0.000473176473 },
      { id: 'cup', name: '杯 (cup)', factor: 0.000236588236 },
      { id: 'fluid_oz', name: '液量盎司 (fl oz)', factor: 0.0000295735295625 },
      { id: 'tbsp', name: '汤匙 (tbsp)', factor: 0.0000147867647813 },
      { id: 'tsp', name: '茶匙 (tsp)', factor: 0.00000492892159375 }
    ],
    weight: [
      { id: 't', name: '吨 (t)', factor: 1000 },
      { id: 'kg', name: '千克 (kg)', factor: 1 },
      { id: 'g', name: '克 (g)', factor: 0.001 },
      { id: 'mg', name: '毫克 (mg)', factor: 0.000001 },
      { id: 'ug', name: '微克 (μg)', factor: 0.000000001 },
      { id: 'lb', name: '磅 (lb)', factor: 0.45359237 },
      { id: 'oz', name: '盎司 (oz)', factor: 0.028349523125 },
      { id: 'stone', name: '英石 (st)', factor: 6.35029318 },
      { id: 'ton_us', name: '美制吨 (ton)', factor: 907.18474 },
      { id: 'ton_uk', name: '英制吨 (ton)', factor: 1016.0469088 }
    ],
    temperature: [
      { id: 'c', name: '摄氏度 (°C)', factor: 1 },
      { id: 'f', name: '华氏度 (°F)', factor: 1 },
      { id: 'k', name: '开尔文 (K)', factor: 1 }
    ],
    time: [
      { id: 'year', name: '年 (y)', factor: 31536000 },
      { id: 'month', name: '月 (mo)', factor: 2592000 },
      { id: 'week', name: '周 (wk)', factor: 604800 },
      { id: 'day', name: '天 (d)', factor: 86400 },
      { id: 'hour', name: '小时 (h)', factor: 3600 },
      { id: 'minute', name: '分钟 (min)', factor: 60 },
      { id: 'second', name: '秒 (s)', factor: 1 },
      { id: 'millisecond', name: '毫秒 (ms)', factor: 0.001 },
      { id: 'microsecond', name: '微秒 (μs)', factor: 0.000001 },
      { id: 'nanosecond', name: '纳秒 (ns)', factor: 0.000000001 }
    ],
    speed: [
      { id: 'mps', name: '米/秒 (m/s)', factor: 1 },
      { id: 'kph', name: '千米/小时 (km/h)', factor: 0.277777778 },
      { id: 'mph', name: '英里/小时 (mph)', factor: 0.44704 },
      { id: 'fps', name: '英尺/秒 (ft/s)', factor: 0.3048 },
      { id: 'knot', name: '节 (kn)', factor: 0.514444444 }
    ],
    data: [
      { id: 'bit', name: '比特 (bit)', factor: 1 / 8 },
      { id: 'byte', name: '字节 (B)', factor: 1 },
      { id: 'kb', name: '千字节 (KB)', factor: 1024 },
      { id: 'mb', name: '兆字节 (MB)', factor: 1048576 },
      { id: 'gb', name: '吉字节 (GB)', factor: 1073741824 },
      { id: 'tb', name: '太字节 (TB)', factor: 1099511627776 },
      { id: 'pb', name: '拍字节 (PB)', factor: 1125899906842624 }
    ]
  };

  // 初始化默认单位
  useEffect(() => {
    const category = categories[activeTab].id;
    if (units[category] && units[category].length >= 2) {
      setFromUnit(units[category][0].id);
      setToUnit(units[category][1].id);
      convert(1, units[category][0].id, units[category][1].id, category);
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value && !isNaN(value) && fromUnit && toUnit) {
      convert(parseFloat(value), fromUnit, toUnit, categories[activeTab].id);
    } else {
      setResult('');
      setFormula('');
    }
  };

  const handleFromUnitChange = (e) => {
    const newFromUnit = e.target.value;
    setFromUnit(newFromUnit);
    
    if (inputValue && !isNaN(inputValue) && newFromUnit && toUnit) {
      convert(parseFloat(inputValue), newFromUnit, toUnit, categories[activeTab].id);
    }
  };

  const handleToUnitChange = (e) => {
    const newToUnit = e.target.value;
    setToUnit(newToUnit);
    
    if (inputValue && !isNaN(inputValue) && fromUnit && newToUnit) {
      convert(parseFloat(inputValue), fromUnit, newToUnit, categories[activeTab].id);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    
    if (inputValue && !isNaN(inputValue)) {
      convert(parseFloat(inputValue), toUnit, temp, categories[activeTab].id);
    }
  };

  const convert = (value, from, to, category) => {
    if (category === 'temperature') {
      // 温度需要特殊处理
      convertTemperature(value, from, to);
    } else {
      // 其他单位使用因子转换
      const fromUnit = units[category].find(u => u.id === from);
      const toUnit = units[category].find(u => u.id === to);
      
      if (fromUnit && toUnit) {
        const baseValue = value * fromUnit.factor;
        const convertedValue = baseValue / toUnit.factor;
        
        setResult(convertedValue.toLocaleString('zh-CN', {
          maximumFractionDigits: 10,
          useGrouping: true
        }));
        
        setFormula(`${value} ${fromUnit.name} = ${convertedValue.toLocaleString('zh-CN', {
          maximumFractionDigits: 10,
          useGrouping: true
        })} ${toUnit.name}`);
      }
    }
  };

  const convertTemperature = (value, from, to) => {
    let result;
    let formula;
    
    // 先转换为摄氏度
    let celsius;
    switch (from) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5/9;
        formula = `(${value}°F - 32) × 5/9 = ${celsius.toFixed(4)}°C`;
        break;
      case 'k':
        celsius = value - 273.15;
        formula = `${value}K - 273.15 = ${celsius.toFixed(4)}°C`;
        break;
      default:
        celsius = value;
    }
    
    // 从摄氏度转换为目标单位
    switch (to) {
      case 'c':
        result = celsius;
        if (!formula) formula = `${value}°C = ${result.toFixed(4)}°C`;
        break;
      case 'f':
        result = celsius * 9/5 + 32;
        if (!formula) formula = `${value}°C × 9/5 + 32 = ${result.toFixed(4)}°F`;
        else formula += ` → ${celsius.toFixed(4)}°C × 9/5 + 32 = ${result.toFixed(4)}°F`;
        break;
      case 'k':
        result = celsius + 273.15;
        if (!formula) formula = `${value}°C + 273.15 = ${result.toFixed(4)}K`;
        else formula += ` → ${celsius.toFixed(4)}°C + 273.15 = ${result.toFixed(4)}K`;
        break;
      default:
        result = celsius;
    }
    
    setResult(result.toLocaleString('zh-CN', {
      maximumFractionDigits: 6,
      useGrouping: true
    }));
    setFormula(formula);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('已复制到剪贴板', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        单位换算工具
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        在不同单位之间进行快速、精确的换算。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="9900112233" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {categories.map((category, index) => (
              <Tab key={category.id} label={category.name} />
            ))}
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="输入值"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                InputProps={{ inputProps: { step: 'any' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>从</InputLabel>
                <Select
                  value={fromUnit}
                  label="从"
                  onChange={handleFromUnitChange}
                >
                  {units[categories[activeTab].id]?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton 
                color="primary" 
                onClick={swapUnits}
                sx={{ 
                  backgroundColor: '#f0f7ff', 
                  '&:hover': { backgroundColor: '#e1f0ff' } 
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="结果"
                value={result}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={7}>
              <FormControl fullWidth>
                <InputLabel>到</InputLabel>
                <Select
                  value={toUnit}
                  label="到"
                  onChange={handleToUnitChange}
                >
                  {units[categories[activeTab].id]?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {formula && (
            <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="primary">换算公式</Typography>
                <IconButton 
                  onClick={() => copyToClipboard(formula)}
                  color="primary"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1">
                {formula}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="9900112233" />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}