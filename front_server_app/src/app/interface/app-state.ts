import { DataState } from "../enum/data.state.enum";

//represent entire state of the app 
export interface AppState<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
}