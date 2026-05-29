import PdfUploader from '@/components/Pdf-upload'
import React from 'react'
import { auth } from '../lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

async function page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session){
    redirect('/unauthorized')
  }

  return (
    <PdfUploader />
  )
}

export default page