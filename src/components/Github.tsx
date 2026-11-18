import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, repoFallback } from '@/data/site'
import type { GitHubRepo } from '@/data/site'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import {
  ArrowUpRightIcon,
  ForkIcon,
  GithubIcon,
  StarIcon,
} from './ui/icons'

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Markdown: '#083fa1',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

export function Github() {
  const [repos, setRepos] = useState<GitHubRepo[]>(repoFallback)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/users/chavansrikar/repos?per_page=100&sort=updated',
          { headers: { Accept: 'application/vnd.github+json' } }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        // The REST API uses stargazers_count / forks_count; normalize to the
        // shape the UI and the bundled fallback both speak.
        type ApiRepo = {
          name: string
          description: string | null
          language: string | null
          stargazers_count: number
          forks_count: number
          html_url: string
          updated_at: string
        }
        const data = (await res.json()) as ApiRepo[]
        if (!cancelled && Array.isArray(data) && data.length) {
          const snapshot = new Map(repoFallback.map((r) => [r.name, r]))
          setRepos(
            data.map((r) => ({
              name: r.name,
              description: r.description ?? snapshot.get(r.name)?.description ?? '',
              language: r.language ?? 'None',
              stars: r.stargazers_count ?? 0,
              forks: r.forks_count ?? 0,
              html_url: r.html_url,
              updated_at: r.updated_at,
            }))
          )
          setLive(true)
        }
      } catch {
        // Keep the bundled snapshot if the network is unavailable.
        if (!cancelled) setLive(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const totalStars = repos.reduce((s, r) => s + (r.stars ?? 0), 0)
  const visible = repos.slice(0, 12)

  return (
    <Section
      id="github"
      index="07"
      eyebrow="Open source"
      title={
        <>
          The <span className="text-gradient-static">public record</span>, straight from
          the API.
        </>
      }
      description={`${repos.length} public repositories and ${totalStars} stars. Fetched live from the GitHub API, with a cached snapshot as fallback.`}
    >
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
              live
                ? 'border-lime-400/25 bg-lime-400/[0.07] text-lime-300'
                : 'border-purple-400/25 bg-purple-400/[0.07] text-purple-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                live ? 'bg-lime-400 glow-dot' : 'bg-purple-400'
              }`}
            />
            {loading ? 'Syncing' : live ? 'Live API' : 'Cached snapshot'}
          </span>

          <Button
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            variant="ghost"
            className="!px-4 !py-2 !text-[12px]"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            Open @chavansrikar
            <ArrowUpRightIcon className="h-3 w-3 opacity-60" />
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)
            : visible.map((repo, i) => (
                <motion.a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.035, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  data-cursor="REPO"
                  className="glass card-hover group flex flex-col rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <GithubIcon className="h-3.5 w-3.5 shrink-0 text-mist/50 transition-colors group-hover:text-cyan-300" />
                      <span className="line-clamp-3 break-words font-mono text-[12px] leading-snug text-chalk transition-colors group-hover:text-cyan-200">
                        {repo.name}
                      </span>
                    </div>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-mist/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                  </div>

                  <p className="mt-2 line-clamp-2 flex-1 text-[12px] leading-relaxed text-mist/80">
                    {repo.description || 'No description provided.'}
                  </p>

                  <div className="mt-3 flex items-center gap-3.5 font-mono text-[10px] text-mist/70">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: LANG_COLORS[repo.language] ?? '#8b93b0',
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <StarIcon className="h-3 w-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <ForkIcon className="h-3 w-3" />
                      {repo.forks}
                    </span>
                  </div>
                </motion.a>
              ))}
        </AnimatePresence>
      </div>

      <Reveal delay={0.15}>
        <div className="mt-8 overflow-x-auto">
          <pre className="ascii text-[9px] leading-relaxed text-mist/35 sm:text-[11px]">
            {[
              '$ gh repo list chavansrikar --limit 6',
              ...repos.slice(0, 6).map((r) => `  ${r.name.padEnd(46)} ★${r.stars}  ${r.language ?? '-'}`),
              '$ gh api user --jq .followers',
              '  7',
              '$ gh api user --jq .public_repos',
              `  ${repos.length}`,
            ].join('\n')}
          </pre>
        </div>
      </Reveal>
    </Section>
  )
}

function RepoSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-xl p-4">
      <div className="mb-3 h-3 w-2/3 animate-pulse rounded bg-white/8" />
      <div className="mb-2 h-2.5 w-full animate-pulse rounded bg-white/5" />
      <div className="mb-4 h-2.5 w-4/5 animate-pulse rounded bg-white/5" />
      <div className="flex gap-3">
        <div className="h-2.5 w-14 animate-pulse rounded bg-white/5" />
        <div className="h-2.5 w-8 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  )
}
