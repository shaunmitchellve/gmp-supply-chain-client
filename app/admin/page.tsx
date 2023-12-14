import { Metadata } from 'next';
import { signOut } from '@/auth'

export const metadata: Metadata = {
  title: "Admin"
}

export default function LoginPage() {
    return (
        <>
      <h1>Admin</h1>
      <form action={async () => {
        'use server'
        await signOut();

      }}>
      <button type="submit">Singout</button>
      </form>
      </>
    )
}