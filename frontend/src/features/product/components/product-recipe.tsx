"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Package,
  ImageOff,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Loader2,
  Tag,
  Boxes,
} from "lucide-react";

import { Product } from "../types/product-types";
import { productService } from "../services/product.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { RawMaterial } from "@/features/raw-material/types/raw-material-types";
import { rawMaterialService } from "@/features/raw-material/services/raw-material.service";
import { Unit, unitService } from "@/global/unit";
import { recipeService } from "../services/recipe.service";
import { toast } from "sonner";

type RecipeItem = {
  id: string;
  rawMaterialId: string;
  quantity: number;
  unitId: string;
};

type AvailableUnit = {
  id: string;
  name: string;
  code: string;
  factor: number;
  source: "BASE" | "RAW_MATERIAL" | "GLOBAL";
};

const formatRp = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const ProductRecipePage = () => {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product>();
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [imageError, setImageError] = useState(false);

  // Load product, raw materials, units, and existing recipe (if any)
  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        setLoading(true);
        const [data, rawMaterialRes, unitRes, recipes] = await Promise.all([
          productService.findOne(productId),
          rawMaterialService.findAll({ page: 1, limit: 1000 }),
          unitService.findAll(),
          recipeService.findAll(productId),
        ]);

        setProduct(data);
        setRawMaterials(rawMaterialRes.data);
        setUnits(unitRes);
        setRecipeItems(
          recipes.map((r: any) => ({
            id: r.id,
            rawMaterialId: r.rawMaterialId,
            quantity: Number(r.quantity),
            unitId: r.rawMaterial.unit.id,
          })),
        );
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const getMaterial = (rawMaterialId: string) =>
    rawMaterials.find((m) => m.id === rawMaterialId);

  const getUnit = (unitId: string) => units.find((u) => u.id === unitId);

  // unit -> unit conversion factor, checking global unit table (with reverse fallback)
  const findGlobalConversion = (
    fromId: string,
    toId: string,
  ): number | null => {
    if (fromId === toId) return 1;
    const from = getUnit(fromId);
    const to = getUnit(toId);
    if (!from || !to) return null;

    const direct = from.conversionsFrom?.find((c) => c.toUnitId === toId);
    if (direct) return Number(direct.factor);

    const reverse = from.conversionsTo?.find((c) => c.fromUnitId === toId);
    if (reverse) {
      const factor = Number(reverse.factor);
      return factor === 0 ? null : 1 / factor;
    }
    return null;
  };

  const findRawMaterialConversion = (
    material: RawMaterial,
    fromId: string,
    toId: string,
  ): number | null => {
    if (fromId === toId) return 1;

    if (toId === material.unitId) {
      const c = material.conversions?.find((c) => c.unit.id === fromId);
      if (c) return Number(c.factor);
    }

    if (fromId === material.unitId) {
      const c = material.conversions?.find((c) => c.unit.id === toId);
      if (c) {
        const factor = Number(c.factor);
        return factor === 0 ? null : 1 / factor;
      }
    }
    return null;
  };

  // Priority: same unit -> raw material conversion -> global conversion -> null
  const getConversionFactor = (
    material: RawMaterial,
    fromId: string,
    toId: string,
  ): number | null =>
    fromId === toId
      ? 1
      : (findRawMaterialConversion(material, fromId, toId) ??
        findGlobalConversion(fromId, toId));

  // Dropdown options for a material: base unit, its own conversions, then any
  // global unit that has a convertible path to the base unit
  const getAvailableUnits = (material?: RawMaterial): AvailableUnit[] => {
    if (!material) return [];

    const result: AvailableUnit[] = [
      {
        id: material.unitId,
        name: material.unit?.name ?? "-",
        code: material.unit?.code ?? "-",
        factor: 1,
        source: "BASE",
      },
    ];

    material.conversions?.forEach((c) => {
      if (result.some((u) => u.id === c.unit.id)) return;
      result.push({
        id: c.unit.id,
        name: c.unit.name,
        code: c.unit.code,
        factor: Number(c.factor),
        source: "RAW_MATERIAL",
      });
    });

    units.forEach((unit) => {
      if (unit.id === material.unitId) return;
      if (result.some((u) => u.id === unit.id)) return;

      const factor = getConversionFactor(material, unit.id, material.unitId);
      if (factor === null) return;

      result.push({
        id: unit.id,
        name: unit.name,
        code: unit.code,
        factor,
        source: "GLOBAL",
      });
    });

    return result;
  };

  const addRecipeItem = () =>
    setRecipeItems((cur) => [
      ...cur,
      { id: crypto.randomUUID(), rawMaterialId: "", quantity: 0, unitId: "" },
    ]);

  const removeRecipeItem = (id: string) =>
    setRecipeItems((cur) => cur.filter((item) => item.id !== id));

  const updateRawMaterial = (id: string, rawMaterialId: string) => {
    const material = getMaterial(rawMaterialId);
    setRecipeItems((cur) =>
      cur.map((item) =>
        item.id === id
          ? {
              ...item,
              rawMaterialId,
              quantity: 0,
              unitId: material?.unitId ?? "",
            }
          : item,
      ),
    );
  };

  const updateQuantity = (id: string, quantity: number) =>
    setRecipeItems((cur) =>
      cur.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );

  const updateUnit = (id: string, unitId: string) =>
    setRecipeItems((cur) =>
      cur.map((item) => (item.id === id ? { ...item, unitId } : item)),
    );

  // Converts an item's entered quantity/unit into the material's base unit quantity
  const calculateBaseQuantity = (item: RecipeItem): number | null => {
    const material = getMaterial(item.rawMaterialId);
    if (!material || !item.quantity || item.quantity <= 0 || !item.unitId)
      return null;

    const factor = getConversionFactor(material, item.unitId, material.unitId);
    return factor === null ? null : item.quantity * factor;
  };

  // averageCost is priced per base unit, so cost = averageCost * baseQuantity
  const calculateItemCost = (item: RecipeItem) => {
    const material = getMaterial(item.rawMaterialId);
    const baseQuantity = calculateBaseQuantity(item);
    return !material || baseQuantity === null
      ? 0
      : Number(material.averageCost) * baseQuantity;
  };

  const totalCost = useMemo(
    () =>
      recipeItems.reduce((total, item) => total + calculateItemCost(item), 0),
    [recipeItems, rawMaterials, units],
  );

  const isItemValid = (item: RecipeItem) => {
    if (!item.rawMaterialId || !item.unitId) return false;
    if (!item.quantity || item.quantity <= 0) return false;

    const material = getMaterial(item.rawMaterialId);
    if (!material) return false;

    return getConversionFactor(material, item.unitId, material.unitId) !== null;
  };

  const handleSave = async () => {
    if (recipeItems.length === 0) {
      toast.warning("Tambahkan minimal satu bahan.");
      return;
    }

    if (recipeItems.some((item) => !isItemValid(item))) {
      toast.warning(
        "Masih ada bahan yang belum lengkap atau satuannya tidak memiliki conversion menuju satuan dasar.",
      );
      return;
    }

    const rawMaterialIds = recipeItems.map((item) => item.rawMaterialId);
    if (new Set(rawMaterialIds).size !== rawMaterialIds.length) {
      toast.warning(
        "Bahan baku yang sama tidak boleh dimasukkan lebih dari satu kali.",
      );
      return;
    }

    const payload = {
      items: recipeItems.map(({ rawMaterialId, quantity, unitId }) => ({
        rawMaterialId,
        quantity,
        unitId,
      })),
    };

    try {
      setSaving(true);

      if (recipeId) {
        await recipeService.update(productId, payload);
        toast.success("Resep berhasil diperbarui.");
      } else {
        const created = await recipeService.create(productId, payload);
        if (created?.id) setRecipeId(created.id);
        toast.success("Resep berhasil dibuat.");
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Gagal menyimpan resep.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat resep...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 px-4 text-center">
        <Package className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Produk tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Produk yang ingin dibuatkan resep tidak tersedia.
          </p>
        </div>
        <Button variant="outline">
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Produk
          </Link>
        </Button>
      </div>
    );
  }

  // NOTE: sesuaikan nama field berikut kalau interface Product kamu berbeda.
  const productImage = (product as any).imageUrl as string | undefined;
  const productDescription = (product as any).description as string | undefined;
  const productPrice = (product as any).sellingPrice as number | undefined;
  const productStock = (product as any).stock as number | undefined;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* HEADER */}
      <div className="space-y-3">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Produk
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
            <ChefHat className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Resep Produk
              </h1>
              {recipeId && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  Edit
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Atur bahan baku yang digunakan untuk membuat produk.
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
          <CardDescription>
            Produk yang akan menggunakan resep ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Product image — simple fixed thumbnail, no overlay */}
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-lg border bg-muted sm:mx-0 sm:h-32 sm:w-32">
              {productImage && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                  <span className="text-[10px]">Tidak ada foto</span>
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Tag className="h-3 w-3" />
                    {product.type}
                  </Badge>
                  {product.sku && (
                    <Badge variant="secondary" className="font-normal">
                      SKU: {product.sku}
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {product.name}
                </h2>

                {productDescription && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {productDescription}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-start">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Harga Jual
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {typeof productPrice === "number"
                      ? formatRp(productPrice)
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-muted-foreground sm:justify-start">
                    <Boxes className="h-3 w-3" />
                    Stok
                  </p>
                  <p className="text-lg font-bold">
                    {typeof productStock === "number"
                      ? productStock.toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RECIPE */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Bahan Baku</CardTitle>
              <CardDescription>
                Tambahkan bahan baku dan jumlah yang digunakan untuk membuat
                satu produk.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={addRecipeItem}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Bahan
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {recipeItems.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ChefHat className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">Belum ada bahan baku</p>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Tambahkan bahan baku untuk membuat resep produk.
              </p>
              <Button onClick={addRecipeItem}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Bahan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Column header — desktop only */}
              <div className="hidden gap-3 px-2 text-sm font-medium text-muted-foreground md:grid md:grid-cols-[2fr_110px_160px_140px_40px]">
                <span>Bahan Baku</span>
                <span>Jumlah</span>
                <span>Satuan</span>
                <span className="text-right">Estimasi Modal</span>
                <span />
              </div>

              {recipeItems.map((item) => {
                const material = getMaterial(item.rawMaterialId);
                const availableUnits = getAvailableUnits(material);
                const itemCost = calculateItemCost(item);
                const baseQuantity = calculateBaseQuantity(item);
                const selectedUnit = availableUnits.find(
                  (u) => u.id === item.unitId,
                );
                const isValid = isItemValid(item);

                return (
                  <div
                    key={item.id}
                    className="space-y-2 rounded-lg border p-3 md:rounded-none md:border-0 md:border-b md:p-2 md:pb-4 last:md:border-0"
                  >
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_110px_160px_140px_40px] md:items-center md:gap-3">
                      <select
                        value={item.rawMaterialId}
                        onChange={(e) =>
                          updateRawMaterial(item.id, e.target.value)
                        }
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Pilih bahan baku</option>
                        {rawMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2 md:contents">
                        <Input
                          type="number"
                          min={0}
                          step="0.001"
                          value={item.quantity || ""}
                          placeholder="Jumlah"
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                        />

                        <select
                          value={item.unitId}
                          disabled={!material}
                          onChange={(e) => updateUnit(item.id, e.target.value)}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
                        >
                          <option value="">Pilih satuan</option>
                          {availableUnits.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between md:justify-end">
                        <span className="text-xs text-muted-foreground md:hidden">
                          Estimasi Modal
                        </span>
                        <span className="text-sm font-medium">
                          {formatRp(itemCost)}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-destructive hover:text-destructive md:ml-0"
                        onClick={() => removeRecipeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {material && (
                      <div className="space-y-1 px-0 text-xs text-muted-foreground md:px-2">
                        <div>
                          Harga rata-rata:{" "}
                          <span className="font-medium text-foreground">
                            {formatRp(Number(material.averageCost))}
                          </span>{" "}
                          / {material.unit?.name}
                        </div>

                        {selectedUnit && baseQuantity !== null && (
                          <div>
                            {item.quantity.toLocaleString("id-ID")}{" "}
                            {selectedUnit.name} ={" "}
                            <span className="font-medium text-foreground">
                              {baseQuantity.toLocaleString("id-ID")}{" "}
                              {material.unit?.name}
                            </span>
                            {selectedUnit.source === "RAW_MATERIAL" && (
                              <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                                Conversion bahan
                              </span>
                            )}
                            {selectedUnit.source === "GLOBAL" && (
                              <span className="ml-2 rounded bg-muted px-1.5 py-0.5">
                                Global conversion
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {material &&
                      item.unitId &&
                      item.quantity > 0 &&
                      !isValid && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>
                            Satuan <strong>{selectedUnit?.name}</strong> tidak
                            memiliki conversion menuju{" "}
                            <strong>{material.unit?.name}</strong>.
                          </span>
                        </div>
                      )}
                  </div>
                );
              })}

              <Separator />

              <div className="flex justify-end">
                <div className="w-full space-y-3 sm:min-w-[300px] sm:w-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jumlah bahan</span>
                    <span>{recipeItems.length} bahan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Modal Resep</span>
                    <span className="text-xl font-bold">
                      {formatRp(totalCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end sm:static">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving || recipeItems.length === 0}
          className="w-full shadow-lg sm:w-auto sm:shadow-none"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {recipeId ? "Update Resep" : "Simpan Resep"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductRecipePage;
