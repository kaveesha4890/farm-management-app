import { createContext, useEffect, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import {useAuth} from './AuthContext'


export type Tunnel = { id: string; name: string }
export type Plot = { id: string; name: string; tunnelId: string }
export type Crop = { id: string; tunnelId: string; plotId: string; name: string; batchCode: string; plantingDate: string; predictedYield: number; numPlants: number; status: 'Pending' | 'Planted' | 'Completed'; createdBy?: string }
export type Harvest = { id: string; cropId: string; date: string; quantity: number; numHarvestPlants: number; note?: string; createdBy?: string }

type AppState = {
  tunnels: Tunnel[]
  plots: Plot[]
  crops: Crop[]
  harvests: Harvest[]
  selectedTunnelId?: string
  selectedPlotId?: string
  setSelectedTunnelId: (id?: string) => void
  setSelectedPlotId: (id?: string) => void
  addCrop: (crop: Omit<Crop, 'id' | 'status'> & { status?: Crop['status'] }) => void
  updateCrop: (cropId: string, changes: Partial<Omit<Crop, 'id'>>) => void
  removeCrop: (cropId: string) => void
  addHarvest: (hv: Omit<Harvest, 'id'>) => void
  markHarvestsCompleteForCrop: (cropId: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const {user} = useAuth()
  const [selectedTunnelId, setSelectedTunnelIdState] = useState<string | undefined>(() => {
    return localStorage.getItem('selectedTunnelId') || undefined
  })
  const [selectedPlotId, setSelectedPlotIdState] = useState<string | undefined>(() => {
    return localStorage.getItem('selectedPlotId') || undefined
  })

  const [tunnels] = useState<Tunnel[]>([
    { id: 't1', name: 'Tunnel GA1' },
    { id: 't2', name: 'Tunnel GA2' },
    { id: 't3', name: 'Tunnel GA3' },
    {id: 't11', name: 'Tunnel GA4' },
    { id: 't4', name: 'Tunnel GB1' },
    { id: 't5', name: 'Tunnel GB2' },
    { id: 't6', name: 'Tunnel GB3' },
    { id: 't7', name: 'Tunnel GB4' },
    { id: 't8', name: 'Tunnel GB5' },
    { id: 't9', name: 'Tunnel GB6' },
    { id: 't10', name: 'Tunnel GB7' },
  ])
  const [plots] = useState<Plot[]>([
    { id: 'p1', name: 'Plot A1', tunnelId: 't1' },
    { id: 'p2', name: 'Plot A2', tunnelId: 't1' },
    { id: 'p3', name: 'Plot B1', tunnelId: 't1' },
    { id: 'p4', name: 'Plot B2', tunnelId: 't1' },
    { id: 'p5', name: 'Plot C1', tunnelId: 't1' },
    { id: 'p6', name: 'Plot C2', tunnelId: 't1' },
    { id: 'p7', name: 'Plot D1', tunnelId: 't1' },
    { id: 'p8', name: 'Plot D2', tunnelId: 't1' },
    { id: 'p9', name: 'Plot E1', tunnelId: 't1' },
    { id: 'p10', name: 'Plot E2', tunnelId: 't1' },
    { id: 'p11', name: 'Plot F1', tunnelId: 't1' },
    { id: 'p12', name: 'Plot F2', tunnelId: 't1' },

    { id: 'p13', name: 'Plot A1', tunnelId: 't2' },
    { id: 'p14', name: 'Plot A2', tunnelId: 't2' },
    { id: 'p15', name: 'Plot B1', tunnelId: 't2' },
    { id: 'p16', name: 'Plot B2', tunnelId: 't2' },
    { id: 'p17', name: 'Plot C1', tunnelId: 't2' },
    { id: 'p18', name: 'Plot C2', tunnelId: 't2' },
    { id: 'p19', name: 'Plot D1', tunnelId: 't2' },
    { id: 'p20', name: 'Plot D2', tunnelId: 't2' },
    { id: 'p21', name: 'Plot E1', tunnelId: 't2' },
    { id: 'p22', name: 'Plot E2', tunnelId: 't2' },
    { id: 'p23', name: 'Plot F1', tunnelId: 't2' },
    { id: 'p24', name: 'Plot F2', tunnelId: 't2' },

    { id: 'p25', name: 'Plot A1', tunnelId: 't3' },
    { id: 'p26', name: 'Plot A2', tunnelId: 't3' },
    { id: 'p27', name: 'Plot B1', tunnelId: 't3' },
    { id: 'p28', name: 'Plot B2', tunnelId: 't3' },
    { id: 'p29', name: 'Plot C1', tunnelId: 't3' },
    { id: 'p30', name: 'Plot C2', tunnelId: 't3' },
    { id: 'p31', name: 'Plot D1', tunnelId: 't3' },
    { id: 'p32', name: 'Plot D2', tunnelId: 't3' },
    { id: 'p33', name: 'Plot E1', tunnelId: 't3' },
    { id: 'p34', name: 'Plot E2', tunnelId: 't3' },
    { id: 'p35', name: 'Plot F1', tunnelId: 't3' },
    { id: 'p36', name: 'Plot F2', tunnelId: 't3' },

    { id: 'p37', name: 'Plot A', tunnelId: 't4' },
    { id: 'p38', name: 'Plot B', tunnelId: 't4' },
    { id: 'p39', name: 'Plot C', tunnelId: 't4' },
    { id: 'p40', name: 'Plot D', tunnelId: 't4' },
    { id: 'p41', name: 'Plot E', tunnelId: 't4' },

    { id: 'p42', name: 'Plot A', tunnelId: 't5' },
    { id: 'p43', name: 'Plot B', tunnelId: 't5' },
    { id: 'p44', name: 'Plot C', tunnelId: 't5' },
    { id: 'p45', name: 'Plot D', tunnelId: 't5' },
    { id: 'p46', name: 'Plot E', tunnelId: 't5' },

    { id: 'p47', name: 'Plot A', tunnelId: 't6' },
    { id: 'p48', name: 'Plot B', tunnelId: 't6' },
    { id: 'p49', name: 'Plot C', tunnelId: 't6' },
    { id: 'p50', name: 'Plot D', tunnelId: 't6' },
    { id: 'p51', name: 'Plot E', tunnelId: 't6' },

    { id: 'p52', name: 'Plot A', tunnelId: 't7' },
    { id: 'p53', name: 'Plot B', tunnelId: 't7' },
    { id: 'p54', name: 'Plot C', tunnelId: 't7' },
    { id: 'p55', name: 'Plot D', tunnelId: 't7' },
    { id: 'p56', name: 'Plot E', tunnelId: 't7' },

    { id: 'p57', name: 'Plot A', tunnelId: 't8' },
    { id: 'p58', name: 'Plot B', tunnelId: 't8' },
    { id: 'p59', name: 'Plot C', tunnelId: 't8' },
    { id: 'p60', name: 'Plot D', tunnelId: 't8' },
    { id: 'p61', name: 'Plot E', tunnelId: 't8' },

    { id: 'p62', name: 'Plot A', tunnelId: 't9' },
    { id: 'p63', name: 'Plot B', tunnelId: 't9' },
    { id: 'p64', name: 'Plot C', tunnelId: 't9' },
    { id: 'p65', name: 'Plot D', tunnelId: 't9' },
    { id: 'p66', name: 'Plot E', tunnelId: 't9' },

    { id: 'p67', name: 'Plot A', tunnelId: 't10' },
    { id: 'p68', name: 'Plot B', tunnelId: 't10' },
    { id: 'p69', name: 'Plot C', tunnelId: 't10' },
    { id: 'p70', name: 'Plot D', tunnelId: 't10' },
    { id: 'p71', name: 'Plot E', tunnelId: 't10' },

    { id: 'p72', name: 'Plot A1', tunnelId: 't11' },
    { id: 'p73', name: 'Plot A2', tunnelId: 't11' },
    { id: 'p74', name: 'Plot B1', tunnelId: 't11' },
    { id: 'p75', name: 'Plot B2', tunnelId: 't11' },
    { id: 'p76', name: 'Plot C1', tunnelId: 't11' },
    { id: 'p77', name: 'Plot C2', tunnelId: 't11' },
    { id: 'p78', name: 'Plot D1', tunnelId: 't11' },
    { id: 'p79', name: 'Plot D2', tunnelId: 't11' },
  ])
  const [crops, setCrops] = useState<Crop[]>([])
  const [harvests, setHarvests] = useState<Harvest[]>([])

  useEffect(() => {
    const unsubCrops = onSnapshot(collection(db, 'crops'), (snapshot) => {
      const list: Crop[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Crop, 'id'>),
      }));
      setCrops(list);
    });

    const unsubHarvests = onSnapshot(collection(db, 'harvests'), (snapshot) => {
      const list: Harvest[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Harvest, 'id'>),
      }));
      setHarvests(list);
    });

    return () => {
      unsubCrops();
      unsubHarvests();
    };
  }, []);

  const setSelectedTunnelId = (id?: string) => {
    setSelectedTunnelIdState(id)
    if (id) localStorage.setItem('selectedTunnelId', id)
    else localStorage.removeItem('selectedTunnelId')
  }

  const setSelectedPlotId = (id?: string) => {
    setSelectedPlotIdState(id)
    if (id) localStorage.setItem('selectedPlotId', id)
    else localStorage.removeItem('selectedPlotId')
  }

  useEffect(() => {
    if (selectedPlotId && plots.find((p) => p.id === selectedPlotId)?.tunnelId !== selectedTunnelId) {
      setSelectedPlotId(undefined)
    }
  }, [selectedTunnelId])

  const addCrop: AppState['addCrop'] = async (crop) => {
    if(!user?.email){
      console.warn("User not logged in - can not add crop")
      return
    }

    await addDoc(collection(db, 'crops'), {
      status: crop.status ?? 'Pending',
      ...crop,
      createdBy: user.email,
    });
  };

  const updateCrop: AppState['updateCrop'] = async (cropId, changes) => {
    const ref = doc(db, 'crops', cropId);
    await updateDoc(ref, changes);
  };

  const removeCrop: AppState['removeCrop'] = async (cropId) => {
    await deleteDoc(doc(db, 'crops', cropId));
    const harvestQuery = harvests.filter((h) => h.cropId === cropId);
    for (const h of harvestQuery) {
      await deleteDoc(doc(db, 'harvests', h.id));
    }
  };

  const addHarvest: AppState['addHarvest'] = async (hv) => {
    if(!user?.email) {
      console.warn("User not logged in - can not add harvest")
      return
    }

    await addDoc(collection(db, 'harvests'), {
      ...hv,
      createdBy: user.email,
    });
  };

  const markHarvestsCompleteForCrop: AppState['markHarvestsCompleteForCrop'] = async (cropId) => {
    const ref = doc(db, 'crops', cropId);
    await updateDoc(ref, { status: 'Completed' });
  };

  const value = useMemo<AppState>(() => ({
    tunnels,
    plots,
    crops,
    harvests,
    selectedTunnelId,
    selectedPlotId,
    setSelectedTunnelId,
    setSelectedPlotId,
    addCrop,
    updateCrop,
    removeCrop,
    addHarvest,
    markHarvestsCompleteForCrop,
  }), [tunnels, plots, crops, harvests, selectedTunnelId, selectedPlotId, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}


