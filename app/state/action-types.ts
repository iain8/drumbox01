export type ActionTypes =
  | PresetRequest
  | MISC_ACTION;

export enum TypeKeys  {
  GET_PRESET = 'GET_PRESET',
  MISC_ACTION = 'MISC_ACTION',
}

// Data actions
export interface PresetRequest {
  id: any,
  type: TypeKeys.GET_PRESET,
};

// UI actions TODO: these


export interface MISC_ACTION { type: MISC_ACTION };
