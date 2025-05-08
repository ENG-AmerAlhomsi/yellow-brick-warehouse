
export interface Area {
  id?: number;
  areaName: string;
}

export interface Row {
  id?: number;
  rowName: string;
  area: Area;
}

export interface Bay {
  id?: number;
  bayName: string;
  row_sy: Row;
}

export interface Position {
  id?: number;
  positionName: string;
  isEmpty: boolean;
  bay: Bay;
}
