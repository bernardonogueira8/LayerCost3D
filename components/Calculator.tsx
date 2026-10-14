"use client";

import React, { useState } from 'react';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { useProjectStorage } from '../hooks/useProjectStorage';
import { useImageUpload } from '../hooks/useImageUpload';
import { usePdfExport } from '../hooks/usePdfExport';
import { useTheme } from '../hooks/useTheme';
import { buildWhatsAppQuoteMessage, copyToClipboard } from '../services/shareService';

import { CalculatorHeader } from './calculator/CalculatorHeader';
import { ProductionModeSelector } from './calculator/ProductionModeSelector';
import { ClientProjectSection } from './calculator/ClientProjectSection';
import { MaterialEquipSection } from './calculator/MaterialEquipSection';
import { TimeEnergySection } from './calculator/TimeEnergySection';
import { WorkExtrasSection } from './calculator/WorkExtrasSection';
import { MarketRisksSection } from './calculator/MarketRisksSection';
import { PricingSummaryCard } from './calculator/PricingSummaryCard';
import { PdfPreviewModal } from './PdfPreviewModal';
import { PdfQuoteTemplate } from './PdfQuoteTemplate';

/**
 * Componente Orquestrador da Calculadora 3D.
 * Integra custom hooks e seções modulares desacopladas de apresentação para Next.js App Router.
 */
export const Calculator: React.FC = () => {
  // 0. Tema Apple Studio (Dark/Light)
  const { isDark, toggleTheme } = useTheme();

  // 1. Estado de Domínio e Cálculos Derivados (useMemo)
  const {
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
  } = useCalculatorState();

  // 2. Persistência em Arquivo e JSON
  const {
    notification,
    jsonInputRef,
    handleNewProject,
    handleSaveJson,
    triggerOpenJson,
    handleJsonFileSelected,
  } = useProjectStorage();

  // 3. Upload e Otimização de Imagens
  const {
    fileInputRef: imageInputRef,
    isProcessing: isImageProcessing,
    triggerUpload: triggerImageUpload,
    handleFileChange: handleImageFileChange,
  } = useImageUpload();

  // 4. Exportação de PDF e Modal de Preview
  const {
    isPreviewOpen,
    quoteMeta,
    isExportingDirect,
    hiddenPdfRef,
    openPreview,
    closePreview,
    exportDirectPdf,
  } = usePdfExport();

  // 5. Estado local de feedback do WhatsApp
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleCopyWhatsApp = async () => {
    const message = buildWhatsAppQuoteMessage(state, results);
    const success = await copyToClipboard(message);
    if (success) {
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2500);
    }
  };

  return (
    <div className="studio-background min-h-screen text-slate-900 dark:text-zinc-100 transition-colors duration-200 antialiased pb-20">
      {/* Top Application Header */}
      <CalculatorHeader
        state={state}
        isKitMode={isKitMode}
        notification={notification}
        jsonInputRef={jsonInputRef}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNewProject={() => handleNewProject(resetProject)}
        onSaveJson={() => handleSaveJson(state)}
        onOpenJsonTrigger={triggerOpenJson}
        onJsonFileSelected={(e) => handleJsonFileSelected(e, loadState)}
        onUpdateClientQuantity={(qty) => {
          if (isKitMode) {
            updateKitBatch({ clientQuantity: qty });
          } else {
            updateClientProject({ quantity: qty });
          }
        }}
        onUpdateProjectName={(name) => updateClientProject({ projectName: name })}
        onOpenPdfPreview={openPreview}
      />

      {/* Main Dashboard Layout */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* Production Mode Switcher */}
        <ProductionModeSelector
          productionMode={state.productionMode}
          onSelectMode={setProductionMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT & CENTER: Input Cards (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Card 0: Dados do Cliente e Projeto */}
            <ClientProjectSection
              clientProject={state.clientProject}
              kitBatch={state.kitBatch}
              isKitMode={isKitMode}
              isImageProcessing={isImageProcessing}
              imageInputRef={imageInputRef}
              onTriggerImageUpload={triggerImageUpload}
              onImageFileChange={(e) =>
                handleImageFileChange(e, (dataUrl) =>
                  updateClientProject({ referenceImage: dataUrl })
                )
              }
              onRemoveImage={() => updateClientProject({ referenceImage: null })}
              onUpdateClientProject={updateClientProject}
              onUpdateKitBatch={updateKitBatch}
            />

            {/* Grid for Cards 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MaterialEquipSection
                materialEquip={state.materialEquip}
                results={results}
                isKitMode={isKitMode}
                onUpdateMaterialEquip={updateMaterialEquip}
                onSelectPrinterPreset={selectPrinterPreset}
                onSelectFilamentPreset={selectFilamentPreset}
              />

              <TimeEnergySection
                timeEnergy={state.timeEnergy}
                results={results}
                isKitMode={isKitMode}
                onUpdateTimeEnergy={updateTimeEnergy}
              />
            </div>

            {/* Grid for Cards 3 & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WorkExtrasSection
                workExtras={state.workExtras}
                results={results}
                isKitMode={isKitMode}
                onUpdateWorkExtras={updateWorkExtras}
              />

              <MarketRisksSection
                marketRisks={state.marketRisks}
                results={results}
                onUpdateMarketRisks={updateMarketRisks}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Results Dashboard (4 Cols) */}
          <PricingSummaryCard
            state={state}
            results={results}
            isKitMode={isKitMode}
            isExportingPdf={isExportingDirect}
            copiedWhatsApp={copiedWhatsApp}
            onOpenPdfPreview={openPreview}
            onDirectPdfExport={() => exportDirectPdf(state)}
            onCopyWhatsApp={handleCopyWhatsApp}
          />
        </div>
      </main>

      {/* Interactive Modal for Quote Preview and PDF Download */}
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        state={state}
        results={results}
        quoteMeta={quoteMeta}
        onUpdateClientProject={updateClientProject}
      />

      {/* Isolated offscreen template for 1-click direct download */}
      <div
        id="calculator-direct-download-target"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '794px',
          height: '1123px',
          zIndex: -9999,
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          visibility: 'visible',
        }}
        aria-hidden="true"
      >
        <div ref={hiddenPdfRef} className="light" data-theme="light">
          <PdfQuoteTemplate state={state} results={results} />
        </div>
      </div>
    </div>
  );
};
