import type { CalculatorState } from '../types/calculator';

export const STORAGE_KEY = 'calc3d_state_v2';

export const IMAGE_UPLOAD_CONFIG = {
  maxDimension: 800,
  quality: 0.85,
  acceptedMimeTypes: 'image/*',
} as const;

export const PDF_PAGE_CONFIG = {
  widthMm: 210,
  heightMm: 297,
  pixelWidth: 794,
  pixelHeight: 1123,
  pixelRatio: 2.5,
  defaultFilename: 'Orcamento_Impressao_3D.pdf',
} as const;

export const INITIAL_STATE: CalculatorState = {
  productionMode: 'unit',
  kitBatch: {
    itemsPerBatch: 20,
    clientQuantity: 1,
  },
  clientProject: {
    clientName: 'Cliente Exemplo',
    projectName: 'Chaveiro com NFC',
    dimensions: '150 x 42 x 2.5 mm',
    serviceDescription:
      'Serviço de impressão 3D em alta resolução FDM com acabamento profissional e remoção limpa de suportes.',
    referenceImage: null,
    quantity: 1,
    leadTimeDays: 3,
    color: 'Preto',
    notes: 'Manter a peça ao abrigo de temperaturas superiores a 60°C.',
    companyName: 'Bambu Lab 3D Studio',
    companyContact: 'WhatsApp: (11) 98765-4321 | contato@3dstudio.com.br',
  },
  materialEquip: {
    filamentCostPerKg: 120,
    partWeightG: 50,
    printerValue: 3600,
    lifespanHours: 3000,
  },
  timeEnergy: {
    printTimeHours: 2,
    printTimeMinutes: 30,
    avgPowerWatts: 130,
    energyCostKwh: 0.95,
  },
  workExtras: {
    workHourlyRate: 30,
    prepTimeMinutes: 10,
    packagingCost: 2,
    extraHardwareCost: 0,
  },
  marketRisks: {
    profitMarginPercent: 50,
    marketplaceFeePercent: 14,
    marketplaceFixedFee: 0,
    taxPercent: 0,
    failureMarginPercent: 5,
  },
};
