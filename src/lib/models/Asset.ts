export interface Asset {
  name: string;
  owners: number;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
}

export function isAsset(obj: unknown): obj is Asset {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "owners" in obj &&
    "price" in obj &&
    "quantity" in obj &&
    "maxQuantity" in obj &&
    typeof (obj as Asset).name === "string" &&
    typeof (obj as Asset).owners === "number" &&
    typeof (obj as Asset).price === "number" &&
    typeof (obj as Asset).quantity === "number" &&
    typeof (obj as Asset).maxQuantity === "number" &&
    (!(obj as Asset).imageUrl || typeof (obj as Asset).imageUrl === "string")
  );
}

export function createAsset(partial: Partial<Asset> = {}): Asset {
  return {
    name: "",
    owners: 0,
    price: 0,
    quantity: 0,
    maxQuantity: 0,
    imageUrl: "",
    ...partial,
  };
}
