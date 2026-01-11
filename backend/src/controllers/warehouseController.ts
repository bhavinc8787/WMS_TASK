import {Request, Response } from 'express';
import Warehouse from '../models/Warehouse';
// import { Request } from '../middleware/';
import path from 'path';
// Get all warehouses created by logged-in user
export const getAllWarehouses = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const filter = { status: { $ne: 'in_active' } };

    const total = await Warehouse.countDocuments(filter);
    const warehouses = await Warehouse.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: warehouses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get warehouse by Mongo _id
export const getWarehouseById = async (req: Request, res: Response) => { try { const warehouse = await Warehouse.findById(req.params.id); if (!warehouse) { return res.status(404).json({ success: false, message: 'Warehouse not found' }); } res.json({ success: true, data: warehouse }); } catch (error: any) { res.status(500).json({ success: false, message: error.message }); } };



export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const missing: string[] = [];
    if (!payload.warehouse_name) missing.push('warehouse_name');
    if (!payload.address1) missing.push('address1');
    if (!payload.areaLocality) missing.push('areaLocality');
    if (!payload.state) missing.push('state');
    if (!payload.city) missing.push('city');
    if (!payload.totalLotArea) missing.push('totalLotArea');
    if (!payload.coveredArea) missing.push('coveredArea');

    if (missing.length) {
      return res.status(400).json({ success: false, message: 'Missing required fields', missing });
    }

    const imagePaths = (req.files as Express.Multer.File[])?.map(file =>
      `/uploads/warehouses/${path.basename(file.path)}`
    ) || [];

    const warehouse = new Warehouse({
      ...payload,
      totalLotArea: Number(payload.totalLotArea),
      coveredArea: Number(payload.coveredArea),
      noOfDocs: payload.noOfDocs ? Number(payload.noOfDocs) : undefined,
      noOfGate: payload.noOfGate ? Number(payload.noOfGate) : undefined,
      storageHeight: payload.storageHeight ? Number(payload.storageHeight) : undefined,
      parkingArea: payload.parkingArea ? Number(payload.parkingArea) : undefined,
      warehouseImages: imagePaths, // 👈 FIXED
    });

    await warehouse.save();
    res.status(201).json({ success: true, data: warehouse });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update warehouse (only if exists)
export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const newImages = (req.files as Express.Multer.File[])?.map(file =>
      `/uploads/warehouses/${path.basename(file.path)}`
    ) || [];

    if (newImages.length) {
      warehouse.warehouseImages = [...(warehouse.warehouseImages || []), ...newImages].slice(0, 4);
    }

    Object.assign(warehouse, req.body);
    await warehouse.save();

    res.json({ success: true, data: warehouse });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete warehouse
// export const deleteWarehouse = async (req: Request, res: Response) => {
//   try {
//     const warehouse = await Warehouse.findById(req.params.id);
//     if (!warehouse) {
//       return res.status(404).json({ success: false, message: 'Warehouse not found' });
//     }

//     await Warehouse.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Warehouse deleted successfully' });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// controllers/warehouseController.ts
export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { status: 'in_active' },   // 👈 soft delete
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    res.json({ success: true, message: 'Warehouse inactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Search warehouses by name or locality or city
// Search warehouses with pagination
export const searchWarehouses = async (req: Request, res: Response) => {
  try {
    const q = req.query.q?.toString();
    const state = req.query.state?.toString();
    const city = req.query.city?.toString();

    const andParts:any[] = [
      { status: { $ne: 'in_active' } } 
    ];

    if (state) andParts.push({ state:{ $regex:`^${state}$`, $options:'i' }});
    if (city) andParts.push({ city:{ $regex:city, $options:'i' }});
    if (q) andParts.push({ $or:[
      { warehouse_name:{ $regex:q, $options:'i' }},
      { areaLocality:{ $regex:q, $options:'i' }},
      { city:{ $regex:q, $options:'i' }},
      { state:{ $regex:q, $options:'i' }},
    ]});

    const finalQuery = andParts.length===0 ? {} : andParts.length===1 ? andParts[0] : { $and:andParts };

    // --- Pagination Added ---
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const total = await Warehouse.countDocuments(finalQuery);
    const warehouses = await Warehouse.find(finalQuery)
      .sort({ createdAt:-1 })
      .skip(skip)
      .limit(limit);

    res.json({ success:true, data:warehouses, total, page, totalPages: Math.ceil(total/limit) });
  } catch (error:any) {
    res.status(500).json({ success:false, message:error.message });
  }
};

// Publish / Unpublish status toggle API
export const updateWarehouseStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['publish', 'unpublish'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    res.json({ success: true, data: warehouse });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
