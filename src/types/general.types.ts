export type IDefineModalName = {
  LOGIN_MODAL: 'LOGIN_MODAL',
  REGISTER_MODAL: 'REGISTER_MODAL',
}

export type IGeneral = IDefineModalName[keyof IDefineModalName]  | null