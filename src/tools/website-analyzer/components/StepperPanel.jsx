import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

function StepperPanel() {
  const { currentStep } = useWebsiteBuilder();

  return (
    <Box sx={{ width: '250px' }}>
      <Stepper activeStep={currentStep} orientation="vertical">
        <Step>
          <StepLabel>选择网站类型</StepLabel>
          <StepContent>
            <Typography variant="body2">
              告诉AI你想要构建什么类型的网站
            </Typography>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>网站标题和描述</StepLabel>
          <StepContent>
            <Typography variant="body2">
              提供网站的标题和简短描述
            </Typography>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>网站内容部分</StepLabel>
          <StepContent>
            <Typography variant="body2">
              列出网站需要包含的主要部分
            </Typography>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>颜色主题</StepLabel>
          <StepContent>
            <Typography variant="body2">
              选择网站的颜色主题和风格
            </Typography>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>生成和预览</StepLabel>
          <StepContent>
            <Typography variant="body2">
              预览、下载或复制生成的网站代码
            </Typography>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}

export default StepperPanel;