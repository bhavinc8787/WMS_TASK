import { Router } from 'express';
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  searchWarehouses,
  updateWarehouseStatus
} from '../controllers/warehouseController';
import { uploadWarehouseImages } from '../middleware/upload';

const router = Router();

router.get('/', getAllWarehouses);
router.get('/search', searchWarehouses);
router.get('/:id', getWarehouseById);
router.post('/', uploadWarehouseImages, createWarehouse);
router.put('/:id', uploadWarehouseImages, updateWarehouse);
router.delete('/:id', deleteWarehouse);
router.patch('/:id/status', updateWarehouseStatus);

export default router;
