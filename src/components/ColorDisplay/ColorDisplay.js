import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

function ColorDisplay({ hexCode, width, height }) {
  return (
    <Tooltip title={hexCode} placement="top" arrow>
      <Box
        sx={{
          width: width || 100,
          height: height || 100,
          backgroundColor: hexCode,
          '&:hover': {
            cursor: 'pointer'
          },
          borderRadius: '10px',
          border: '1px solid #bbb'
        }}
      />
    </Tooltip>
  );
}

export default ColorDisplay;