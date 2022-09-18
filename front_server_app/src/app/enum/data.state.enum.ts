//represent state of the app, not deal with indexes/numbers (0 or 1 for loaded)
export enum DataState {
    LOADING_STATE = 'LOADING_STATE',
    LOADED_STATE = 'LOADED_STATE',
    ERROR_STATE = 'ERROR_STATE'
}