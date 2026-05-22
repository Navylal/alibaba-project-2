import { useState, useMemo } from "react";
import { Plus, X, Save, ArrowRight, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useMaterials, useBottles, useTesters } from "../../hooks/useSupabase";

type Ingredient = {
  id: string;
  materialId: string;
  material: string;
  ml: number;
  pricePerMl: number;
};

type BottleType = "Roll On" | "Spray";

export default function Calculator() {
  const navigate = useNavigate();
  const { materials, loading: loadingMaterials } = useMaterials();
  const { bottles, loading: loadingBottles } = useBottles();
  const { createTester } = useTesters();

  const [bottleType, setBottleType] = useState<BottleType>("Spray");
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [profitMargin, setProfitMargin] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const bottlesByType = useMemo(() => {
    const grouped: Record<BottleType, any[]> = { "Roll On": [], Spray: [] };
    bottles.forEach((bottle) => {
      if (bottle.type === "Roll On" || bottle.type === "Spray") {
        grouped[bottle.type].push(bottle);
      }
    });
    return grouped;
  }, [bottles]);

  const selectedBottle = useMemo(() => {
    if (!selectedBottleId) {
      const defaultBottles = bottlesByType[bottleType];
      return defaultBottles[0] || null;
    }
    return bottles.find((b) => b.id === selectedBottleId) || null;
  }, [selectedBottleId, bottles, bottlesByType, bottleType]);

  const addIngredient = (materialId?: string, materialName?: string) => {
    const material = materialId
      ? materials.find((m) => m.id === materialId)
      : materials[0];

    if (!material) return;

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      materialId: material.id,
      material: material.name,
      ml: 5,
      pricePerMl: material.price_per_ml,
    };
    setIngredients([...ingredients, newIngredient]);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const updateIngredient = (id: string, ml: number) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, ml } : ing)));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleBottleTypeChange = (type: BottleType) => {
    setBottleType(type);
    setSelectedBottleId(null);
  };

  const filteredMaterials = useMemo(
    () => materials.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [materials, searchQuery]
  );

  const totalMl = ingredients.reduce((sum, ing) => sum + ing.ml, 0);
  const materialsCost = ingredients.reduce((sum, ing) => sum + ing.ml * ing.pricePerMl * 1000, 0);
  const bottleCost = selectedBottle?.price || 0;
  const totalHPP = materialsCost + bottleCost;
  const sellingPrice = totalHPP + (totalHPP * profitMargin) / 100;

  const handleSaveAsTester = async () => {
    if (ingredients.length === 0) {
      alert("Please add ingredients first!");
      return;
    }

    const testerMaterials = ingredients.map((ing) => ({
      material_id: ing.materialId,
      name: ing.material,
      ml: ing.ml,
      cost: ing.ml * ing.pricePerMl * 1000,
    }));

    const result = await createTester(
      {
        total_cost: materialsCost,
        notes: `Mix with ${selectedBottle?.size || "bottle"} ${bottleType}`,
      },
      testerMaterials
    );

    if (result) {
      alert("Mix saved as tester!");
      setIngredients([]);
    }
  };

  const handleContinueToTransaction = () => {
    navigate("/dashboard/kasir");
  };

  if (loadingMaterials || loadingBottles) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Price Calculator</h1>
        <p className="text-muted-foreground">Calculate HPP and selling price for perfume mixes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg text-gray-900 mb-4">Select Bottle Type</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleBottleTypeChange("Roll On")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  bottleType === "Roll On"
                    ? "border-primary bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm">Roll On</p>
                </div>
              </button>
              <button
                onClick={() => handleBottleTypeChange("Spray")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  bottleType === "Spray"
                    ? "border-primary bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <p className="text-sm">Spray</p>
                </div>
              </button>
            </div>

            <h3 className="text-sm text-gray-700 mb-3">Select Size</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {bottlesByType[bottleType]?.map((bottle) => (
                <button
                  key={bottle.id}
                  onClick={() => setSelectedBottleId(bottle.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedBottle?.id === bottle.id
                      ? "border-primary bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-lg text-gray-900 mb-1">{bottle.size}</p>
                    <p className="text-xs text-muted-foreground">Rp {bottle.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-gray-900">Ingredients</h2>
            </div>

            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search and add material..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              {showSearchResults && searchQuery && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => addIngredient(mat.id, mat.name)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <p className="text-sm text-gray-900">{mat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Rp {(mat.price_per_ml * 1000).toLocaleString()}/ml
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No materials found</div>
                  )}
                </div>
              )}
            </div>

            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No ingredients added yet</p>
                <p className="text-sm">Search and select materials above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ing) => (
                  <div key={ing.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{ing.material}</p>
                      <p className="text-xs text-muted-foreground">
                        Rp {(ing.pricePerMl * 1000).toLocaleString()}/ml
                      </p>
                    </div>
                    <div className="w-28">
                      <input
                        type="number"
                        value={ing.ml}
                        onChange={(e) => updateIngredient(ing.id, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-center">ml</p>
                    </div>
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg text-gray-900 mb-4">Profit Margin</h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="flex-1"
              />
              <div className="w-20 text-center">
                <input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg sticky top-6">
            <h2 className="text-lg mb-6">Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <span className="text-sm text-white/80">Total Volume</span>
                <span className="text-lg">{totalMl} ml</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase tracking-wider">Cost Breakdown</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Materials</span>
                  <span>Rp {materialsCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">
                    Bottle ({selectedBottle?.size || "-"} {bottleType})
                  </span>
                  <span>Rp {bottleCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-white/20">
                <span className="text-sm">Total HPP</span>
                <span className="text-xl">Rp {totalHPP.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Profit ({profitMargin}%)</span>
                <span>Rp {((totalHPP * profitMargin) / 100).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span>Selling Price</span>
                <span className="text-2xl">Rp {sellingPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSaveAsTester}
                disabled={ingredients.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Save as Tester
              </button>
              <button
                onClick={handleContinueToTransaction}
                disabled={ingredients.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Transaction
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
