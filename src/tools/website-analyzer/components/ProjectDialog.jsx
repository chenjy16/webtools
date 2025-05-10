import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveIcon from '@mui/icons-material/Save';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

function ProjectDialog() {
  const {
    projectDialogOpen,
    handleProjectDialogClose,
    savedProjects,
    saveCurrentProject,
    loadProject,
    deleteProject,
    currentProjectName
  } = useWebsiteBuilder();
  
  const [newProjectName, setNewProjectName] = useState('');
  
  const handleSaveProject = () => {
    if (newProjectName.trim()) {
      saveCurrentProject(newProjectName);
      setNewProjectName('');
    } else {
      saveCurrentProject();
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Dialog
      open={projectDialogOpen}
      onClose={handleProjectDialogClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>项目管理</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            保存当前项目
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="项目名称"
              variant="outlined"
              size="small"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder={currentProjectName || "我的网站项目"}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveProject}
            >
              保存
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          已保存的项目
        </Typography>
        
        {savedProjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            暂无保存的项目
          </Typography>
        ) : (
          <List>
            {savedProjects.map((project) => (
              <ListItem key={project.id} divider>
                <ListItemText
                  primary={project.name}
                  secondary={`创建于: ${formatDate(project.date)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="load"
                    onClick={() => loadProject(project.id)}
                    sx={{ mr: 1 }}
                  >
                    <FolderOpenIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteProject(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProjectDialogClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectDialog;