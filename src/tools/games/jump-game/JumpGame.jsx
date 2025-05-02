import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Slider, Stack } from '@mui/material';


export default function JumpGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [powerLevel, setPowerLevel] = useState(0);
  const [isPowerCharging, setIsPowerCharging] = useState(false);
  
  const gameStateRef = useRef({
    platforms: [],
    playerX: 0,
    playerY: 0,
    playerSize: 30,
    jumping: false,
    jumpPower: 0,
    jumpTime: 0,
    gravity: 0.5,
    platformWidth: 80,
    platformHeight: 20,
    platformGap: 100,
    platformCount: 5,
    currentPlatform: 0,
    cameraX: 0,
    gameSpeed: 1,
    animationId: null
  });
  
  // 初始化游戏
  const initGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;
    
    // 设置画布尺寸
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // 初始化平台
    gameState.platforms = [];
    for (let i = 0; i < gameState.platformCount; i++) {
      gameState.platforms.push({
        x: i * (gameState.platformWidth + gameState.platformGap),
        y: canvas.height - 100,
        width: gameState.platformWidth,
        height: gameState.platformHeight,
        color: getRandomColor()
      });
    }
    
    // 初始化玩家位置
    gameState.playerX = gameState.platforms[0].x + gameState.platformWidth / 2 - gameState.playerSize / 2;
    gameState.playerY = gameState.platforms[0].y - gameState.playerSize;
    gameState.currentPlatform = 0;
    gameState.cameraX = 0;
    
    // 重置游戏状态
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    
    // 开始游戏循环
    gameLoop();
  };
  
  // 游戏主循环
  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新相机位置
    if (gameState.playerX - gameState.cameraX > canvas.width * 0.6) {
      gameState.cameraX = gameState.playerX - canvas.width * 0.6;
    }
    
    // 绘制背景
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制云朵
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(100 - gameState.cameraX * 0.1, 80, 30, 0, Math.PI * 2);
    ctx.arc(130 - gameState.cameraX * 0.1, 80, 40, 0, Math.PI * 2);
    ctx.arc(160 - gameState.cameraX * 0.1, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(300 - gameState.cameraX * 0.2, 120, 30, 0, Math.PI * 2);
    ctx.arc(330 - gameState.cameraX * 0.2, 120, 40, 0, Math.PI * 2);
    ctx.arc(360 - gameState.cameraX * 0.2, 120, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制平台
    gameState.platforms.forEach(platform => {
      ctx.fillStyle = platform.color;
      ctx.fillRect(
        platform.x - gameState.cameraX, 
        platform.y, 
        platform.width, 
        platform.height
      );
    });
    
    // 更新玩家状态
    if (gameState.jumping) {
      gameState.jumpTime += 1;
      
      // 计算跳跃轨迹
      const jumpProgress = gameState.jumpTime / 50;
      const jumpHeight = gameState.jumpPower * Math.sin(jumpProgress * Math.PI);
      const jumpDistance = gameState.jumpPower * 2 * jumpProgress;
      
      gameState.playerX = gameState.platforms[gameState.currentPlatform].x + 
                          gameState.platformWidth / 2 - 
                          gameState.playerSize / 2 + 
                          jumpDistance;
      
      gameState.playerY = gameState.platforms[gameState.currentPlatform].y - 
                          gameState.playerSize - 
                          jumpHeight;
      
      // 检查是否落地
      if (jumpProgress >= 1) {
        gameState.jumping = false;
        gameState.jumpTime = 0;
        
        // 检查是否落在平台上
        let landed = false;
        for (let i = 0; i < gameState.platforms.length; i++) {
          const platform = gameState.platforms[i];
          if (
            gameState.playerX + gameState.playerSize > platform.x &&
            gameState.playerX < platform.x + platform.width &&
            gameState.playerY + gameState.playerSize >= platform.y &&
            gameState.playerY + gameState.playerSize <= platform.y + 10
          ) {
            gameState.currentPlatform = i;
            gameState.playerY = platform.y - gameState.playerSize;
            landed = true;
            setScore(prev => prev + 1);
            
            // 添加新平台
            if (i === gameState.platforms.length - 1) {
              const lastPlatform = gameState.platforms[gameState.platforms.length - 1];
              gameState.platforms.push({
                x: lastPlatform.x + gameState.platformWidth + gameState.platformGap + Math.random() * 50,
                y: canvas.height - 100 - Math.random() * 50,
                width: gameState.platformWidth,
                height: gameState.platformHeight,
                color: getRandomColor()
              });
              
              // 移除最前面的平台
              if (gameState.platforms.length > gameState.platformCount + 3) {
                gameState.platforms.shift();
                gameState.currentPlatform--;
              }
            }
            break;
          }
        }
        
        if (!landed) {
          setGameOver(true);
          cancelAnimationFrame(gameState.animationId);
          return;
        }
      }
    }
    
    // 绘制玩家
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(
      gameState.playerX - gameState.cameraX, 
      gameState.playerY, 
      gameState.playerSize, 
      gameState.playerSize
    );
    
    // 继续游戏循环
    gameState.animationId = requestAnimationFrame(gameLoop);
  };
  
  // 处理跳跃
  const handleJump = () => {
    const gameState = gameStateRef.current;
    if (!gameState.jumping) {
      gameState.jumping = true;
      gameState.jumpPower = powerLevel * 3 + 50;
      setPowerLevel(0);
      setIsPowerCharging(false);
    }
  };
  
  // 开始蓄力
  const startCharging = () => {
    if (!gameStateRef.current.jumping) {
      setIsPowerCharging(true);
      const chargeInterval = setInterval(() => {
        setPowerLevel(prev => {
          if (prev >= 100) {
            clearInterval(chargeInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      
      // 存储interval ID以便在释放时清除
      gameStateRef.current.chargeInterval = chargeInterval;
    }
  };
  
  // 释放跳跃
  const releaseJump = () => {
    clearInterval(gameStateRef.current.chargeInterval);
    handleJump();
  };
  
  // 生成随机颜色
  const getRandomColor = () => {
    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#9370DB', '#20B2AA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // 重新开始游戏
  const restartGame = () => {
    cancelAnimationFrame(gameStateRef.current.animationId);
    initGame();
  };
  
  // 组件挂载时设置画布尺寸
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(gameStateRef.current.animationId);
    };
  }, []);
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Jump Game
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Hold the screen or mouse to charge power, release to jump. Jump as far as possible and land on platforms to score!
      </Typography>
      
   
      
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 3, 
          p: 2, 
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Score: {score}</Typography>
          {!gameStarted && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={initGame}
            >
              Start Game
            </Button>
          )}
          {gameOver && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={restartGame}
            >
              Restart
            </Button>
          )}
        </Box>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: 400, 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            bgcolor: '#f5f5f5'
          }}
        >
          <canvas 
            ref={canvasRef} 
            style={{ width: '100%', height: '100%' }}
            onMouseDown={startCharging}
            onMouseUp={releaseJump}
            onTouchStart={startCharging}
            onTouchEnd={releaseJump}
          />
          
          {!gameStarted && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>Jump Game</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={initGame}
              >
                Start Game
              </Button>
            </Box>
          )}
          
          {gameOver && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>Game Over</Typography>
              <Typography variant="h5" sx={{ mb: 3 }}>Score: {score}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={restartGame}
              >
                Restart
              </Button>
            </Box>
          )}
        </Box>
        
        {gameStarted && !gameOver && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography gutterBottom>Power Level: {powerLevel}%</Typography>
            <Slider
              value={powerLevel}
              disabled
              sx={{
                '& .MuiSlider-track': {
                  bgcolor: powerLevel > 80 ? 'error.main' : 'primary.main',
                },
                '& .MuiSlider-thumb': {
                  display: 'none',
                },
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {isPowerCharging ? 'Release to jump!' : 'Hold screen or mouse to charge'}
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Game Instructions</Typography>
        <Typography variant="body2" paragraph>
          1. Hold the screen or mouse to charge power; the longer you hold, the farther you jump.
        </Typography>
        <Typography variant="body2" paragraph>
          2. Release to make the character jump; aim to land precisely on the next platform.
        </Typography>
        <Typography variant="body2" paragraph>
          3. Score 1 point for each successful landing on a platform.
        </Typography>
        <Typography variant="body2" paragraph>
          4. If you miss a platform, the game ends.
        </Typography>
      </Box>
    </Box>
  );
}