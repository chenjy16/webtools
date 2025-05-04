import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { BODY_FORMATS } from '../utils/constants';

const BodyTab = ({ body, bodyFormat, onBodyChange, onBodyFormatChange }) => {
  const [formData, setFormData] = useState([{ key: '', value: '' }]);
  
  // 处理表单数据变更
  const handleFormDataChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
    
    // 如果最后一行有内容，添加新的空行
    if (index === formData.length - 1 && (newFormData[index].key || newFormData[index].value)) {
      setFormData([...newFormData, { key: '', value: '' }]);
    }
    
    // 将表单数据转换为适当的格式并更新body
    updateBodyFromFormData(newFormData, bodyFormat);
  };
  
  // 删除表单数据行
  const handleRemoveFormData = (index) => {
    if (formData.length > 1) {
      const newFormData = [...formData];
      newFormData.splice(index, 1);
      setFormData(newFormData);
      
      // 更新body
      updateBodyFromFormData(newFormData, bodyFormat);
    }
  };
  
  // 将表单数据转换为适当的格式并更新body
  const updateBodyFromFormData = (data, format) => {
    const validData = data.filter(item => item.key && item.value);
    
    if (format === 'form') {
      // 转换为 x-www-form-urlencoded 格式
      const params = new URLSearchParams();
      validData.forEach(item => {
        params.append(item.key, item.value);
      });
      onBodyChange({ target: { value: params.toString() } });
    } else if (format === 'formData') {
      // 对于 multipart/form-data，我们只能在前端显示，实际发送时需要使用 FormData 对象
      // 这里我们将表单数据转换为可读的字符串表示
      const formDataStr = validData.map(item => `${item.key}: ${item.value}`).join('\n');
      onBodyChange({ target: { value: formDataStr } });
    }
  };
  
  // 将body解析为表单数据
  const parseBodyToFormData = () => {
    if (!body || bodyFormat !== 'form') return;
    
    try {
      const params = new URLSearchParams(body);
      const newFormData = [];
      
      params.forEach((value, key) => {
        newFormData.push({ key, value });
      });
      
      if (newFormData.length === 0) {
        newFormData.push({ key: '', value: '' });
      }
      
      setFormData(newFormData);
    } catch (e) {
      console.error('Failed to parse body as form data:', e);
      setFormData([{ key: '', value: '' }]);
    }
  };
  
  // 当bodyFormat变更时，尝试解析body
  React.useEffect(() => {
    if (bodyFormat === 'form' || bodyFormat === 'formData') {
      parseBodyToFormData();
    }
  }, [bodyFormat]);
  
  // 渲染表单数据编辑器
  const renderFormDataEditor = () => {
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>键</TableCell>
              <TableCell>值</TableCell>
              <TableCell width="50px"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.key}
                    onChange={(e) => handleFormDataChange(index, 'key', e.target.value)}
                    placeholder="键名"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.value}
                    onChange={(e) => handleFormDataChange(index, 'value', e.target.value)}
                    placeholder="值"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFormData(index)}
                    disabled={formData.length === 1 && !item.key && !item.value}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  // 渲染XML示例按钮
  const insertXmlExample = () => {
    const xmlExample = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <name>Test Request</name>
  <value>Sample Data</value>
</request>`;
    onBodyChange({ target: { value: xmlExample } });
  };
  
  // 渲染JSON示例按钮
  const insertJsonExample = () => {
    const jsonExample = `{
  "name": "Test Request",
  "value": "Sample Data"
}`;
    onBodyChange({ target: { value: jsonExample } });
  };
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="body-format-label">Request Body Format</InputLabel>
            <Select
              labelId="body-format-label"
              value={bodyFormat}
              label="Request Body Format"
              onChange={(e) => onBodyFormatChange(e.target.value)}
            >
              {BODY_FORMATS.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          {(bodyFormat === 'form' || bodyFormat === 'formData') ? (
            renderFormDataEditor()
          ) : (
            <TextField
              fullWidth
              multiline
              rows={10}
              value={body}
              onChange={onBodyChange}
              placeholder={
                bodyFormat === 'json' ? '{"key": "value"}' :
                bodyFormat === 'xml' ? '<root>内容</root>' :
                '输入请求体内容...'
              }
              sx={{ fontFamily: 'monospace' }}
            />
          )}
        </Grid>
        
        {bodyFormat === 'json' && (
          <Grid item xs={12}>
            <Button size="small" onClick={insertJsonExample}>
              插入JSON示例
            </Button>
          </Grid>
        )}
        
        {bodyFormat === 'xml' && (
          <Grid item xs={12}>
            <Button size="small" onClick={insertXmlExample}>
              插入XML示例
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BodyTab;