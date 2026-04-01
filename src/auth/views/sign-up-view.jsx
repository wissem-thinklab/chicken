import React, { useState } from 'react'
import { useRouter } from '../../router/hooks'
import { useAuthContext } from '../../auth/context/auth-context'

export default function SignUpViewPage() {
    const router = useRouter();
    const { checkUserSession } = useAuthContext();

    const [errorMsg, setErrorMsg] = useState('');

    const defaultValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

  return (
    <div>SignUpViewPage</div>
  )
}