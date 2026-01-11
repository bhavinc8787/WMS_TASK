'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { WarehouseTable } from '@/app/components/WarehouseTable';
import { SearchBar } from '@/app/components/SearchBar';
import { WarehouseData } from '@/types';
import { warehouseAPI } from '@/lib/api';
import { Home, ShoppingCart } from 'lucide-react';

export default function DashboardPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<WarehouseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [formOpen, setFormOpen] = useState(false);
  // const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | undefined>();
  const [page, setPage] = useState(1);
  const limit = 7;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchWarehouses(page);
  }, [page]);

  const router = useRouter();

  const fetchWarehouses = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const res = await warehouseAPI.getAll(currentPage, limit);
      const data = res.data.data || [];
      
      if (data.length === 0 && currentPage > 1) {
        setPage(currentPage - 1);
        return;
      }
      
      setWarehouses(data);
      setFilteredWarehouses(data);

      // Store pagination info from backend
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to load warehouses', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = async (query: string | { q?: string; state?: string; city?: string }) => {
    if (typeof query === 'string' && !query.trim()) {
      setPage(1);
      fetchWarehouses(1);
      return;
    }

    if (typeof query === 'object') {
      const { q, state, city } = query || {};
      if ((!q || !q.trim()) && !state && !city) {
        setPage(1);
        fetchWarehouses(1);
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await warehouseAPI.search(query);
      const data = res.data.data || [];
      setFilteredWarehouses(data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(1);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleDeleteWarehouse = async (id: string) => {
    if (confirm('Delete this warehouse?')) {
      setIsLoading(true);
      try {
        await warehouseAPI.deleteWarehouse(id);
  
        // refetch SAME page
        fetchWarehouses(page);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const handleEditWarehouse = (w: WarehouseData) => {
    // navigate to the list-space form in edit mode using app router
    const id = w._id || w.warehouseId || '';
    router.push(`/dashboard/list-space?id=${id}`);
  };

  const visibleWarehouses = filteredWarehouses.filter(
    w => w.status !== 'in_active'
  );

  return (
    <Box>
      {/* Top Bar  */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '16px', fontWeight: 700, color: '#151515' }}>
          <Home size={20} />
          Listed Warehouse
        </Box>

        <Button
          onClick={() => router.push('/dashboard/list-space')}
          variant="contained"
          startIcon={<ShoppingCart size={18} />}
          sx={{
            background: '#1411e4',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '6px',
            px: 2
          }}
        >
          List Your Space
        </Button>
      </Box>

      <SearchBar onSearch={handleSearch} />

      {/* Main content */}
      <WarehouseTable
       warehouses={visibleWarehouses} 
        onEdit={handleEditWarehouse}
        onDelete={handleDeleteWarehouse}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </Box>
  );
}
