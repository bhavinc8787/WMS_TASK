"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ListSpaceForm from "./ListSpaceForm";

// Page component that handles query params and renders the form
export default function ListSpacePage() {
  // Read URL search parameters (e.g. ?id=123)
  const searchParams = useSearchParams();

  // Extract warehouse ID from query params
  const warehouseId = searchParams.get("id");

  return (
    // Suspense boundary for async hooks like useSearchParams
    <Suspense fallback={<div>Loading warehouse form...</div>}>
      {/* Pass warehouseId directly to the form */}
      <ListSpaceForm warehouseId={warehouseId} />
    </Suspense>
  );
}
