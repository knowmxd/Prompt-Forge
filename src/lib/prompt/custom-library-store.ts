import type { WardrobeItem, WardrobeOutfit, WardrobeSlot } from "./wardrobe-database";

const DB_NAME = "prompt_forge_custom_library";
const DB_VERSION = 1;
const STORE_ITEMS = "items";
const STORE_OUTFITS = "outfits";
const LOCAL_STORAGE_ITEMS_KEY = "prompt-forge:custom-items:v1";
const LOCAL_STORAGE_OUTFITS_KEY = "prompt-forge:custom-outfits:v1";

export const CUSTOM_LIBRARY_CHANGE_EVENT = "prompt-forge:custom-library-changed";

// In-memory cache for ultra-fast synchronous reads
let memoryItemsCache: WardrobeItem[] | null = null;
let memoryOutfitsCache: WardrobeOutfit[] | null = null;

function getIndexedDB(): IDBFactory | null {
  if (typeof window === "undefined") return null;
  return window.indexedDB || null;
}

function openDB(): Promise<IDBDatabase | null> {
  const idb = getIndexedDB();
  if (!idb) return Promise.resolve(null);

  return new Promise((resolve) => {
    try {
      const request = idb.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_ITEMS)) {
          db.createObjectStore(STORE_ITEMS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_OUTFITS)) {
          db.createObjectStore(STORE_OUTFITS, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn("IndexedDB open failed, falling back to localStorage", request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn("IndexedDB error:", err);
      resolve(null);
    }
  });
}

// Fallback to localStorage
function readLocalStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage write failed (quota exceeded?):", e);
  }
}

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CUSTOM_LIBRARY_CHANGE_EVENT));
  }
}

/**
 * Load all custom items from IndexedDB (or fallback cache)
 */
export async function loadCustomItems(): Promise<WardrobeItem[]> {
  if (memoryItemsCache) return memoryItemsCache;

  const db = await openDB();
  if (!db) {
    memoryItemsCache = readLocalStorage<WardrobeItem>(LOCAL_STORAGE_ITEMS_KEY);
    return memoryItemsCache;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_ITEMS, "readonly");
      const store = tx.objectStore(STORE_ITEMS);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result as WardrobeItem[]) || [];
        memoryItemsCache = items;
        resolve(items);
      };

      req.onerror = () => {
        memoryItemsCache = readLocalStorage<WardrobeItem>(LOCAL_STORAGE_ITEMS_KEY);
        resolve(memoryItemsCache);
      };
    } catch {
      memoryItemsCache = readLocalStorage<WardrobeItem>(LOCAL_STORAGE_ITEMS_KEY);
      resolve(memoryItemsCache);
    }
  });
}

/**
 * Load all custom outfits from IndexedDB (or fallback cache)
 */
export async function loadCustomOutfits(): Promise<WardrobeOutfit[]> {
  if (memoryOutfitsCache) return memoryOutfitsCache;

  const db = await openDB();
  if (!db) {
    memoryOutfitsCache = readLocalStorage<WardrobeOutfit>(LOCAL_STORAGE_OUTFITS_KEY);
    return memoryOutfitsCache;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_OUTFITS, "readonly");
      const store = tx.objectStore(STORE_OUTFITS);
      const req = store.getAll();

      req.onsuccess = () => {
        const outfits = (req.result as WardrobeOutfit[]) || [];
        memoryOutfitsCache = outfits;
        resolve(outfits);
      };

      req.onerror = () => {
        memoryOutfitsCache = readLocalStorage<WardrobeOutfit>(LOCAL_STORAGE_OUTFITS_KEY);
        resolve(memoryOutfitsCache);
      };
    } catch {
      memoryOutfitsCache = readLocalStorage<WardrobeOutfit>(LOCAL_STORAGE_OUTFITS_KEY);
      resolve(memoryOutfitsCache);
    }
  });
}

/**
 * Save or update a custom wardrobe item
 */
export async function saveCustomItem(item: WardrobeItem): Promise<void> {
  const customItem: WardrobeItem = {
    ...item,
    is_custom: true,
    created_at: item.created_at || Date.now(),
  };

  const db = await openDB();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_ITEMS, "readwrite");
        const store = tx.objectStore(STORE_ITEMS);
        const req = store.put(customItem);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Update memory cache
  const current = (await loadCustomItems()).filter((i) => i.id !== customItem.id);
  memoryItemsCache = [customItem, ...current];

  // Try updating localStorage as backup
  try {
    writeLocalStorage(LOCAL_STORAGE_ITEMS_KEY, memoryItemsCache);
  } catch {
    // ignore
  }

  notifyChange();
}

/**
 * Delete a custom wardrobe item
 */
export async function deleteCustomItem(id: string): Promise<void> {
  const db = await openDB();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_ITEMS, "readwrite");
        const store = tx.objectStore(STORE_ITEMS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  const current = await loadCustomItems();
  memoryItemsCache = current.filter((i) => i.id !== id);
  writeLocalStorage(LOCAL_STORAGE_ITEMS_KEY, memoryItemsCache);
  notifyChange();
}

