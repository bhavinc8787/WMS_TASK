'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import { WarehouseData } from '@/types';

// Warehouse table component
export const WarehouseTable = ({
  warehouses,
  onEdit,
  onDelete,
  isLoading = false,
  page,
  totalPages,
  onPageChange,
}: {
  warehouses: WarehouseData[];
  onEdit: (w: WarehouseData) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // State for image preview dialog
  const [open, setOpen] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

  // Open image dialog with max 4 images
  const handleOpenImages = (images: string[] | undefined) => {
    if (!images?.length) return;
    setSelectedImages(images.slice(0, 4)); // max 4
    setOpen(true);
  };

  // Close image dialog and reset images
  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  return (
    <Box>
      {/* TABLE CONTAINER */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #ddd', overflow: 'hidden' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: 11, py: 0.5 } }}>
          {/* TABLE HEADER */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1411e4' }}>
              {[
                'Warehouse Name',
                'Address',
                'City',
                'State',
                'Total Space (sqft)',
                'Covered Space (sqft)',
                'Image',
                'Status',
                'Action',
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 11,
                    borderRight: '1px solid rgba(255,255,255,0.3)',
                    py: 0.7,
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3 }}>
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3, fontSize: 11, fontWeight: 500 }}>
                  No warehouses found
                </TableCell>
              </TableRow>
            ) : (

              /* Warehouse rows */
              warehouses.map((warehouse, index) => (
                <TableRow
                  key={warehouse._id || ''}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                    height: 30,
                  }}
                >
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>{warehouse.warehouse_name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>
                    {warehouse.address1}
                    {warehouse.address2 ? `, ${warehouse.address2}` : ''}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>{warehouse.city}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>{warehouse.state}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>{warehouse.totalLotArea}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: 11 }}>{warehouse.coveredArea}</TableCell>

                  {/* IMAGE ICON COLUMN */}
                  <TableCell sx={{ borderRight: '1px solid #ddd', textAlign: 'center' }}>
                    {warehouse.warehouseImages && warehouse.warehouseImages.length > 0 ? (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenImages(warehouse.warehouseImages)}
                      >
                        <ImageIcon sx={{ fontSize: 16, color: '#fff', bgcolor: '#1411e4', borderRadius: 1, p: 0.3 }} />
                      </IconButton>
                    ) : (
                      <Typography sx={{ fontSize: 10, opacity: 0.6 }}>No Image</Typography>
                    )}
                  </TableCell>


                  {/* STATUS */}
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                    <Chip
                      label={warehouse.status === 'publish' ? 'Published' : 'Unpublished'}
                      size="small"
                      sx={{
                        backgroundColor: warehouse.status === 'publish' ? '#00AEEF' : '#FF3B3B',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '4px',
                        height: 20,
                        fontSize: 9,
                      }}
                    />
                  </TableCell>

                  {/* Action Buttons Delet & Edit */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => onEdit(warehouse)}>
                        <EditIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDelete(warehouse._id || '')}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => onPageChange(v)}
            size="small"
            sx={{ '& .MuiPaginationItem-root': { fontSize: 11, height: 26, minWidth: 26 } }}
          />
        </Box>
      )}

      {/* IMAGE POPUP */}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>Warehouse Images</DialogTitle>
        <DialogContent>
          {selectedImages.length === 0 ? (
            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>No images available</Typography>
          ) : (
            <Grid container spacing={2}>
              {selectedImages.map((img, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper sx={{ p: 0.5, borderRadius: 2, height: 120, display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={`http://localhost:5000/uploads/warehouses/${img.split(/[/\\]/).pop()}`}


                      alt="warehouse"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default WarehouseTable;
