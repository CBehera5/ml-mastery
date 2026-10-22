import {AlgorithmBookOpening,AlgorithmBookExplanation} from "../../../supervised/book-reading";
import bookStyles from "../../../supervised/book-reading.module.css";
import {EquationReader} from "../../../experience/equation-literacy/equation-reader";
import Link from "next/link";
import type { ReactNode } from "react";
import { PublicNav } from "../../../landing/public-nav";
import { adjacentLessons, lessonHref, LINEAR_REGRESSION_PATH, REGRESSION_LESSONS, type RegressionLesson } from "../curriculum";

export function RegressionShell({ lesson, children }: { lesson: RegressionLesson; children?: ReactNode }) {
  const adjacent = adjacentLessons(lesson.id);
  return <main className="regression-page">
    <a className="regression-skip-link" href="#regression-lesson-content">Skip to lesson content</a>
    <PublicNav active="Algorithms"/>
    <header className="regression-lesson-hero">
      <div><Link href={LINEAR_REGRESSION_PATH} className="refresher-link">← Linear Regression overview</Link><p className="eyebrow">Lesson {String(lesson.number).padStart(2,"0")} · {lesson.type}</p><h1>{lesson.title}</h1><p>{lesson.summary}</p></div>
      <aside className="panel regression-outcome"><span>LEARNING OUTCOME</span><strong>{lesson.objective}</strong><p>{lesson.duration} · Learn at your own pace</p></aside>
    </header>
    <section className="regression-course-shell">
      <nav className="panel regression-lesson-rail" aria-label="Linear Regression lessons">{REGRESSION_LESSONS.map((item)=><Link key={item.id} href={lessonHref(item.id)} className={`${item.id===lesson.id?"current":""}`} aria-current={item.id===lesson.id?"page":undefined}><b>{item.number}</b><span>{item.shortTitle}</span></Link>)}</nav>
      {children?<article id="regression-lesson-content" tabIndex={-1} className="panel regression-lab-surface">{lesson.id!=="mastery"&&<EquationReader key={lesson.id} module="regression"/>}{children}{lesson.id!=="mastery"&&<details className={bookStyles.companion}><summary>Explore the book’s separate housing example</summary><AlgorithmBookOpening module="linear" lesson={lesson.number-1}/><AlgorithmBookExplanation module="linear" lesson={lesson.number-1}/></details>}<footer className="regression-route-nav">{adjacent.previous?<Link href={lessonHref(adjacent.previous.id)}>← {adjacent.previous.shortTitle}</Link>:<Link href={LINEAR_REGRESSION_PATH}>← Overview</Link>}<span>Lesson {lesson.number} of 9</span>{adjacent.next?<Link href={lessonHref(adjacent.next.id)}>{adjacent.next.shortTitle} →</Link>:<Link href={LINEAR_REGRESSION_PATH}>Review pathway →</Link>}</footer></article>:<article id="regression-lesson-content" tabIndex={-1} className="panel regression-placeholder">
        <div className="placeholder-label"><span aria-hidden="true">◇</span><div><p className="eyebrow">Task 009.2 framework</p><h2>Lesson route ready</h2></div></div>
        <p>This phase establishes the curriculum route and learning outcome. Its mathematical lab, guided activities, assessment, and mastery evidence will be implemented in the approved later phases.</p>
        <h3>Planned learning experiences</h3><ul>{lesson.futureDeliverables.map((item)=><li key={item}>{item}<span>Planned</span></li>)}</ul>
        <div className="framework-boundary"><strong>Not counted as completion</strong><p>Opening this page does not complete the lesson or award mastery. Those states will require observable learner evidence.</p></div>
        <footer className="regression-route-nav">{adjacent.previous?<Link href={lessonHref(adjacent.previous.id)}>← {adjacent.previous.shortTitle}</Link>:<Link href={LINEAR_REGRESSION_PATH}>← Overview</Link>}<span>Lesson {lesson.number} of 9</span>{adjacent.next?<Link href={lessonHref(adjacent.next.id)}>{adjacent.next.shortTitle} →</Link>:<Link href={LINEAR_REGRESSION_PATH}>Review pathway →</Link>}</footer>
      </article>}
    </section>
  </main>;
}
