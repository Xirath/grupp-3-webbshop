"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/app/types";
import { updateProductAction, type ProductEditState } from "./actions";

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

function initialState(product: Product): ProductEditState {
  return {
    values: {
      title: product.title,
      brand: product.brand ?? "",
      price: String(product.price),
      stock: String(product.stock ?? 0),
      weight: product.weight === undefined ? "" : String(product.weight),
      rating: product.rating === undefined ? "" : String(product.rating),
      sku: product.sku ?? "",
      categoryId: String(product.categoryId),
      warrantyInformation: product.warrantyInformation ?? "",
      tags: (product.tags ?? []).join(", "),
      thumbnail: product.thumbnail,
      description: product.description,
    },
    errors: {},
  };
}

export default function ProductEditForm({
  product,
  categories,
}: ProductEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProductAction.bind(null, product.id),
    initialState(product),
  );
  const value = (name: string) => state.values[name] ?? "";

  return (
    <form
      key={JSON.stringify(state.values)}
      action={formAction}
      className="space-y-5"
      noValidate
      aria-busy={isPending}
    >
      {state.formError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {state.formError}
        </p>
      )}
      <Field
        name="title"
        label="Title"
        value={value("title")}
        error={state.errors.title?.[0]}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="brand"
          label="Brand"
          value={value("brand")}
          error={state.errors.brand?.[0]}
        />
        <Field
          name="sku"
          label="SKU"
          value={value("sku")}
          error={state.errors.sku?.[0]}
        />
        <Field
          name="price"
          label="Price"
          type="number"
          min="0"
          step="0.01"
          value={value("price")}
          error={state.errors.price?.[0]}
          required
        />
        <Field
          name="stock"
          label="Stock"
          type="number"
          min="0"
          step="1"
          value={value("stock")}
          error={state.errors.stock?.[0]}
          required
        />
        <Field
          name="weight"
          label="Weight"
          type="number"
          min="0"
          step="0.1"
          value={value("weight")}
          error={state.errors.weight?.[0]}
        />
        <Field
          name="rating"
          label="Rating"
          type="number"
          min="0"
          max="5"
          step="0.01"
          value={value("rating")}
          error={state.errors.rating?.[0]}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="categoryId"
            className="text-sm font-semibold text-slate-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={value("categoryId")}
            className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
            required
            aria-invalid={Boolean(state.errors.categoryId?.[0])}
            aria-describedby={
              state.errors.categoryId?.[0] ? "categoryId-error" : undefined
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ErrorMessage
            id="categoryId-error"
            message={state.errors.categoryId?.[0]}
          />
        </div>
        <Field
          name="warrantyInformation"
          label="Warranty"
          value={value("warrantyInformation")}
          error={state.errors.warrantyInformation?.[0]}
        />
      </div>
      <Field
        name="tags"
        label="Tags (comma-separated)"
        value={value("tags")}
        error={state.errors.tags?.[0]}
      />
      <Field
        name="thumbnail"
        label="Image URL"
        type="url"
        value={value("thumbnail")}
        error={state.errors.thumbnail?.[0]}
        required
      />
      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={value("description")}
          className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 p-3 text-sm"
          aria-invalid={Boolean(state.errors.description?.[0])}
          aria-describedby={
            state.errors.description?.[0] ? "description-error" : undefined
          }
        />
        <ErrorMessage
          id="description-error"
          message={state.errors.description?.[0]}
        />
      </div>
      <div className="flex gap-3">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  value,
  error,
  type = "text",
  min,
  max,
  step,
  required,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
      />
      <ErrorMessage id={`${name}-error`} message={error} />
    </div>
  );
}

function ErrorMessage({ id, message }: { id?: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}
