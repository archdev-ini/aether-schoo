
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">404</h1>
        <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Page Not Found</h2>
            <p className="text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
            </p>
        </div>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}
