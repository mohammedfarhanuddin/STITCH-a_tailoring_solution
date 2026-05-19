import { useEffect, useState } from 'react'
import { listCustomerIssues } from '../../domain/admin'
import type { CustomerIssueRecord } from '../../domain/types'

export function CustomerIssuesPage() {
  const [issues, setIssues] = useState<CustomerIssueRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function refresh() {
      setLoading(true)
      setIssues(await listCustomerIssues())
      setLoading(false)
    }
    void refresh()
  }, [])

  return (
    <section className="card">
      <h1>Customer Issues</h1>
      {loading ? (
        <p className="muted">Loading issues...</p>
      ) : issues.length === 0 ? (
        <p className="muted">No issues submitted yet.</p>
      ) : (
        <ul className="list">
          {issues.map((issue) => (
            <li key={issue.id} className="listRow">
              <div>
                <b>{issue.customerName}</b>
                <div className="muted">{new Date(issue.createdAtIso).toLocaleString()}</div>
                <div>{issue.message}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

