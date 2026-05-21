import { useState } from 'react'
import { getErrorMessage } from '@/api/client'
import { generateMockInterview, evaluateMockInterview } from '@/api/interviewApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import type { InterviewQuestion } from '@/types/api'

type Phase = 'setup' | 'active' | 'results'

export default function InterviewPage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [overallScore, setOverallScore] = useState<number | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await generateMockInterview(targetRole, 5)
      setInterviewId(res.interviewId)
      setQuestions(res.questions)
      setPhase('active')
      setCurrentIdx(0)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to generate interview. Ensure you have a roadmap generated.'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitInterview = async () => {
    if (!interviewId) return
    setLoading(true)
    setError(null)
    
   
    const payload = questions.map((q) => ({
      questionId: q._id,
      answer: answers[q._id] || "I don't know"
    }))

    try {
      const res = await evaluateMockInterview(interviewId, payload)
      setQuestions(res.questions)
      setOverallScore(res.overallScore)
      setPhase('results')
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to evaluate interview.'))
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      void handleSubmitInterview()
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">AI Interview</p>
        <h2 className="font-display text-3xl font-semibold text-white">Mock Technical Interview</h2>
        <p className="mt-2 text-slate-400">
          Test your readiness. Questions are dynamically generated based on your past experience and your new AI roadmap skills.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      )}

      {/* PHASE 1: SETUP */}
      {phase === 'setup' && (
        <Card>
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Configure Session</h3>
              <p className="mt-1 text-sm text-slate-400">
                What role are you preparing to interview for?
              </p>
            </div>
            <Input 
              label="Target Role (e.g., Fullstack Developer)" 
              value={targetRole} 
              onChange={(e) => setTargetRole(e.target.value)} 
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !targetRole}>
                {loading ? <Spinner label="Generating AI Questions..." /> : 'Start Interview'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* PHASE 2: ACTIVE INTERVIEW */}
      {phase === 'active' && questions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <Badge tone="accent">{questions[currentIdx].category.replace('_', ' ')}</Badge>
          </div>
          
          <Card className="border-cyan-400/20">
            <h3 className="text-lg font-medium text-white mb-6">
              {questions[currentIdx].question}
            </h3>
            
            <Textarea 
              rows={6}
              placeholder="Type your answer here... (or type 'I don't know' to skip)"
              value={answers[questions[currentIdx]._id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [questions[currentIdx]._id]: e.target.value }))}
            />

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNextQuestion} disabled={loading}>
                {loading ? <Spinner label="Grading Answers..." /> : (currentIdx === questions.length - 1 ? 'Submit Interview' : 'Next Question')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* PHASE 3: RESULTS */}
      {phase === 'results' && (
        <div className="space-y-6">
          <Card className="flex flex-col items-center justify-center py-8 bg-surface-2/40 border-emerald-500/20">
            <h3 className="text-xl text-slate-300">Final Score</h3>
            <p className={`text-6xl font-display font-bold mt-2 ${overallScore && overallScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {overallScore}%
            </p>
          </Card>

          <h3 className="font-display text-2xl font-semibold text-white mt-8 mb-4">Detailed Feedback</h3>
          
          <div className="grid gap-4">
            {questions.map((q, idx) => (
              <Card key={q._id} className="border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-400 text-sm">Q{idx + 1}</span>
                  <Badge tone={q.score && q.score >= 6 ? 'success' : 'danger'}>
                    Score: {q.score}/10
                  </Badge>
                </div>
                <h4 className="text-white font-medium mb-2">{q.question}</h4>
                <div className="bg-black/30 p-3 rounded-md text-sm text-slate-300 mb-4 border border-white/5">
                  <span className="text-slate-500 block mb-1">Your Answer:</span>
                  {q.userAnswer}
                </div>
                <p className="text-sm text-cyan-200 bg-cyan-950/30 p-3 rounded-md border border-cyan-500/20">
                  <span className="font-semibold block mb-1">AI Feedback:</span>
                  {q.feedback}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
             <Button onClick={() => setPhase('setup')} variant="secondary">Take Another Interview</Button>
          </div>
        </div>
      )}
    </div>
  )
}