export interface UnitConversion {
  toUnitId: string;
  unit?: {
    id: string;
    name: string;
    code: string;
  };
  factor: number;
}

export interface UnitConversionReverse {
  fromUnitId: string;
  unit?: {
    id: string;
    name: string;
    code: string;
  };
  factor: number;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  conversionsFrom?: UnitConversion[];
  conversionsTo?: UnitConversionReverse[];
}
