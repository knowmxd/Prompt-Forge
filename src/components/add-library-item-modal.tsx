import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Code,
  FileText,
  Tag,
  Plus,
  Trash2,
  Download,
  FolderInput,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  WARDROBE_SLOTS,
  STYLE_TAG_VOCABULARY,
  type WardrobeItem,
  type WardrobeOutfit,
  type WardrobeSlot,
} from "@/lib/prompt/wardrobe-database";
import {
  saveCustomItem,
  saveCustomOutfit,
  optimizeReferenceImage,
  exportCustomLibraryJson,
  importCustomLibraryJson,
} from "@/lib/prompt/custom-library-store";

type AddLibraryItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (name: string, type: "item" | "outfit") => void;
  initialType?: "item" | "outfit";
};

const POPULAR_STYLE_TAGS = [
  "streetwear_90s",
  "y2k",
  "minimal_basics",
  "vintage_romantic",
  "coquette",
  "cyberpunk",
  "grunge",
  "techwear",
  "gothic_lolita",
  "dark_academia",
  "french_casual",
  "preppy",
];

export function AddLibraryItemModal({
  isOpen,
  onClose,
  onSaved,
  initialType = "item",
}: AddLibraryItemModalProps) {
  const [itemType, setItemType] = useState<"item" | "outfit">(initialType);
  const [editorMode, setEditorMode] = useState<"form" | "json">("form");

  // Form State - Piece
  const [name, setName] = useState("");
  const [slot, setSlot] = useState<WardrobeSlot>("outerwear");
  const [subcategory, setSubcategory] = useState("");
  const [colors, setColors] = useState("");
  const [materials, setMaterials] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["custom"]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");

  // Outfit specific fields
  const [outfitOuterwear, setOutfitOuterwear] = useState("");
  const [outfitBaseLayer, setOutfitBaseLayer] = useState("");
  const [outfitFootwear, setOutfitFootwear] = useState("");
  const [outfitAccessories, setOutfitAccessories] = useState("");

  // JSON mode state
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Synchronize form to JSON when entering JSON mode
  useEffect(() => {
    if (editorMode === "json") {
      if (itemType === "item") {
        const itemObj = {
          name: name || "Custom Garment",
          slot,
          subcategory: subcategory || "piece",
          style_tags: selectedTags,
          colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
          materials: materials ? materials.split(",").map((m) => m.trim()).filter(Boolean) : [],
          prompt: prompt || "",
          image: imageDataUrl || "",
        };
        setJsonText(JSON.stringify(itemObj, null, 2));
      } else {
        const outfitObj = {
          name: name || "Custom Outfit Look",
          style_tags: selectedTags,
          slots: {
            outerwear: outfitOuterwear ? [outfitOuterwear] : [],
            layer_top: [],
            top: [],
            dress_onepiece: [],
            bottom: [],
            belt_waist: [],
            legwear: [],
            shoes: outfitFootwear ? [outfitFootwear] : [],
            headwear: [],
            eyewear: [],
            neckwear: [],
            jewelry: [],
            bag: [],
            accessory: outfitAccessories ? [outfitAccessories] : [],
          },
          prompt: prompt || `${outfitOuterwear ? outfitOuterwear + "; " : ""}${outfitBaseLayer || ""}`,
          image: imageDataUrl || "",
        };
        setJsonText(JSON.stringify(outfitObj, null, 2));
      }
      setJsonError(null);
    }
  }, [editorMode, itemType, name, slot, subcategory, colors, materials, prompt, selectedTags, imageDataUrl, outfitOuterwear, outfitBaseLayer, outfitFootwear, outfitAccessories]);

  if (!isOpen) return null;

  // Handle image file selection
  async function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatusMsg({ type: "error", text: "Please select an image file (PNG, JPG, WEBP)." });
      return;
    }

    try {
      setIsProcessingImage(true);
      setImageFileName(file.name);
      const optimized = await optimizeReferenceImage(file);
      setImageDataUrl(optimized);
      setStatusMsg({ type: "success", text: `Loaded image "${file.name}"` });
    } catch {
      setStatusMsg({ type: "error", text: "Failed to process image file." });
    } finally {
      setIsProcessingImage(false);
    }
  }

  // Handle drag & drop
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  }

  // Handle JSON Text Change in JSON Mode
  function handleJsonChange(text: string) {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setJsonError(null);
      // Sync back to form state
      if (parsed.name) setName(parsed.name);
      if (parsed.prompt) setPrompt(parsed.prompt);
      if (parsed.slot) setSlot(parsed.slot);
      if (parsed.subcategory) setSubcategory(parsed.subcategory);
      if (Array.isArray(parsed.style_tags)) setSelectedTags(parsed.style_tags);
      if (Array.isArray(parsed.colors)) setColors(parsed.colors.join(", "));
      if (Array.isArray(parsed.materials)) setMaterials(parsed.materials.join(", "));
      if (parsed.image) setImageDataUrl(parsed.image);
    } catch (err: unknown) {
      setJsonError((err as Error).message || "Invalid JSON syntax");
    }
  }

  // Toggle style tag
  function toggleTag(tagKey: string) {
    if (selectedTags.includes(tagKey)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagKey));
    } else {
      setSelectedTags([...selectedTags, tagKey]);
    }
  }

  // Add custom tag
  function addCustomTag() {
    const clean = customTagInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
      setCustomTagInput("");
    }
  }

  // Submit / Save
  async function handleSave() {
    if (!name.trim()) {
      setStatusMsg({ type: "error", text: "Please enter a name for this library entry." });
      return;
    }

    if (!prompt.trim() && editorMode === "form") {
      setStatusMsg({ type: "error", text: "Please provide a prompt description that translates to the AI generator." });
      return;
    }

    if (!imageDataUrl) {
      setStatusMsg({ type: "error", text: "Please upload or drop a reference image for this piece." });
      return;
    }

    const idSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    try {
      if (itemType === "item") {
        const newItem: WardrobeItem = {
          id: `custom_item_${idSuffix}`,
          name: name.trim(),
          slot,
          subcategory: subcategory.trim() || slot,
          style_tags: selectedTags.length ? selectedTags : ["custom"],
          colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
          materials: materials ? materials.split(",").map((m) => m.trim()).filter(Boolean) : [],
          prompt: prompt.trim(),
          image: imageDataUrl,
          is_custom: true,
          created_at: Date.now(),
        };

        await saveCustomItem(newItem);
        onSaved(newItem.name, "item");
      } else {
        const slotsRecord: Record<WardrobeSlot, string[]> = {
          outerwear: outfitOuterwear.trim() ? [outfitOuterwear.trim()] : [],
          layer_top: [],
          top: [],
          dress_onepiece: [],
          bottom: [],
          belt_waist: [],
          legwear: [],
          shoes: outfitFootwear.trim() ? [outfitFootwear.trim()] : [],
          headwear: [],
          eyewear: [],
          neckwear: [],
          jewelry: [],
          bag: [],
          accessory: outfitAccessories.trim() ? [outfitAccessories.trim()] : [],
        };

        const newOutfit: WardrobeOutfit = {
          id: `custom_outfit_${idSuffix}`,
          name: name.trim(),
          style_tags: selectedTags.length ? selectedTags : ["custom"],
          slots: slotsRecord,
          item_ids: [],
          prompt: prompt.trim() || `${outfitOuterwear ? outfitOuterwear + "; " : ""}${outfitBaseLayer || ""}`,
          image: imageDataUrl,
          is_custom: true,
          created_at: Date.now(),
        };

        await saveCustomOutfit(newOutfit);
        onSaved(newOutfit.name, "outfit");
      }

      onClose();
    } catch {
      setStatusMsg({ type: "error", text: "Failed to save item to local storage." });
    }
  }

  // Export JSON file
  async function handleExport() {
    try {
      const json = await exportCustomLibraryJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompt-forge-custom-library-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg({ type: "success", text: "Exported custom library JSON file." });
    } catch {
      setStatusMsg({ type: "error", text: "Export failed." });
    }
  }

  // Import JSON file
  function handleImportClick() {
    importFileRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importCustomLibraryJson(text);
      setStatusMsg({
        type: "success",
        text: `Imported ${res.itemsCount} piece(s) and ${res.outfitsCount} outfit(s)!`,
      });
      onSaved(`Imported ${res.itemsCount + res.outfitsCount} items`, "item");
    } catch (err: unknown) {
      setStatusMsg({ type: "error", text: (err as Error).message || "Import failed" });
    } finally {
      if (e.target) e.target.value = "";
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Add to Wardrobe Library</h2>
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400 border border-rose-500/30">
                  CUSTOM
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Upload your reference photo, define prompt translation, and organize with custom tags
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`flex items-center justify-between px-6 py-2 text-xs border-b ${
              statusMsg.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                : "bg-red-950/60 border-red-800 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              <span>{statusMsg.text}</span>
            </div>
            <button type="button" onClick={() => setStatusMsg(null)} className="opacity-70 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Tab Controls Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/30 px-6 py-2.5">
          {/* Item Type Switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setItemType("item")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                itemType === "item" ? "bg-rose-500 text-black shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Individual Piece</span>
            </button>
            <button
              type="button"
              onClick={() => setItemType("outfit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                itemType === "outfit" ? "bg-rose-500 text-black shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Outfit Look</span>
            </button>
          </div>

          {/* Mode Switcher: Visual Form vs JSON Prompt Piece */}
          <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setEditorMode("form")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                editorMode === "form" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Form Fields</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("json")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                editorMode === "json" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>JSON Editor</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Reference Image Upload Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Reference Image <span className="text-rose-500">*</span>
            </label>

            {imageDataUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-neutral-700 bg-white">
                  <img src={imageDataUrl} alt="Preview" className="h-full w-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {imageFileName || "Custom Reference Photo"}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Optimized for persistent library storage
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageDataUrl("");
                        setImageFileName("");
                      }}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-rose-500 bg-rose-500/10 text-white"
                    : "border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/60"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 mb-3">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="text-xs font-medium text-white">
                  {isProcessingImage ? "Optimizing image..." : "Click to browse or drag & drop reference photo"}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  PNG, JPG, or WEBP · automatically optimized for studio catalog preview
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
              }}
            />
          </div>

          {editorMode === "form" ? (
            /* Visual Form Mode */
            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {itemType === "item" ? "Piece Name" : "Outfit Name"} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    itemType === "item"
                      ? "e.g. Distressed Leather Moto Jacket, Platform Oxford Loafers"
                      : "e.g. Cyberpunk Techwear Ensemble, Parisian Cafe Chic"
                  }
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                />
              </div>

              {itemType === "item" ? (
                /* Individual Piece Options */
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Wardrobe Slot */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Wardrobe Slot <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={slot}
                        onChange={(e) => setSlot(e.target.value as WardrobeSlot)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white capitalize focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                      >
                        {WARDROBE_SLOTS.map((s) => (
                          <option key={s.slot} value={s.slot}>
                            {s.slot.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. jacket, boots, hoodie, tote"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Colors */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Colors
                      </label>
                      <input
                        type="text"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                        placeholder="e.g. black, distressed brown, silver"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                      />
                    </div>

                    {/* Materials */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Materials & Textiles
                      </label>
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        placeholder="e.g. cowhide leather, heavy denim, silk"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                      />
                    </div>
                  </div>

                  {/* Prompt Text Translation */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Prompt Translation Output <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. classic oversized black leather moto biker jacket with asymmetric silver zip, wide notch lapels, and zippered cuffs, worn open"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white placeholder-neutral-500 font-mono leading-relaxed focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                    />
                    <p className="mt-1 text-[11px] text-neutral-500">
                      This standalone description will be injected into your prompt JSON when this piece is clicked.
                    </p>
                  </div>
                </>
              ) : (
                /* Full Outfit Options */
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Outerwear</label>
                      <input
                        type="text"
                        value={outfitOuterwear}
                        onChange={(e) => setOutfitOuterwear(e.target.value)}
                        placeholder="e.g. cropped sherpa jacket"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Base Layer</label>
                      <input
                        type="text"
                        value={outfitBaseLayer}
                        onChange={(e) => setOutfitBaseLayer(e.target.value)}
                        placeholder="e.g. striped cotton tee; pleated mini skirt"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Footwear</label>
                      <input
                        type="text"
                        value={outfitFootwear}
                        onChange={(e) => setOutfitFootwear(e.target.value)}
                        placeholder="e.g. slouchy suede mid-calf boots"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Accessories</label>
                      <input
                        type="text"
                        value={outfitAccessories}
                        onChange={(e) => setOutfitAccessories(e.target.value)}
                        placeholder="e.g. leather crossbody bag, knit leg warmers"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Full Prompt Translation */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Full Outfit Prompt Translation <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. oversized cream ivory sherpa jacket; Breton striped crew-neck tee; black bike shorts; dark brown suede slouch boots; black leather crossbody camera bag"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white placeholder-neutral-500 font-mono leading-relaxed focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                    />
                  </div>
                </>
              )}

              {/* Tags & Organization */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Style Tags & Organization
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {POPULAR_STYLE_TAGS.map((t) => {
                    const active = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-mono transition-all ${
                          active
                            ? "bg-rose-500 text-black font-semibold shadow-sm"
                            : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                        }`}
                      >
                        #{t.replace(/_/g, " ")}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tag Input */}
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                    placeholder="Type custom tag and press Enter"
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tag</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Raw JSON Editor Mode */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Edit or paste raw JSON piece schema:
                </span>
                {jsonError ? (
                  <span className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {jsonError}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Valid JSON
                  </span>
                )}
              </div>

              <textarea
                rows={14}
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className={`w-full rounded-xl border bg-black/80 p-4 font-mono text-xs leading-relaxed focus:outline-none ${
                  jsonError
                    ? "border-red-500/80 text-red-200"
                    : "border-neutral-800 text-neutral-200 focus:border-rose-500"
                }`}
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/60 px-6 py-4">
          {/* Left Actions: Import / Export JSON */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              title="Export all custom library items to JSON"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-neutral-400" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              title="Import items from a JSON library file"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <FolderInput className="h-3.5 w-3.5 text-neutral-400" />
              <span>Import JSON</span>
            </button>
            <input
              ref={importFileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {/* Right Actions: Cancel / Save */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2 text-xs font-semibold text-black hover:bg-rose-400 shadow-md transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Save to Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
