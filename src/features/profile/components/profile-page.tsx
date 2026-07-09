import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

export function ProfilePage() {
  return (
    <>
      <AuthAppTopbar title="Profile" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">DV</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Nguyen Van Duong</h2>
            <p className="text-muted-foreground">duong@example.com</p>
            <Badge variant="accent" className="mt-2">
              7-day streak
            </Badge>
          </div>
        </div>
        <Card className="mb-4">
          <h3 className="mb-4 font-semibold">Learning progress</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Labs completed</span>
                <span className="font-mono">2/8</span>
              </div>
              <Progress value={25} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Total XP</span>
                <span className="font-mono text-accent">1,240</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Quiz average</div>
              <div className="font-mono-tabular text-lg text-success">87%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Time learning</div>
              <div className="font-mono-tabular text-lg">12h 40m</div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
