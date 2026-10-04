import { slugify } from "./slugify";

const isImageUrl = (value: unknown) => {
  if (typeof value !== "string" || !value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export function productInput(body: Record<string, unknown>, partial = false) {
  const input: Record<string, unknown> = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  if (!partial || "name" in body) {
    if (name.length < 2 || name.length > 160)
      throw new Error("Product name must be 2 to 160 characters.");
    input.name = name;
  }
  if (!partial || "category" in body) {
    if (!category || category.length > 100)
      throw new Error("A category is required.");
    input.category = category;
  }
  if ("slug" in body || !partial) {
    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim().toLowerCase()
        : slugify(name);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180)
      throw new Error("Invalid product slug.");
    input.slug = slug;
  }
  for (const field of ["price", "compareAtPrice"] as const) {
    if (field in body) {
      const value = Number(body[field]);
      if (!Number.isFinite(value) || value < 0 || value > 1_000_000_000)
        throw new Error(`Invalid ${field}.`);
      input[field] = value;
    }
  }
  if (!partial && !("price" in body))
    throw new Error("A valid price is required.");
  if ("stock" in body) {
    const value = Number(body.stock);
    if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000)
      throw new Error("Stock must be a non-negative whole number.");
    input.stock = value;
  }
  if ("lowStockThreshold" in body) {
    const value = Number(body.lowStockThreshold);
    if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000)
      throw new Error("Invalid low stock threshold.");
    input.lowStockThreshold = value;
  }
  if ("image" in body) {
    const value = String(body.image || "");
    if (value && !isImageUrl(value))
      throw new Error("Product image must use an HTTPS URL.");
    input.image = value;
  }
  if ("images" in body) {
    if (
      !Array.isArray(body.images) ||
      body.images.length > 8 ||
      body.images.some((url) => !isImageUrl(url))
    )
      throw new Error("Use up to 8 valid HTTPS image URLs.");
    input.images = body.images;
  }
  if ("imagePublicIds" in body) {
    if (
      !Array.isArray(body.imagePublicIds) ||
      body.imagePublicIds.length > 8 ||
      body.imagePublicIds.some(
        (id) => typeof id !== "string" || !id.startsWith("vendrax/products/"),
      )
    )
      throw new Error("Invalid product image reference.");
    input.imagePublicIds = body.imagePublicIds;
  }
  if ("subcategory" in body) {
    const value = String(body.subcategory || "").trim();
    if (value.length > 100) throw new Error("Invalid subcategory.");
    input.subcategory = value;
  }
  if ("description" in body) {
    const value = String(body.description || "").trim();
    if (value.length > 10000) throw new Error("Description is too long.");
    input.description = value;
  }
  if ("shortDescription" in body) {
    const value = String(body.shortDescription || "").trim();
    if (value.length > 500) throw new Error("Short description is too long.");
    input.shortDescription = value;
  }
  if ("sku" in body) {
    const value = String(body.sku || "")
      .trim()
      .toUpperCase();
    if (value && !/^[A-Z0-9_-]{1,64}$/.test(value))
      throw new Error("Invalid SKU.");
    input.sku = value || undefined;
  }
  if ("tags" in body) {
    if (
      !Array.isArray(body.tags) ||
      body.tags.length > 30 ||
      body.tags.some((tag) => typeof tag !== "string" || tag.length > 50)
    )
      throw new Error("Invalid product tags.");
    input.tags = body.tags.map((tag) => tag.trim()).filter(Boolean);
  }
  for (const flag of ["featured", "active"] as const)
    if (flag in body) {
      if (typeof body[flag] !== "boolean")
        throw new Error(`Invalid ${flag} value.`);
      input[flag] = body[flag];
    }
  if (
    input.compareAtPrice !== undefined &&
    input.price !== undefined &&
    Number(input.compareAtPrice) < Number(input.price)
  )
    throw new Error("Compare at price must be at least the product price.");
  return input;
}
