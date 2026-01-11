'use client';

import React, { useState, useMemo } from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, Typography } from '@mui/material';
import statesCities from '../data/statesCities.json';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const states = useMemo(() => statesCities.map((s) => s.state), []);
  const citiesForState = useMemo(() => {
    const found = statesCities.find((s) => s.state === state);
    return found ? found.cities : [];
  }, [state]);

  const triggerSearch = (st, ct, q = query) => {
    onSearch({ q: q.trim(), state: st || undefined, city: ct || undefined });
  };

  const handleSearchClick = () => triggerSearch(state, city);

  const handleStateChange = (val) => {
    setState(val);
    setCity('');
    triggerSearch(val, undefined);
  };

  const handleCityChange = (val) => {
    setCity(val);
    triggerSearch(state, val);
  };

  const handleReset = () => {
    setQuery('');
    setState('');
    setCity('');
    onSearch({ q: '', state: undefined, city: undefined });
  };

  const labelStyle = { fontWeight: 700, fontSize: 12, mb: 0.4 };

  const selectStyle = {
    height: 32,
    fontSize: 12,
    '& .MuiSelect-select': { py: 0.6 },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        px: 1.2,
        py: 0.8,
        borderRadius: '6px',
        border: '1px solid #dcdcdc',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
        mb: 2,
        bgcolor: '#fff',
        flexWrap: 'nowrap',
      }}
    >
      {/* Warehouse Name */}
      <Box sx={{ minWidth: 160 }}>
        <Typography sx={labelStyle}>Warehouse Name</Typography>
        <TextField
          placeholder="Warehouse Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{
            width: '100%',
            '& .MuiInputBase-root': { height: 32, fontSize: 12 },
          }}
        />
      </Box>

      {/* State */}
      <Box sx={{ minWidth: 130 }}>
        <Typography sx={labelStyle}>State</Typography>
        <FormControl size="small" sx={{ width: '100%' }}>
          <Select
            displayEmpty
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            renderValue={(v) => v || 'Select State'}
            sx={selectStyle}
          >
            {states.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* City */}
      <Box sx={{ minWidth: 130 }}>
        <Typography sx={labelStyle}>City</Typography>
        <FormControl size="small" sx={{ width: '100%' }}>
          <Select
            displayEmpty
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            renderValue={(v) => v || 'Select City'}
            disabled={!state}
            sx={selectStyle}
          >
            {citiesForState.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 12 }}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Search */}
      <Button
        variant="contained"
        onClick={handleSearchClick}
        sx={{ height: 32, fontSize: 12, px: 1.6, textTransform: 'none', fontWeight: 600 }}
      >
        Search
      </Button>

      {/* Reset */}
      <Button
        variant="contained"
        onClick={handleReset}
        sx={{ height: 32, fontSize: 12, px: 1.6, textTransform: 'none', fontWeight: 600, color: '#000', boxShadow: 'none' }}
      >
        Reset
      </Button>
    </Box>
  );
};
