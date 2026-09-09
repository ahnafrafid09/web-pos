"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import {
  RawMaterialFormValues,
  rawMaterialSchema,
} from "../schemas/raw-material-schema";

import { formatRupiahInput, parseRupiah } from "@/lib/utils/currency";

import type { Unit } from "@/global/unit";

interface RawMaterialFormProps {
  units: Unit[];

  defaultValues?: Partial<RawMaterialFormValues>;

  onSubmit: (data: RawMaterialFormValues) => void | Promise<void>;

  submitLabel?: string;

  isLoading?: boolean;

  onCancel?: () => void;
}

export function RawMaterialForm({
  units,
  defaultValues,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  onCancel,
}: RawMaterialFormProps) {
  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),

    defaultValues: {
      name: "",
      sku: "",
      unitId: "",
      averageCost: 0,
      minimumStock: 0,
      conversions: [],

      ...defaultValues,
    },
  });

  console.log(defaultValues);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conversions",
  });

  const baseUnitId = form.watch("unitId");

  const baseUnit = units.find((unit) => unit.id === baseUnitId) ?? null;

  const availableConversionUnits = units.filter(
    (unit) => unit.id !== baseUnitId,
  );

  // ============================================================
  // RESET INVALID CONVERSION
  // ============================================================

  useEffect(() => {
    const conversions = form.getValues("conversions") ?? [];

    if (!baseUnitId || conversions.length === 0) {
      return;
    }

    const filteredConversions = conversions.filter(
      (conversion) => conversion.unitId !== baseUnitId,
    );

    if (filteredConversions.length !== conversions.length) {
      form.setValue("conversions", filteredConversions, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [baseUnitId, form]);

  const handleSubmit = async (data: RawMaterialFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name">Nama Bahan Baku</label>

        <Input
          id="name"
          placeholder="Contoh: Beras"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* ====================================================== */}
      {/* SKU */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label htmlFor="sku">
          SKU <span className="text-muted-foreground">(Opsional)</span>
        </label>

        <Input
          id="sku"
          placeholder="Contoh: BB-001"
          {...form.register("sku")}
        />

        {form.formState.errors.sku && (
          <p className="text-sm text-destructive">
            {form.formState.errors.sku.message}
          </p>
        )}
      </div>

      {/* ====================================================== */}
      {/* BASE UNIT */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label>Satuan Dasar</label>

        <Controller
          control={form.control}
          name="unitId"
          render={({ field, fieldState }) => {
            const selectedUnit =
              units.find((unit) => unit.id === field.value) ?? null;

            return (
              <>
                <Combobox
                  items={units}
                  value={selectedUnit}
                  onValueChange={(unit) => {
                    field.onChange(unit?.id ?? "");
                  }}
                  itemToStringValue={(unit) => unit.id}
                  itemToStringLabel={(unit) => unit.name}
                >
                  <ComboboxInput placeholder="Pilih satuan dasar" />

                  <ComboboxContent>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item}>
                          <div className="flex w-full items-center justify-between">
                            <span>{item.name}</span>

                            <span className="text-xs text-muted-foreground">
                              {item.code}
                            </span>
                          </div>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                <p className="text-xs text-muted-foreground">
                  Satuan dasar digunakan sebagai satuan penyimpanan stok.
                </p>

                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            );
          }}
        />
      </div>

      {/* ====================================================== */}
      {/* AVERAGE COST */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label htmlFor="averageCost">
          Biaya Rata-rata
          {baseUnit ? ` / ${baseUnit.name}` : ""}
        </label>

        <Input
          id="averageCost"
          type="text"
          inputMode="numeric"
          placeholder="Masukkan biaya rata-rata"
          value={formatRupiahInput(form.watch("averageCost") ?? 0)}
          onChange={(event) => {
            form.setValue("averageCost", parseRupiah(event.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />

        <p className="text-xs text-muted-foreground">
          Harga modal disimpan berdasarkan satuan dasar.
          {baseUnit && ` Contoh: Rp15.000 per ${baseUnit.name}.`}
        </p>

        {form.formState.errors.averageCost && (
          <p className="text-sm text-destructive">
            {form.formState.errors.averageCost.message}
          </p>
        )}
      </div>

      {/* ====================================================== */}
      {/* MINIMUM STOCK */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label htmlFor="minimumStock">
          Stok Minimal
          {baseUnit ? ` (${baseUnit.name})` : ""}
        </label>

        <Input
          id="minimumStock"
          type="text"
          inputMode="numeric"
          placeholder="Masukkan minimum stok"
          value={formatRupiahInput(form.watch("minimumStock") ?? 0)}
          onChange={(event) => {
            form.setValue("minimumStock", parseRupiah(event.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />

        {form.formState.errors.minimumStock && (
          <p className="text-sm text-destructive">
            {form.formState.errors.minimumStock.message}
          </p>
        )}
      </div>

      {/* ====================================================== */}
      {/* CONVERSIONS */}
      {/* ====================================================== */}

      <div className="space-y-4 rounded-lg border p-4">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">Kemasan Pembelian</h3>

            <p className="text-sm text-muted-foreground">
              Tentukan ukuran kemasan yang biasa digunakan saat membeli bahan
              baku.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                unitId: "",
                factor: 1,
              })
            }
            disabled={
              isLoading ||
              !baseUnitId ||
              fields.length >= availableConversionUnits.length
            }
          >
            + Tambah
          </Button>
        </div>

        {/* BELUM ADA BASE UNIT */}

        {!baseUnitId && (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            Pilih satuan dasar terlebih dahulu.
          </div>
        )}

        {/* EMPTY */}

        {baseUnitId && fields.length === 0 && (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            Belum ada kemasan pembelian.
          </div>
        )}

        {/* ================================================== */}
        {/* CONVERSION ITEMS */}
        {/* ================================================== */}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const conversion = form.watch(`conversions.${index}`);

            const selectedUnit =
              units.find((unit) => unit.id === conversion?.unitId) ?? null;

            // Ambil unit yang sudah dipakai
            const usedUnitIds = (form.getValues("conversions") ?? [])
              .map((conversion, conversionIndex) =>
                conversionIndex !== index ? conversion.unitId : null,
              )
              .filter((id): id is string => Boolean(id));

            // Filter unit
            const conversionUnits = availableConversionUnits.filter(
              (unit) =>
                !usedUnitIds.includes(unit.id) ||
                unit.id === conversion?.unitId,
            );

            return (
              <div key={field.id} className="rounded-md border p-3">
                <div className="flex items-end gap-3">
                  {/* UNIT */}

                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="text-sm">Kemasan</label>

                    <Controller
                      control={form.control}
                      name={`conversions.${index}.unitId`}
                      render={({ field: unitField, fieldState }) => (
                        <>
                          <Combobox
                            items={conversionUnits}
                            value={selectedUnit}
                            onValueChange={(unit) => {
                              unitField.onChange(unit?.id ?? "");
                            }}
                            itemToStringValue={(unit) => unit.id}
                            itemToStringLabel={(unit) => unit.name}
                          >
                            <ComboboxInput placeholder="Pilih kemasan" />

                            <ComboboxContent>
                              <ComboboxList>
                                {(item) => (
                                  <ComboboxItem key={item.id} value={item}>
                                    <div className="flex w-full items-center justify-between">
                                      <span>{item.name}</span>

                                      <span className="text-xs text-muted-foreground">
                                        {item.code}
                                      </span>
                                    </div>
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>

                          {fieldState.error && (
                            <p className="text-sm text-destructive">
                              {fieldState.error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* FACTOR */}

                  <div className="w-32 shrink-0 space-y-2">
                    <label
                      htmlFor={`conversion-factor-${index}`}
                      className="text-sm"
                    >
                      Isi
                    </label>

                    <Input
                      id={`conversion-factor-${index}`}
                      type="number"
                      min="0"
                      step="any"
                      placeholder="25"
                      {...form.register(`conversions.${index}.factor`, {
                        valueAsNumber: true,
                      })}
                    />

                    {form.formState.errors.conversions?.[index]?.factor && (
                      <p className="text-sm text-destructive">
                        {
                          form.formState.errors.conversions[index]?.factor
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* HAPUS */}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                  >
                    Hapus
                  </Button>
                </div>

                {/* PREVIEW */}

                <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
                  {selectedUnit && baseUnit ? (
                    <>
                      1 <strong>{selectedUnit.name}</strong> ={" "}
                      <strong>{conversion?.factor ?? 0}</strong> {baseUnit.name}
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Pilih kemasan dan masukkan isi kemasan.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================== */}
        {/* EXAMPLE */}
        {/* ================================================== */}

        {baseUnit && fields.length > 0 && (
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Contoh</p>

            <p className="mt-1">
              Jika satuan dasar adalah <strong>{baseUnit.name}</strong>:
            </p>

            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>1 Karung = 25 {baseUnit.name}</li>
              <li>1 Dus = 200 {baseUnit.name}</li>
            </ul>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* BUTTON */}
      {/* ====================================================== */}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
