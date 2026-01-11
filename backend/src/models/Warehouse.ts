
import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  warehouseId: string; // unique ID for each warehouse
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
  status: {
    type: String,
    enum: ['publish', 'unpublish', 'in_active'],
    default: 'unpublish',
  },
  warehouseImages?: string[];
  createdAt: Date;
  updatedAt: Date;
  
}

function arrayLimit(val: any[]) {
  return val.length <= 4;
}

const warehouseSchema = new Schema(
  {
    warehouseId: {
      type: String,
      required: true,
      unique: true,
      default: () => `WH-${Date.now()}`, // Auto-generate unique warehouse ID
    },
    warehouse_name: {
      type: String,
      required: [true, 'Warehouse name is required *'],
    },
    address1: {
      type: String,
      required: [true, 'Address1 is required *'],
    },
    address2: {
      type: String,
    },
    areaLocality: {
      type: String,
      required: [true, 'Area Locality is required *'],
    },
    state: {
      type: String,
      required: [true, 'State is required *'],
    },
    city: {
      type: String,
      required: [true, 'City is required *'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required *'],
    },
    gstno: {
      type: String,
    },
    totalLotArea: {
      type: Number,
      required: [true, 'Total lot area is required *'],
    },
    coveredArea: {
      type: Number,
      required: [true, 'Covered area is required *'],
    },
    noOfDocs: {
      type: Number,
    },
    noOfGate: {
      type: Number,
    },
    storageHeight: {
      type: Number,
    },
    parkingArea: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['publish', 'unpublish'],
      default: 'unpublish',
    },
    warehouseImages: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
