import { useState, useMemo, useEffect, useCallback } from 'react';
import type {
  CalculatorState,
  CalculationResults,
  ProductionMode,
  KitBatchData,
  ClientProjectData,
  MaterialEquipData,
  TimeEnergyData,
  WorkExtrasData,
  MarketRisksData,
} from '../types/calculator';
import { INITIAL_STATE } from '../constants/defaults';
import { PRINTER_PRESETS, FILAMENT_PRESETS } from '../constants/presets';
import { calculatePricing } from '../services/pricingService';
import { loadProjectFromStorage, saveProjectToStorage } from '../services/storageService';

export interface UseCalculatorStateReturn {
  state: CalculatorState;
  results: CalculationResults;
  isKitMode: boolean;
  setProductionMode: (mode: ProductionMode) => void;
  updateKitBatch: (patch: Partial<KitBatchData>) => void;
  updateClientProject: (patch: Partial<ClientProjectData>) => void;
  updateMaterialEquip: (patch: Partial<MaterialEquipData>) => void;
  updateTimeEnergy: (patch: Partial<TimeEnergyData>) => void;
  updateWorkExtras: (patch: Partial<WorkExtrasData>) => void;
  updateMarketRisks: (patch: Partial<MarketRisksData>) => void;
  selectPrinterPreset: (presetId: string) => void;
  selectFilamentPreset: (presetId: string) => void;
  resetProject: () => void;
  loadState: (newState: CalculatorState) => void;
}

/**
 * Hook customizado para gerenciar o estado da calculadora de impressão 3D.
 * Utiliza computação derivada puramente via useMemo para evitar renderizações duplicadas.
 */
export function useCalculatorState(): UseCalculatorStateReturn {
  const [state, setState] = useState<CalculatorState>(() => loadProjectFromStorage());

  // Cálculo de resultados derivado instantaneamente via useMemo (evita double-render)
  const results = useMemo(() => calculatePricing(state), [state]);

  const isKitMode = state.productionMode === 'kit';

  // Persistência automática no LocalStorage
  useEffect(() => {
    saveProjectToStorage(state);
  }, [state]);

  const setProductionMode = useCallback((mode: ProductionMode) => {
    setState((prev) => ({
      ...prev,
      productionMode: mode,
    }));
  }, []);

  const updateKitBatch = useCallback((patch: Partial<KitBatchData>) => {
    setState((prev) => ({
      ...prev,
      kitBatch: { ...prev.kitBatch, ...patch },
    }));
  }, []);

  const updateClientProject = useCallback((patch: Partial<ClientProjectData>) => {
    setState((prev) => ({
      ...prev,
      clientProject: { ...prev.clientProject, ...patch },
    }));
  }, []);

  const updateMaterialEquip = useCallback((patch: Partial<MaterialEquipData>) => {
    setState((prev) => ({
      ...prev,
      materialEquip: { ...prev.materialEquip, ...patch },
    }));
  }, []);

  const updateTimeEnergy = useCallback((patch: Partial<TimeEnergyData>) => {
    setState((prev) => ({
      ...prev,
      timeEnergy: { ...prev.timeEnergy, ...patch },
    }));
  }, []);

  const updateWorkExtras = useCallback((patch: Partial<WorkExtrasData>) => {
    setState((prev) => ({
      ...prev,
      workExtras: { ...prev.workExtras, ...patch },
    }));
  }, []);

  const updateMarketRisks = useCallback((patch: Partial<MarketRisksData>) => {
    setState((prev) => ({
      ...prev,
      marketRisks: { ...prev.marketRisks, ...patch },
    }));
  }, []);

  const selectPrinterPreset = useCallback((presetId: string) => {
    const preset = PRINTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      materialEquip: {
        ...prev.materialEquip,
        printerValue: preset.price,
        lifespanHours: preset.lifespanHours,
      },
      timeEnergy: {
        ...prev.timeEnergy,
        avgPowerWatts: preset.powerWatts,
      },
    }));
  }, []);

  const selectFilamentPreset = useCallback((presetId: string) => {
    const preset = FILAMENT_PRESETS.find((f) => f.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      materialEquip: {
        ...prev.materialEquip,
        filamentCostPerKg: preset.costPerKg,
      },
    }));
  }, []);

  const resetProject = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const loadState = useCallback((newState: CalculatorState) => {
    setState(newState);
  }, []);

  return {
    state,
    results,
    isKitMode,
    setProductionMode,
    updateKitBatch,
    updateClientProject,
    updateMaterialEquip,
    updateTimeEnergy,
    updateWorkExtras,
    updateMarketRisks,
    selectPrinterPreset,
    selectFilamentPreset,
    resetProject,
    loadState,
  };
}
