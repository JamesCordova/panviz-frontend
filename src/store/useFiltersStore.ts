import { create } from 'zustand'

/**
 * Estado de UI compartido entre los widgets del dashboard (selector de
 * region, enfermedad y horizonte de prediccion). Deliberadamente separado
 * del estado de servidor (que vive en TanStack Query, ver src/api/) --
 * esto es solo "que esta seleccionado", no datos remotos.
 */
interface FiltersState {
  regionCode: string | null
  disease: string
  horizon: number
  setRegion: (regionCode: string) => void
  setDisease: (disease: string) => void
  setHorizon: (horizon: number) => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  regionCode: null,
  disease: 'pneumonia',
  horizon: 8,
  setRegion: (regionCode) => set({ regionCode }),
  setDisease: (disease) => set({ disease }),
  setHorizon: (horizon) => set({ horizon }),
}))
