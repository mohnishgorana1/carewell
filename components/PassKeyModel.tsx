'use client'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { decryptKey, encryptKey } from '@/lib/utils'

function PassKeyModel() {
  const router = useRouter()
  const path = usePathname()
  const [open, setOpen] = useState(true)
  const [passkey, setPasskey] = useState("")

  const [error, setError] = useState("")

  const closeModal = () => {
    setOpen(false)
    router.push('/')
  }

  const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null

  useEffect(() => {
    const accessKey = encryptedKey ? decryptKey(encryptedKey) : null
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false)
        router.push('/admin')
      }
      else {
        setOpen(true)
      }
    }
  }, [encryptedKey])


  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey)
      localStorage.setItem("accessKey", encryptedKey)
      router.push('/admin')
    }
    else {
      setError("Invalid Passkey. Please try again.")
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-start justify-between'>
            Admin Access Verification
            <Image
              src={'/assets/icons/close.svg'}
              height={20}
              width={20}
              alt='close'
              className='cursor-pointer'
              onClick={() => closeModal()}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
            <InputOTPGroup className='shad-otp'>
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {
            error && (
              <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>
            )
          }
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={(e) => validatePasskey(e)} className='bg-green-500 text-white hover:bg-[#287c5d] duration-200 ease-in-out w-full'>Enter Admin Passkey</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PassKeyModel