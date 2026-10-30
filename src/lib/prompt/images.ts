const DB_NAME = "prompt-forge";
const STORE = "images";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open image storage"));
  });
}

function finish(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Image storage failed"));
    tx.onabort = () => reject(tx.error ?? new Error("Image storage failed"));
  });
}

export async function saveImage(id: string, blob: Blob) {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    await finish(tx);
  } finally {
    db.close();
  }
}

export async function loadImage(id: string): Promise<Blob | null> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(id);
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      request.onsuccess = () => {
        const value = request.result;
        resolve(value instanceof Blob ? value : null);
      };
      request.onerror = () => reject(request.error ?? new Error("Could not read image"));
    });
    await finish(tx);
    return blob;
  } finally {
    db.close();
  }
}

export async function deleteImage(id: string) {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    await finish(tx);
  } finally {
    db.close();
  }
}

export async function fileToThumbnail(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Not an image");
  if (file.size > 20 * 1024 * 1024) throw new Error("Image is too large");
  const bitmap = await createImageBitmap(file);
  try {
    const max = 640;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not read that photo");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob) throw new Error("Could not read that photo");
    return blob;
  } finally {
    bitmap.close();
  }
}
