import { useMemo, useEffect, useCallback } from 'react'

import { STORAGE_KEY } from './constant'
import { AuthContext } from './auth-context'
import { setSession, isValidToken } from './utils'
import { useSetState } from '../../hooks/use-set-state'
import axios, { endpoints } from '../../utils/axios'

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: {
      name: 'Wissem',
      email: 'wissem@example.com',
      role: 'player',
      wallet: {
        balance: 50,
        winnings: 0,
      },
      accessToken: 'token',
      refreshToken: 'refreshToken',
    },
    loading: true,
  })

  const checkUserSession = useCallback(async () => {
    try {
      // const accessToken = sessionStorage.getItem(STORAGE_KEY)

      // if (accessToken && isValidToken(accessToken)) {
      //   setSession(accessToken)
      //   const res = await axios.get(endpoints.auth.me)
      //   const { user } = res.data
      //   setState({ user: { ...user, accessToken }, loading: false })
      // } else {
      //   setState({ user: null, loading: false })
      // }

      setState({ loading: false })
    } catch (error) {
      console.error(error)
      setState({ user: null, loading: false })
    }
  }, [setState])

  useEffect(() => {
    checkUserSession()
  }, [checkUserSession])

  const updateUser = useCallback(
    (userData) => {
      if (!state.user) return

      setState({
        user: {
          ...state.user,
          ...userData,
        },
      })
    },
    [setState, state.user]
  )

  const updateWallet = useCallback(
    (wallet) => {
      if (!state.user) return

      console.log('[AUTH][UPDATE_WALLET]', {
        oldWallet: state.user.wallet,
        newWallet: wallet,
      })

      setState({
        user: {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            ...wallet,
          },
        },
      })
    },
    [setState, state.user]
  )

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'
  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'player',
          }
        : null,
      checkUserSession,
      updateUser,
      updateWallet,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, updateUser, updateWallet, state.user, status]
  )

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}