import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import RotateRightIcon from '@mui/icons-material/RotateRight'; // Rotate icon
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'; // Drop icon
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


// --- Game Constants ---
const GAME_CONFIG = {
  width: 10,  // Board width in cells
  height: 20, // Board height in cells
  initialSpeed: 800, // Initial drop speed (ms) - Higher is slower
  speedDecrease: 50, // Speed decrease per level (ms)
  minSpeed: 100,     // Fastest speed (ms)
  pointsPerLine: [0, 100, 300, 500, 800], // Points for 0, 1, 2, 3, 4 lines cleared at once
  linesPerLevel: 10 // Lines needed to level up
};

const TETROMINOS = {
    // 0: Represents an empty cell value on the board
    1: { // I piece (index corresponds to value stored on board)
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#00FFFF' // Cyan
    },
    2: { // J piece
      shape: [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
      ],
      color: '#0000FF' // Blue
    },
    3: { // L piece
      shape: [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
      ],
      color: '#FFA500' // Orange
    },
    4: { // O piece
      shape: [
        [4, 4],
        [4, 4]
      ],
      color: '#FFFF00' // Yellow
    },
    5: { // S piece
      shape: [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
      ],
      color: '#00FF00' // Green
    },
    6: { // T piece
      shape: [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
      ],
      color: '#800080' // Purple
    },
    7: { // Z piece
      shape: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
      ],
      color: '#FF0000' // Red
    }
};
const TETROMINO_TYPES = Object.keys(TETROMINOS).map(Number); // Get numeric keys [1, 2, ...]

// Helper to create an empty board
function createEmptyBoard() {
  return Array.from({ length: GAME_CONFIG.height }, () =>
    Array(GAME_CONFIG.width).fill(0) // 0 represents an empty cell
  );
}

