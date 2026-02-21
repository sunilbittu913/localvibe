import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchQuery: string;
  viewMode: 'list' | 'map';
}

const initialState: UIState = {
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchQuery: '',
  viewMode: 'list',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setViewMode: (state, action: PayloadAction<'list' | 'map'>) => { state.viewMode = action.payload; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
  },
});

export const { toggleSidebar, toggleMobileMenu, setSearchQuery, setViewMode, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
