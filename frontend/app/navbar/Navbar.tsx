'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Avatar, Menu, MenuItem, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MapPin, LayoutDashboard, Truck, Warehouse, Settings as SettingIcon, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useAppDispatch } from '@/store/hooks';
// import { logout as logoutAction } from '@/store/authSlice';

const masterBg = '#1411e4';

export function Navbar() {
  const router = useRouter();
  // const dispatch = useAppDispatch();

  const [masterAnchor, setMasterAnchor] = useState<null | HTMLElement>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const [mobileMenu, setMobileMenu] = useState(false);

  const openMasters = Boolean(masterAnchor);
  const openMore = Boolean(moreAnchor);
  const openProfile = Boolean(profileAnchor);

  // const handleLogout = () => {
  //   dispatch(logoutAction());
  //   router.push('/login');
  // };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, action: () => router.push('/dashboard') },
    { label: 'Inward', icon: <Warehouse size={18} />, action: () => router.push('/inward') },
    { label: 'Outward', icon: <Truck size={18} />, action: () => router.push('/outward') },
    { label: 'Masters', icon: <SettingIcon size={18} />, action: () => router.push('/masters') },
    { label: 'More', icon: <MoreHorizontal size={18} />, action: () => router.push('/more') },
    { label: 'Profile', icon: <Avatar sx={{ width: 24, height: 24 }} />, action: () => setProfileAnchor(null) },
    // { label: 'Logout', icon: null, action: handleLogout }
  ];

  const buttonShadow = {
    boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
    border: `0.2px solid lightgray`,
    borderRadius: '6px',
    px: 2,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    '& .MuiButton-startIcon': { marginRight: '6px' }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: '#fff', color: '#1a1a1a', boxShadow: '0px 2px 6px rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>

          {/* LEFT SECTION */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* LOGO + NAME */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={26} strokeWidth={2} color={masterBg} />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: masterBg }}>ODWEN</h2>

              {/* MOBILE MENU ICON (Right side of ODWEN text) */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton onClick={() => setMobileMenu(true)}>
                  <MenuIcon sx={{ color: masterBg }} />
                </IconButton>
              </Box>
            </Box>

            {/* DESKTOP NAV BUTTONS */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button startIcon={<LayoutDashboard size={18} />} sx={{ ...buttonShadow, color: '#000' }}>Dashboard</Button>
              <Button startIcon={<Warehouse size={18} />} sx={{ ...buttonShadow, color: '#000' }}>Inward</Button>
              <Button startIcon={<Truck size={18} />} sx={{ ...buttonShadow, color: '#000' }}>Outward</Button>

              {/* Masters */}
              <Button
                onMouseEnter={(e) => e.currentTarget.style.background = lighten(masterBg, 15)}
                onMouseLeave={(e) => e.currentTarget.style.background = masterBg}
                onClick={(e) => setMasterAnchor(e.currentTarget)}
                startIcon={<SettingIcon size={18} />}
                endIcon={<ChevronDown size={16} />}
                sx={{ ...buttonShadow, background: masterBg, color: '#fff', fontWeight: 600 }}
              >
                Masters
              </Button>
              <Menu anchorEl={masterAnchor} open={openMasters} onClose={() => setMasterAnchor(null)}>
                <MenuItem onClick={() => setMasterAnchor(null)}>Option 1</MenuItem>
                <MenuItem onClick={() => setMasterAnchor(null)}>Option 2</MenuItem>
                <MenuItem onClick={() => setMasterAnchor(null)}>Option 3</MenuItem>
              </Menu>

              {/* More */}
              <Box onClick={(e) => setMoreAnchor(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px 6px', borderRadius: '6px', border: `0.2px solid lightgray`, boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' }}>
                <MoreHorizontal size={22} />
                <ChevronDown size={18} />
              </Box>
              <Menu anchorEl={moreAnchor} open={openMore} onClose={() => setMoreAnchor(null)}>
                <MenuItem onClick={() => setMoreAnchor(null)}>Action 1</MenuItem>
                <MenuItem onClick={() => setMoreAnchor(null)}>Action 2</MenuItem>
                <MenuItem onClick={() => setMoreAnchor(null)}>Action 3</MenuItem>
              </Menu>
            </Box>

          </Box>

        
          {/* RIGHT SECTION */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: '14px', fontWeight: 700, color: '#151515' }}>WMS</Box>

            <Button
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{ minWidth: 'auto', padding: 0 }}
              endIcon={<ChevronDown size={16} style={{ marginLeft: -6 }} />}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: masterBg,
                  border: `1px solid ${masterBg}`,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                }}
                src="Navbar.jpeg"
              />
            </Button>

            <Menu anchorEl={profileAnchor} open={openProfile} onClose={() => setProfileAnchor(null)}>
              <MenuItem onClick={() => setProfileAnchor(null)}>Profile</MenuItem>
              {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>

      {/* MOBILE MENU DRAWER */}
      <Drawer anchor="right" open={mobileMenu} onClose={() => setMobileMenu(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem button key={index} onClick={item.action}>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

// Function to lighten color
function lighten(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}
