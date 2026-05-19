import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransitionWrapper } from './PageTransitionWrapper'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="appShell">
      <Navbar />
      <main className="mainContainer">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>
      <Footer />
    </div>
  )
}