export default function TetrisGame() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- State ---
  const [gameBoard, setGameBoard] = useState(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null); // { type: 1, shape: [...], color: '...' }
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 }); // Top-left corner
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
  const gameLoopIntervalRef = useRef(null);
  const lastMoveTimeRef = useRef(0); // Track time for smooth movement

  // --- Game Logic Functions ---

  const getRandomPiece = useCallback(() => {
    const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
    const pieceData = TETROMINOS[type];
    return {
      type: type, // Store the number key (1-7)
      shape: pieceData.shape,
      color: pieceData.color
    };
  }, []); // No dependencies

  // Check for collisions
  const checkCollision = useCallback((piece, position, board) => {
    if (!piece) return false;
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = position.x + x;
          const boardY = position.y + y;
          if (
            boardX < 0 || boardX >= GAME_CONFIG.width || boardY >= GAME_CONFIG.height || // Wall/Floor collision
            (boardY >= 0 && board[boardY] && board[boardY][boardX] !== 0) // Collision with existing blocks
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []); // No state dependencies needed if board is passed

  // Spawn a new piece
  const spawnPiece = useCallback((pieceToSpawn = null, currentBoard) => {
    const piece = pieceToSpawn || getRandomPiece();
    const newPosition = {
      x: Math.floor(GAME_CONFIG.width / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0 // Start at the top row (or slightly above if piece has empty top rows)
    };
    // Adjust starting Y if piece has empty top rows
    for(let r=0; r<piece.shape.length; r++){
        if(piece.shape[r].some(cell => cell !== 0)){
            newPosition.y = -r;
            break;
        }
    }


    if (checkCollision(piece, newPosition, currentBoard)) {
      setGameOver(true);
      setGameOverDialogOpen(true);
      setGameStarted(false);
      if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
      return false; // Spawn failed
    } else {
      setCurrentPiece(piece);
      setCurrentPosition(newPosition);
      setNextPiece(getRandomPiece()); // Prepare the next one
      return true; // Spawn succeeded
    }
  }, [getRandomPiece, checkCollision]); // Added checkCollision

  // Start/Restart Game
  const startGame = useCallback(() => {
    console.log("Starting game...");
    const initialBoard = createEmptyBoard();
    setGameBoard(initialBoard);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
    setGameOverDialogOpen(false);
    setIsPaused(false);
    setGameStarted(true);
    spawnPiece(null, initialBoard); // Pass initialBoard to spawnPiece for first check
  }, [spawnPiece]);

  // Merge piece onto the board
  const mergePieceToBoard = useCallback(() => {
    if (!currentPiece) return;

    setGameBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]); // Create mutable copy
      let isGameOverCondition = false;

      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;

            if (boardY < 0) { // Piece merged above the visible area
              isGameOverCondition = true;
              break;
            }
            if (boardY < GAME_CONFIG.height && boardX >= 0 && boardX < GAME_CONFIG.width) {
              newBoard[boardY][boardX] = currentPiece.type; // Use type number
            }
          }
        }
        if (isGameOverCondition) break;
      }

      if (isGameOverCondition) {
        setGameOver(true);
        setGameOverDialogOpen(true);
        setGameStarted(false);
        if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
        return prevBoard; // Return original board on game over before clear check
      }

      // Check for and clear completed lines
      let linesRemovedCount = 0;
      let boardAfterClear = newBoard.filter(row => {
        const isFull = row.every(cell => cell !== 0);
        if (isFull) linesRemovedCount++;
        return !isFull; // Keep rows that are NOT full
      });

      // Add new empty rows at the top
      while (boardAfterClear.length < GAME_CONFIG.height) {
        boardAfterClear.unshift(Array(GAME_CONFIG.width).fill(0));
      }

      // Update score, lines, level if lines were cleared
      if (linesRemovedCount > 0) {
        setScore(prevScore => prevScore + (GAME_CONFIG.pointsPerLine[linesRemovedCount] || 0) * level);
        setLinesCleared(prevLines => {
            const newTotalLines = prevLines + linesRemovedCount;
            setLevel(Math.floor(newTotalLines / GAME_CONFIG.linesPerLevel) + 1);
            return newTotalLines;
        });
      }

      // Spawn the next piece
      spawnPiece(nextPiece, boardAfterClear); // Pass the board *after* clearing lines

      return boardAfterClear; // Return the updated board state
    });
     // Clear the current piece *after* setting the board and spawning next
     // setCurrentPiece(null); // Let spawnPiece handle setting the new currentPiece
  }, [currentPiece, currentPosition, nextPiece, level, spawnPiece]); // Removed state variables updated inside


  // Move piece logic
  const movePiece = useCallback((direction) => {
    if (!currentPiece || isPaused || gameOver) return false;

    let deltaX = 0;
    let deltaY = 0;

    if (direction === 'left') deltaX = -1;
    if (direction === 'right') deltaX = 1;
    if (direction === 'down') deltaY = 1;

    const newPosition = {
      x: currentPosition.x + deltaX,
      y: currentPosition.y + deltaY
    };

    if (!checkCollision(currentPiece, newPosition, gameBoard)) {
      setCurrentPosition(newPosition);
      // If moving down manually, reset the loop timer for smoother feel (optional)
      // if (direction === 'down') {
      //   lastMoveTimeRef.current = Date.now();
      // }
      return true; // Moved successfully
    } else if (direction === 'down') {
      mergePieceToBoard(); // Merge if downward move failed
      return false; // Didn't move freely, merged instead
    }
    return false; // Move blocked horizontally
  }, [currentPiece, currentPosition, isPaused, gameOver, checkCollision, gameBoard, mergePieceToBoard]);

  // Rotate piece logic
  const rotatePiece = useCallback(() => {
    if (!currentPiece || isPaused || gameOver || currentPiece.type === 4) return; // O piece doesn't rotate

    const shape = currentPiece.shape;
    const N = shape.length;
    const rotatedShape = Array.from({ length: N }, () => Array(N).fill(0));
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        rotatedShape[x][N - 1 - y] = shape[y][x];
      }
    }
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };

    // Wall Kick Logic (Simplified - SRS could be implemented for accuracy)
    let testPosition = { ...currentPosition };
    const kicks = [0, 1, -1, 2, -2]; // Try offsets L/R 0, 1, 2

    for (const kickX of kicks) {
        // Also check vertical kicks slightly for I piece potentially
        // For simplicity, only horizontal kicks here
        const kickPosition = { x: currentPosition.x + kickX, y: currentPosition.y };
        if (!checkCollision(rotatedPiece, kickPosition, gameBoard)) {
             setCurrentPiece(rotatedPiece);
             setCurrentPosition(kickPosition);
             return; // Rotation successful
        }
    }
    // If no kick works, rotation fails
  }, [currentPiece, currentPosition, isPaused, gameOver, checkCollision, gameBoard]);

  // Drop piece logic
  const dropPiece = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    let newPosition = { ...currentPosition };
    while (!checkCollision(currentPiece, { ...newPosition, y: newPosition.y + 1 }, gameBoard)) {
      newPosition.y += 1;
    }
    setCurrentPosition(newPosition);
    // Use requestAnimationFrame to ensure the position update renders before merging
    requestAnimationFrame(mergePieceToBoard);
  }, [currentPiece, currentPosition, isPaused, gameOver, checkCollision, gameBoard, mergePieceToBoard]);

  // --- Game Loop Effect ---
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) {
        if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
        return;
    }
    const gameSpeed = Math.max(GAME_CONFIG.minSpeed, GAME_CONFIG.initialSpeed - (level - 1) * GAME_CONFIG.speedDecrease);

    if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current); // Clear previous interval
    gameLoopIntervalRef.current = setInterval(() => {
        movePiece('down');
    }, gameSpeed);

    return () => clearInterval(gameLoopIntervalRef.current);
  }, [gameStarted, isPaused, gameOver, level, movePiece]); // movePiece is dependency

  // --- Keyboard Control Effect ---
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e) => {
      if (e.code === 'KeyP' || e.key === 'p') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }
      if (isPaused || gameOver) return; // Ignore movement if paused or over

      let handled = true;
      switch (e.code) {
        case 'ArrowLeft': case 'KeyA': movePiece('left'); break;
        case 'ArrowRight': case 'KeyD': movePiece('right'); break;
        case 'ArrowDown': case 'KeyS': movePiece('down'); break;
        case 'ArrowUp': case 'KeyW': rotatePiece(); break;
        case 'Space': dropPiece(); break;
        default: handled = false; break;
      }
      if (handled) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isPaused, gameOver, movePiece, rotatePiece, dropPiece]);

  // --- Rendering ---
  const cellPixelSize = isMobile ? 16 : 24; // Smaller cells on mobile
  const boardPixelWidth = GAME_CONFIG.width * (cellPixelSize + 1) - 1;
  const boardPixelHeight = GAME_CONFIG.height * (cellPixelSize + 1) - 1;

  const renderBoard = () => {
    const displayBoard = gameBoard.map(row => [...row]);
    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < GAME_CONFIG.height && boardX >= 0 && boardX < GAME_CONFIG.width) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${GAME_CONFIG.height}, ${cellPixelSize}px)`,
          gridTemplateColumns: `repeat(${GAME_CONFIG.width}, ${cellPixelSize}px)`,
          gap: '1px',
          border: `3px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400]}`,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
          width: boardPixelWidth,
          height: boardPixelHeight,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px'
        }}
      >
        {displayBoard.flat().map((cellValue, index) => {
          const color = cellValue === 0
            ? (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200])
            : (TETROMINOS[cellValue]?.color || '#333');
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: color,
                border: cellValue !== 0 ? `1px solid rgba(0, 0, 0, 0.2)` : 'none',
                 // Optional: Add slight inset shadow for depth
                 boxShadow: cellValue !== 0 ? 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.2)' : 'none'
              }}
            />
          );
        })}
      </Box>
    );
  };

  const renderNextPiece = () => {
    if (!nextPiece || !gameStarted) return <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption" color="text.secondary">...</Typography></Box>;

    const shape = nextPiece.shape;
    let minR = shape.length, maxR = -1, minC = shape[0].length, maxC = -1;
    shape.forEach((row, r) => row.forEach((cell, c) => {
        if (cell !== 0) { minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, c); maxC = Math.max(maxC, c); }
    }));
    if (minR > maxR || minC > maxC) return null;

    const previewGridHeight = maxR - minR + 1;
    const previewGridWidth = maxC - minC + 1;
    const previewCellSize = 16; // Smaller preview cells

    return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: previewCellSize * 4 + 3 /* Approx height for 4 rows */}}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: `repeat(${previewGridHeight}, ${previewCellSize}px)`,
                gridTemplateColumns: `repeat(${previewGridWidth}, ${previewCellSize}px)`,
                gap: '1px',
              }}
            >
              {shape.slice(minR, maxR + 1).map((row, y) =>
                 row.slice(minC, maxC + 1).map((cellValue, x) => {
                  const color = cellValue === 0 ? 'transparent' : nextPiece.color;
                  return ( <Box key={`next-${y}-${x}`} sx={{ backgroundColor: color, border: cellValue !== 0 ? `1px solid ${theme.palette.divider}` : 'none' }} /> );
                 })
              )}
            </Box>
        </Box>
    );
  };

  // --- Final Component Render ---
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Tetris Game
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        Classic block-stacking game. Use keyboard controls or on-screen buttons to play.
      </Typography>



      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
        {/* Game Area */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 1, position: 'relative', overflow: 'hidden', bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', borderRadius: 2 }}>
            {/* Render the board */}
            {renderBoard()}

             {/* Overlays */}
             {!gameStarted && (
                 <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: 'inherit' }}>
                     <Typography variant="h4" color="white" gutterBottom sx={{ fontWeight: 'bold' }}>Tetris</Typography>
                     <Button variant="contained" color="primary" size="large" onClick={startGame} startIcon={<PlayArrowIcon />}>Start Game</Button>
                 </Box>
             )}
             {isPaused && gameStarted && !gameOver && (
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: 'inherit' }}>
                      <Typography variant="h5" color="white" gutterBottom>Paused</Typography>
                      <Button variant="contained" color="primary" onClick={() => setIsPaused(false)} startIcon={<PlayArrowIcon />}>Resume</Button>
                  </Box>
              )}
              {/* Game Over is now a Dialog */}
          </Paper>
          {/* Mobile Controls */}
          {isMobile && gameStarted && !gameOver && (
             <Paper elevation={2} sx={{ mt: 2, p: 1, borderRadius: 2 }}>
                 <Grid container spacing={1} justifyContent="space-around" alignItems="center">
                      <Grid item xs={3} display="flex" justifyContent="center">
                          <IconButton color="primary" size="large" onClick={() => movePiece('left')}><KeyboardArrowLeftIcon fontSize="inherit" /></IconButton>
                      </Grid>
                      <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
                          <IconButton color="primary" size="large" onClick={rotatePiece}><RotateRightIcon fontSize="inherit" /></IconButton>
                          <Button variant="contained" size="small" color="secondary" onClick={dropPiece} sx={{ mt: 0.5 }} startIcon={<KeyboardDoubleArrowDownIcon/>}>Drop</Button>
                          <IconButton color="primary" size="large" onClick={() => movePiece('down')} sx={{ mt: 0.5 }}><KeyboardArrowDownIcon fontSize="inherit" /></IconButton>
                      </Grid>
                      <Grid item xs={3} display="flex" justifyContent="center">
                          <IconButton color="primary" size="large" onClick={() => movePiece('right')}><KeyboardArrowRightIcon fontSize="inherit" /></IconButton>
                      </Grid>
                 </Grid>
             </Paper>
           )}
        </Grid>

        {/* Info & Controls Panel */}
        <Grid item xs={12} md={4}>
           <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2 }}>
              <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>Game Info</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 1 }}><Typography variant="body1">Score: <strong style={{ color: theme.palette.primary.main }}>{score}</strong></Typography></Box>
                  <Box sx={{ mb: 1 }}><Typography variant="body1">Level: <strong>{level}</strong></Typography></Box>
                  <Box sx={{ mb: 2 }}><Typography variant="body1">Lines: <strong>{linesCleared}</strong></Typography></Box>

                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Next</Typography>
                  <Box sx={{ height: 80, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
                      {renderNextPiece()}
                  </Box>
              </Box>

              <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Controls</Typography>
                   {!gameStarted || gameOver ? (
                      <Button fullWidth variant="contained" color="primary" onClick={startGame} startIcon={<PlayArrowIcon />} sx={{ mb: 1 }}>Start Game</Button>
                  ) : (
                      <>
                          <Button fullWidth variant="contained" color={isPaused ? 'success' : 'warning'} onClick={() => setIsPaused(!isPaused)} startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />} sx={{ mb: 1 }}>
                              {isPaused ? 'Resume' : 'Pause (P)'}
                          </Button>
                          <Button fullWidth variant="outlined" color="secondary" onClick={startGame} startIcon={<ReplayIcon />}>
                              Restart Game
                          </Button>
                      </>
                  )}
                   <Divider sx={{ my: 2 }} />
                   <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                       Keyboard: Arrows/WASD, Up/W (Rotate), Space (Drop), P (Pause)
                   </Typography>
              </Box>
           </Paper>
        </Grid>
      </Grid>

      {/* Game Over Dialog */}
      <Dialog
        open={gameOverDialogOpen}
        onClose={() => setGameOverDialogOpen(false)} // Allow closing by clicking outside
        aria-labelledby="game-over-dialog-title"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle id="game-over-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Game Over!</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
             Final Score: <Typography component="span" variant="h6" color="primary">{score}</Typography>
          </DialogContentText>
           {/* Add High Score comparison if tracked */}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          <Button onClick={startGame} color="primary" variant="contained" autoFocus startIcon={<ReplayIcon />}>
            Play Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}