/**
 * Save or update a custom wardrobe outfit
 */
export async function saveCustomOutfit(outfit: WardrobeOutfit): Promise<void> {
  const customOutfit: WardrobeOutfit = {
    ...outfit,
    is_custom: true,
    created_at: outfit.created_at || Date.now(),
  };

  const db = await openDB();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_OUTFITS, "readwrite");
        const store = tx.objectStore(STORE_OUTFITS);
        const req = store.put(customOutfit);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  const current = (await loadCustomOutfits()).filter((o) => o.id !== customOutfit.id);
  memoryOutfitsCache = [customOutfit, ...current];

  try {
    writeLocalStorage(LOCAL_STORAGE_OUTFITS_KEY, memoryOutfitsCache);
  } catch {
    // ignore
  }

  notifyChange();
}

/**
 * Delete a custom wardrobe outfit
 */
export async function deleteCustomOutfit(id: string): Promise<void> {
  const db = await openDB();
  if (db) {
    await new Promise<void>((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_OUTFITS, "readwrite");
        const store = tx.objectStore(STORE_OUTFITS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  const current = await loadCustomOutfits();
  memoryOutfitsCache = current.filter((o) => o.id !== id);
  writeLocalStorage(LOCAL_STORAGE_OUTFITS_KEY, memoryOutfitsCache);
  notifyChange();
}

/**
 * Export all user-added library items & outfits to formatted JSON
 */
export async function exportCustomLibraryJson(): Promise<string> {
  const items = await loadCustomItems();
  const outfits = await loadCustomOutfits();

  const exportData = {
    version: "1.0",
    exported_at: new Date().toISOString(),
    items,
    outfits,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import custom library items & outfits from a JSON string
 */
export async function importCustomLibraryJson(
  jsonStr: string,
): Promise<{ itemsCount: number; outfitsCount: number }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON format. Please check the file contents.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid library format. Expected an object with items and/or outfits.");
  }

  const record = parsed as {
    items?: unknown[];
    outfits?: unknown[];
  };

  let importedItems = 0;
  let importedOutfits = 0;

  if (Array.isArray(record.items)) {
    for (const rawItem of record.items) {
      if (rawItem && typeof rawItem === "object" && "name" in rawItem && "prompt" in rawItem) {
        const item = rawItem as WardrobeItem;
        const validItem: WardrobeItem = {
          id: item.id || `custom_item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: String(item.name).trim(),
          slot: (item.slot as WardrobeSlot) || "outerwear",
          subcategory: String(item.subcategory || "custom").trim(),
          style_tags: Array.isArray(item.style_tags) ? item.style_tags.map(String) : ["custom"],
          colors: Array.isArray(item.colors) ? item.colors.map(String) : [],
          materials: Array.isArray(item.materials) ? item.materials.map(String) : [],
          prompt: String(item.prompt).trim(),
          image: String(item.image || ""),
          is_custom: true,
          created_at: typeof item.created_at === "number" ? item.created_at : Date.now(),
        };
        await saveCustomItem(validItem);
        importedItems++;
      }
    }
  }

  if (Array.isArray(record.outfits)) {
    for (const rawOutfit of record.outfits) {
      if (rawOutfit && typeof rawOutfit === "object" && "name" in rawOutfit && "prompt" in rawOutfit) {
        const outfit = rawOutfit as WardrobeOutfit;
        const validOutfit: WardrobeOutfit = {
          id: outfit.id || `custom_outfit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: String(outfit.name).trim(),
          style_tags: Array.isArray(outfit.style_tags) ? outfit.style_tags.map(String) : ["custom"],
          slots: (outfit.slots && typeof outfit.slots === "object") ? outfit.slots : {
            outerwear: [],
            layer_top: [],
            top: [],
            dress_onepiece: [],
            bottom: [],
            belt_waist: [],
            legwear: [],
            shoes: [],
            headwear: [],
            eyewear: [],
            neckwear: [],
            jewelry: [],
            bag: [],
            accessory: [],
          },
          item_ids: Array.isArray(outfit.item_ids) ? outfit.item_ids.map(String) : [],
          prompt: String(outfit.prompt).trim(),
          image: String(outfit.image || ""),
          is_custom: true,
          created_at: typeof outfit.created_at === "number" ? outfit.created_at : Date.now(),
        };
        await saveCustomOutfit(validOutfit);
        importedOutfits++;
      }
    }
  }

  return { itemsCount: importedItems, outfitsCount: importedOutfits };
}

/**
 * Image processing helper:
 * Resizes an image File/Blob to a maximum dimension (e.g. 1000px) and outputs a WebP/JPEG data URL.
 */
export async function optimizeReferenceImage(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw background white for transparency in PNGs if desired, or keep as is
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        let dataUrl = canvas.toDataURL("image/webp", 0.88);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image file"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
