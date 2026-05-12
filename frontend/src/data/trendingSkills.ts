export type TrendingSkill = {
  skill: string
  demandIndex: number
  growth: number
  category: 'Cloud' | 'AI' | 'Web' | 'Data' | 'Security'
}

export const TRENDING_SKILLS: TrendingSkill[] = [
  { skill: 'LLM application design', demandIndex: 94, growth: 42, category: 'AI' },
  { skill: 'Kubernetes', demandIndex: 91, growth: 18, category: 'Cloud' },
  { skill: 'TypeScript', demandIndex: 88, growth: 12, category: 'Web' },
  { skill: 'Vector databases', demandIndex: 86, growth: 55, category: 'Data' },
  { skill: 'Zero-trust networking', demandIndex: 82, growth: 21, category: 'Security' },
  { skill: 'Observability (OTel)', demandIndex: 80, growth: 27, category: 'Cloud' },
  { skill: 'Prompt + eval harnesses', demandIndex: 78, growth: 48, category: 'AI' },
  { skill: 'React Server Components', demandIndex: 76, growth: 33, category: 'Web' },
  { skill: 'dbt + semantic layers', demandIndex: 74, growth: 19, category: 'Data' },
  { skill: 'Secure SDLC automation', demandIndex: 72, growth: 15, category: 'Security' },
]
