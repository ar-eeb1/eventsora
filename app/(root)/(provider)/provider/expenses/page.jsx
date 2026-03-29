import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WalletCards, Construction } from 'lucide-react'

const Expenses = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="max-w-md w-full border-dashed">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <WalletCards className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Development in Progress
                    </CardTitle>
                    <CardDescription>
                        We're currently building a powerful way for you to manage your chores.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Construction className="h-4 w-4" /> 
                            Development in progress
                        </span>
                        <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground italic">
                        Estimated release: Q3 2026
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Expenses