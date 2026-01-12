"use client";

import { getBrands } from "@/app/actions/brand/getBrands";
import { useState, useEffect } from "react";
import { Link as LinkIcon, PenLine } from "lucide-react";
import TabToggle from "../TabToggle";
import ManualPerfumeForm from "./ManualPerfumeForm";
import FragranticaImport from "./FragranticaImport";

interface Brand {
  id: string;
  name: string;
}

type Mode = "manual" | "fragrantica";

const modeTabs = [
  { key: "manual", label: "Manual", icon: PenLine },
  { key: "fragrantica", label: "Fragrantica", icon: LinkIcon },
];

const AddPerfumeForm = () => {
  const [mode, setMode] = useState<Mode>("manual");
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  const handleBrandAdded = (brand: Brand) => {
    setBrands((prev) => [...prev, brand]);
  };

  return (
    <div className="space-y-4 max-w-md">
      <TabToggle
        tabs={modeTabs}
        selected={mode}
        onChange={(key) => setMode(key as Mode)}
      />

      {mode === "manual" ? (
        <ManualPerfumeForm brands={brands} />
      ) : (
        <FragranticaImport brands={brands} onBrandAdded={handleBrandAdded} />
      )}
    </div>
  );
};

export default AddPerfumeForm;
