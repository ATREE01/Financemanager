import { Dispatch, SetStateAction } from "react";

export interface ShowState {
  isShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}
