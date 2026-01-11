export interface WarehouseData {
  _id?: string;
  warehouseId?: string;
  warehouse_name: string;
  address1: string;
  address2?: string;
  areaLocality: string;
  state: string;
  city: string;
  pincode: string;
  gstno?: string;
  totalLotArea: number;
  coveredArea: number;
  noOfDocs?: number;
  noOfGate?: number;
  storageHeight?: number;
  parkingArea?: number;
  status: 'publish' | 'unpublish' | 'in_active';
  warehouseImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
