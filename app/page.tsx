"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const redirect = () => {
    router.push('/dashboard');
  }
  return (
    redirect()
  )
}
