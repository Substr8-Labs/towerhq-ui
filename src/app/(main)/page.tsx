import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggler";
import { initProfile, getAllServers } from "@/lib/query";
import { InitialModel } from "@/components/modals/initial-model";
import { ProjectCard } from "@/components/project/project-card";
import { NewProjectButton } from "@/components/project/new-project-button";

export default async function Home() {
  const profile = await initProfile();
  const servers = await getAllServers(profile.id);

  return (
    <main className="min-h-screen bg-[#1e1f22]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#2b2d31]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏢</div>
            <div>
              <h1 className="font-bold text-white">Control Tower</h1>
              <p className="text-xs text-zinc-400">Your AI Executive Team</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-8",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <p className="text-zinc-400 mt-1">
              {servers.length === 0 
                ? "Start your first project to get strategic analysis from your AI C-Suite"
                : `${servers.length} project${servers.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          {servers.length > 0 && <NewProjectButton />}
        </div>

        {/* Projects grid */}
        {servers.length === 0 ? (
          <>
            <InitialModel />
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Control Tower</h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Create your first project to get started. Our AI executive team will help you 
                validate ideas, plan strategy, and make better decisions.
              </p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => (
              <ProjectCard key={server.id} project={server} />
            ))}
            
            {/* New project card */}
            <NewProjectButton variant="card" />
          </div>
        )}
      </div>
    </main>
  );
}
