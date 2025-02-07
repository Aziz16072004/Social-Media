import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from '../../axios';
import 'react-notifications-component/dist/theme.css';
import { ReactNotifications } from 'react-notifications-component';
import { toast } from 'react-toastify';

const options = [
  'Delete',
  'Share'
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ dataStoraged, userData }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteFriend = async () => {
    try {
      console.log(dataStoraged._id);
      console.log(userData._id);
  
      const res = await axios.delete("/user/deletefriend", {
        data: { user1: dataStoraged._id, user2: userData._id },
        withCredentials: true
      });
  
      // Success notification
      toast.success('Friend deleted successfully!');
    } catch (error) {
      console.log(error);
      
      // Error notification
      toast.error('An error occurred. Please try again!');
    }
  };

  return (
    <div className='friendFeatureIcon'>
      
      
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          option === "Delete" ? (
            <MenuItem key={option} onClick={() => {
              deleteFriend();
              handleClose();
            }}>
              {option}                

            </MenuItem>
          ) : (
            <MenuItem key={option} onClick={handleClose}>
              {option}
            </MenuItem>
          )
        ))}
      </Menu>
    </div>
  );
}
