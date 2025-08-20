import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, UserPlus } from 'lucide-react'

export default function FlowiseIntegration() {
  const flowiseUrl = process.env.NEXT_PUBLIC_FLOWISE_URL || 'http://localhost:3001'
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg" asChild>
        <Link href={`${flowiseUrl}/login`} target="_blank" rel="noopener noreferrer">
          Já Sou Cliente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 text-lg" asChild>
        <Link href={`${flowiseUrl}/login`} target="_blank" rel="noopener noreferrer">
          Área do Cliente
          <UserPlus className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  )
}