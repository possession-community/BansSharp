import { createFileRoute } from '@tanstack/react-router'
import { Github } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar"
import { Button } from "~/lib/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card"

export const Route = createFileRoute('/_app/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const userName = "2vg";
  const userAvatarUrl = "https://avatars.githubusercontent.com/u/17700125?v=4";
  const githubProfileUrl = `https://github.com/${userName}`;
  const githubUrl = `https://github.com/possession-community/BansSharp`;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bans Sharp</CardTitle>
          <CardDescription>SourceBans-like modern dashboard for CSSharp, created with 🏝️ TanStack Start.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3 border-b pb-1">Author</h2>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={userAvatarUrl} alt={userName} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback> {/* 名前の最初の2文字 */}
              </Avatar>
              <p>
                This application made by <a
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <span className="font-semibold">{userName}</span>
                </a>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 border-b pb-1">Repository</h2>
            <Button asChild variant="outline">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github size={18} />
                <span>View on GitHub</span>
              </a>
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}