export const createAuthSlice = (set) => ({
    userInfo: null, 
    setUserInfo: (userInfo) => set({ userInfo }), 
    easterEgg2Handled: false,
    setEasterEgg2Handled: (handled) => set({ easterEgg2Handled: handled }),
});