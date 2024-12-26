import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useStore } from "../../store"

const Navbar = () => {
  const { userData } = useStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} style={{ alignItems: "center" }}>
      <Toolbar style={{ width: "80%", display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <a href="https://interviewaxis.com">
            <img
              src="https://interviewaxis.com/build/img/pngmiddel.png"
              alt="Logo"
              style={{ height: 40 }}
            />
          </a>
        </Box>

        {/* Main Menu */}
        <Box display={{ xs: "none", md: "flex" }} alignItems="center" gap={3}>
          <Button href="https://interviewaxis.com" color="inherit">
            Home
          </Button>
          <Button
            color="inherit"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleMenuOpen}
          >
            User
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} component="a" href="/user-dashboard">
              User Dashboard
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component="a" href="/user-profile">
              My Profile
            </MenuItem>
          </Menu>
          <Button href="https://interviewaxis.com/about-us" color="inherit">
            About Us
          </Button>
          <Button href="https://interviewaxis.com/team" color="inherit">
            My Team
          </Button>
          <Button href="https://interviewaxis.com/blogs" color="inherit">
            Blog
          </Button>
        </Box>

        {/* Action Buttons */}
        <Box display={{ xs: "none", md: "flex" }} alignItems="center" gap={2}>
          {userData.user_id ?
            (
              <Button
                variant="contained"
                href="https://www.interviewaxis.com/user-profile"
                sx={{
                  backgroundColor: "#0D1E30",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  "&:hover": {
                    backgroundColor: "#0A1723",
                  },
                }}
              >
                Profile
              </Button>
            )
            : (
              <>
                <Button
                  variant="outlined"
                  href="https://www.interviewaxis.com/login"
                  color="inherit"
                  style={{ textTransform: "none", borderRadius: 5 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  href="https://www.interviewaxis.com/signup"
                  color="error"
                  style={{ textTransform: "none", borderRadius: 5 }}
                >
                  Sign Up
                </Button>
              </>
            )
          }
        </Box>

        {/* Mobile Menu */}
        <Box display={{ xs: "flex", md: "none" }}>
          <IconButton onClick={toggleMobileMenu}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="right" open={isMobileMenuOpen} onClose={toggleMobileMenu}>
        <Box
          role="presentation"
          style={{ width: 250 }}
          onClick={toggleMobileMenu}
          onKeyDown={toggleMobileMenu}
        >
          <Box display="flex" justifyContent="space-between" p={2}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button component="a" href="https://interviewaxis.com">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="User" />
            </ListItem>
            <ListItem button component="a" href="https://interviewaxis.com/about-us">
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem button component="a" href="https://interviewaxis.com/team">
              <ListItemText primary="My Team" />
            </ListItem>
            <ListItem button component="a" href="https://interviewaxis.com/blogs">
              <ListItemText primary="Blog" />
            </ListItem>
            <ListItem button component="a" href="/login">
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem button component="a" href="/signup">
              <ListItemText primary="Sign Up" />
            </ListItem>
            <ListItem button component="a" href="/user-profile">
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
