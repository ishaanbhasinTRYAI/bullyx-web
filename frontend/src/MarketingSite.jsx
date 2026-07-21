import { useEffect, useRef, useState } from 'react'
import DemoRequestModal from './DemoRequestModal'
import { useAuth } from './AuthContext'

const Arrow = () => <span aria-hidden="true">↗</span>

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect() }
    }, { threshold: 0.08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`bx-reveal ${className}`}>{children}</div>
}

const steps = [
  ['01', 'Connect engineering sources', 'Bring robot logs, code, test runs, field reports, tickets, and design documents into one permission-aware workspace.'],
  ['02', 'Build living memory', 'Normalize every source into a continuously updated operating memory organized by robot, fleet, release, customer, and incident.'],
  ['03', 'Ask with evidence', 'Get concise answers that cite the exact runbook, log excerpt, issue, test result, or decision behind every claim.'],
  ['04', 'Turn answers into work', 'Create a scoped investigation, test plan, or field task with its evidence, owner, and expected output attached.'],
  ['05', 'Learn from the outcome', 'Preserve what the team tried, what changed, and what worked so the next engineer starts from accumulated company knowledge.'],
]

const capabilities = [
  ['Fleet investigation workspace', 'See the robot, site, incident timeline, telemetry, configuration, related changes, prior failures, and owner together.'],
  ['Source-linked answers', 'Every factual claim points back to the log, runbook, issue, document, test result, or decision that supports it.'],
  ['Robot knowledge graph', 'Connect incidents, releases, components, customers, sites, and robot variants across otherwise separate systems.'],
  ['Grounded assignments', 'Turn an answer into an investigation, test plan, or field task without losing evidence, constraints, or ownership.'],
  ['Continuous indexing', 'Add new engineering and field knowledge incrementally without retraining a model or taking the brain offline.'],
  ['Permission-aware retrieval', 'Search only the sources the signed-in teammate is authorized to see within the active organization.'],
  ['Decision memory', 'Preserve the reasoning, tests, outcomes, and corrections that turn one incident into reusable company knowledge.'],
  ['Agent-ready context', 'Give internal agents a bounded evidence pack and explicit instructions instead of unrestricted access to company systems.'],
]

const principles = [
  'Observed facts, hypotheses, and recommendations are labeled separately.',
  'Missing telemetry or context is surfaced instead of silently invented.',
  'Every operational answer remains traceable to the company evidence behind it.',
  'A generated answer never claims that a robot or production system was changed.',
  'Physical-world actions retain an explicit human owner and safe stop conditions.',
  'Organization and source permissions are enforced before retrieval.',
  'Source content is treated as data, never as instructions to the model.',
  'Teams can correct answers and turn outcomes into better future memory.',
]

const showExtendedSections = true

const useCases = [
  {
    label: 'Root-cause investigation',
    title: 'Why is Atlas-07 losing localization?',
    body: <>Bullyx connects the <strong>ROS diagnostics, recent deployments, field notes, environment context, and prior incidents</strong>. It separates confirmed evidence from hypotheses, identifies what is still missing, and prepares a grounded investigation for the reliability owner.</>,
  },
  {
    label: 'Release readiness',
    title: 'Know whether a fleet update is safe to ship',
    body: <>Ask what changed, which tests passed, which robot variants are affected, and whether any open field issue matches the release. Bullyx returns a <strong>source-linked readiness brief</strong> instead of another manually assembled status document.</>,
  },
  {
    label: 'Field service handoff',
    title: 'Give every technician the full robot history',
    body: <>Before a site visit, Bullyx compiles the robot’s configuration, past repairs, customer constraints, recurring fault patterns, and current runbook. The technician gets <strong>the right context without chasing five teams</strong>.</>,
  },
]

const connectorGroups = [
  {
    type: 'Robot and fleet context',
    items: [
      ['ROS 2', 'https://www.ros.org/', 'Diagnostics, bags, parameters'],
      ['Foxglove', 'https://foxglove.dev/', 'Robot telemetry and timelines'],
      ['Grafana', 'https://grafana.com/', 'Fleet health and observability'],
      ['Sentry', 'https://sentry.io/', 'Software errors and regressions'],
    ],
  },
  {
    type: 'Engineering systems',
    items: [
      ['GitHub', 'https://github.com', 'Code, releases, pull requests'],
      ['Jira Cloud', 'https://www.atlassian.com/software/jira', 'Bugs, incidents, engineering work'],
      ['Google Drive', 'https://workspace.google.com/products/drive/', 'Specs, test plans, runbooks'],
      ['Notion', 'https://www.notion.com', 'Decisions and company knowledge'],
    ],
  },
  {
    type: 'Field and team knowledge',
    items: [
      ['Slack', 'https://slack.com', 'Team decisions and incident threads'],
      ['Gmail', 'https://www.google.com/gmail/about/', 'Customer and partner context'],
      ['Zendesk', 'https://www.zendesk.com', 'Field issues and support history'],
      ['Granola', 'https://www.granola.ai', 'Design reviews and meeting notes'],
    ],
  },
]

const connectorItems = Array.from(
  new Map(connectorGroups.flatMap((group) => group.items).map((item) => [item[0], item])).values(),
)

const connectorLogos = {
  Gmail: '/connectors/gmail.png',
  GitHub: '/connectors/github.png',
  Granola: '/connectors/granola.png',
  Zendesk: '/connectors/zendesk.png',
  'Jira Cloud': '/connectors/jira.png',
  Slack: '/connectors/slack.png',
  'Google Drive': '/connectors/drive.png',
  Notion: '/connectors/notion.png',
}

function ConnectorPlaceholder({ name }) {
  const logo = connectorLogos[name]
  return (
    <span className="bx-connector-placeholder">
      {logo ? <img src={logo} alt={`${name} logo`} /> : <b aria-hidden="true">{name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2)}</b>}
    </span>
  )
}

function ConnectorModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="bx-connectors-modal-root" role="presentation" onClick={onClose}>
      <section className="bx-connectors-modal" role="dialog" aria-modal="true" aria-labelledby="connectors-title" onClick={(event) => event.stopPropagation()}>
        <header>
          <div><span>KNOWLEDGE SOURCE CATALOG</span><h2 id="connectors-title">Bring the whole robotics stack into one memory.</h2></div>
          <button type="button" onClick={onClose} aria-label="Close connector directory">×</button>
        </header>
        <p className="bx-connectors-lead">Index the systems where robot behavior, engineering decisions, and field experience already live. Start with exports and manual knowledge, then add direct syncs as your deployment grows.</p>
        <div className="bx-connectors-scroll">
          {connectorGroups.map((group) => (
            <section className="bx-connector-group" key={group.type}>
              <h3>{group.type}</h3>
              <div className="bx-connector-grid">
                {group.items.map(([name, url, description]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={`Visit ${name}`}>
                    <ConnectorPlaceholder name={name} />
                    <span>{name}</span>
                    <small>{description}</small>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}

function UseCaseVisual({ index }) {
  if (index === 1) {
    return (
      <div className="bx-case-mini bx-case-mini-message" aria-label="Fleet release readiness brief">
        <div className="bx-mini-head"><span>RELEASE 2.8.4</span><b>Readiness review</b></div>
        <div className="bx-mini-field"><small>FLEET</small><strong>Atlas · 42 production robots</strong></div>
        <div className="bx-mini-field"><small>CHANGE</small><strong>Localization recovery update</strong></div>
        <div className="bx-mini-copy"><i/><i/><i/><i/></div>
        <div className="bx-mini-actions"><span>2 gaps</span><b>Open cited readiness brief</b></div>
      </div>
    )
  }

  if (index === 2) {
    return (
      <div className="bx-case-mini bx-case-mini-shadow" aria-label="Field service context pack">
        <div className="bx-mini-head"><span>SITE VISIT · ATLAS-12</span><b>Context assembled</b></div>
        <div className="bx-shadow-row"><span>Prior repairs</span><strong>3 linked records</strong></div>
        <div className="bx-shadow-row"><span>Current runbook</span><strong>Drive calibration v6</strong></div>
        <div className="bx-shadow-result"><i>✓</i><div><small>TECHNICIAN PACK</small><b>Ready for handoff</b></div></div>
      </div>
    )
  }

  return (
    <div className="bx-case-mini" aria-label="Localization incident investigation">
      <div className="bx-mini-head"><span>INCIDENT · ATLAS-07</span><b>Reliability review</b></div>
      <div className="bx-mini-evidence"><i>✓</i><span>ROS diagnostic window</span><small>Linked</small></div>
      <div className="bx-mini-evidence"><i>✓</i><span>Release 2.8.3 changes</span><small>Linked</small></div>
      <div className="bx-mini-evidence missing"><i>!</i><span>Customer site map</span><small>Missing</small></div>
      <div className="bx-mini-proposal"><small>GROUNDED HYPOTHESIS</small><strong>Map-frame reset after recovery</strong><span>4 cited sources</span></div>
    </div>
  )
}

export default function MarketingSite() {
  const { user, profile } = useAuth()
  const [menu, setMenu] = useState(false)
  const [leadIntent, setLeadIntent] = useState(null)
  const [connectorsOpen, setConnectorsOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [activeUseCase, setActiveUseCase] = useState(0)

  function closeMenu() { setMenu(false) }
  function openDemo() { closeMenu(); setLeadIntent('demo') }
  function openWaitlist() { closeMenu(); setLeadIntent('waitlist') }

  return (
    <div className="bx-site">
      <header className="bx-nav">
        <a className="bx-logo" href="#top" aria-label="Bullyx home" onClick={closeMenu}>
          <img src="/bullyx-logo-engineering.png" alt="Bullyx" width="180" height="103" />
        </a>
        <nav className={menu ? 'open' : ''} aria-label="Main navigation">
          <a href="#product" onClick={closeMenu}>Company brain</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#use-cases" onClick={closeMenu}>Use cases</a>
        </nav>
        <div className="bx-nav-actions">
          {user ? <a className="bx-profile-link" href="/dashboard" aria-label="Open your dashboard">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span>{profile?.full_name?.[0] || user.email?.[0] || ''}</span>}</a> : <a className="bx-signin" href="/login">Sign in</a>}
          <button className="bx-nav-cta" type="button" onClick={openWaitlist}>Join waitlist <Arrow /></button>
        </div>
        <button className="bx-menu" type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu"><span/><span/></button>
      </header>

      <main id="top">
        <section className="bx-hero">
          <div className="bx-hero-copy">
            <div className="bx-eyebrow"><span /> The company brain for robotics teams</div>
            <h1>Your robots generate answers.<br/><em>Bullyx helps your company find them.</em></h1>
            <p>Connect engineering knowledge, robot data, and field experience in one source-linked memory. Ask what happened, why it happened, and what the team should do next.</p>
            <div className="bx-actions">
              <button className="bx-primary" type="button" onClick={openWaitlist}>Join waitlist <Arrow /></button>
              <button className="bx-secondary" type="button" onClick={openDemo}>Request a demo</button>
              <a className="bx-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
            </div>
            <p className="bx-roles">For autonomy, hardware, reliability, robot operations, field service, and customer teams.</p>
          </div>

          <div className="bx-hero-product">
            <div className="bx-product-shot" aria-label="Robot incident investigation grounded in company sources">
              <div className="bx-shot-bar"><span>FLEET INTELLIGENCE</span><div><i /> 5 sources connected</div></div>
              <div className="bx-case-head">
                <div><small>INCIDENT · RBX-214 · ATLAS-07</small><h2>Intermittent localization drift</h2><p>First observed 09:42 · customer site B</p></div>
                <strong>P1 <small>FLEET RISK</small></strong>
              </div>
              <div className="bx-case-grid">
                <div className="bx-case-main">
                  <div className="bx-panel-title">Investigation evidence</div>
                  <div className="bx-evidence ok"><b>✓</b><span>ROS diagnostic window<small>Foxglove · 09:38–09:47</small></span><em>Linked</em></div>
                  <div className="bx-evidence ok"><b>✓</b><span>Release and code changes<small>GitHub · v2.8.3</small></span><em>Linked</em></div>
                  <div className="bx-evidence missing"><b>!</b><span>Customer site map<small>Needed to validate hypothesis</small></span><em>Missing</em></div>
                  <div className="bx-policy-note"><span>Relevant runbook</span><strong>Localization incident response · v4</strong><small>Updated by Robot Reliability</small></div>
                </div>
                <div className="bx-proposal">
                  <div className="bx-panel-title">Grounded answer</div>
                  <span className="bx-agent">Bullyx Brain · 5 cited sources</span>
                  <h3>Recovery is resetting the map frame.</h3>
                  <p>The pattern begins after relocalization and matches a regression previously seen on Atlas-03.</p>
                  <dl><div><dt>Confidence</dt><dd>Evidence-backed</dd></div><div><dt>Owner</dt><dd>Autonomy</dd></div></dl>
                  <button type="button" onClick={openDemo}>Inspect answer + sources <span>→</span></button>
                </div>
              </div>
              <div className="bx-shot-foot"><span>Sources <b>Stay linked</b></span><span>Assignments <b>Keep an owner</b></span></div>
            </div>
            <div className="bx-connector-rail" aria-label="Connector preview">
              <div className="bx-connector-window">
                <div className="bx-connector-track">
                  {[...connectorItems, ...connectorItems].map(([name, url], index) => (
                    <a key={`${name}-${index}`} href={url} target="_blank" rel="noreferrer" aria-label={`Visit ${name}`}>
                      <ConnectorPlaceholder name={name} />
                      <span className="bx-connector-name">{name}</span>
                    </a>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => setConnectorsOpen(true)}><span aria-hidden="true">→</span> View all connectors</button>
            </div>
          </div>
        </section>

        <section className="bx-overview" id="product">
          <Reveal className="bx-overview-grid">
            <article>
              <span className="bx-kicker">WHAT’S THE PROBLEM?</span>
              <h2>Your most important knowledge is trapped in the work.</h2>
              <p>Robot companies debug real-world systems across <strong>telemetry, source code, test infrastructure, support tickets, field notes, design documents, and conversations</strong>. The full story rarely lives in one place. Engineers lose hours reconstructing context, field teams repeat old investigations, and hard-won operational knowledge leaves when people do.</p>
              <div className="bx-fragmented-visual" aria-label="A robot incident spread across company systems">
                <div className="bx-fragmented-case"><small>ROBOT INCIDENT</small><strong>Localization drift</strong><span>Atlas-07 · Site B</span></div>
                <div className="bx-fragmented-systems">
                  {[
                    ['Robot telemetry', ['Foxglove']],
                    ['Code & releases', ['GitHub']],
                    ['Test runs', ['Grafana']],
                    ['Field issues', ['Zendesk']],
                    ['Design docs', ['Google Drive', 'Notion']],
                    ['Team decisions', ['Slack', 'Granola']],
                  ].map(([system, logos], index) => (
                    <span key={system}>
                      <i>{String(index + 1).padStart(2, '0')}</i>
                      <b>{system}</b>
                      <span className="bx-fragmented-logos">
                        {logos.map((name) => connectorLogos[name] ? <img key={name} src={connectorLogos[name]} alt={`${name} logo`} /> : <b key={name}>{name.slice(0, 2).toUpperCase()}</b>)}
                      </span>
                    </span>
                  ))}
                </div>
                <p><span>6 systems</span><span>1 failure</span><span>No shared memory</span></p>
              </div>
            </article>
            <article>
              <span className="bx-kicker">OUR SOLUTION</span>
              <h2>A source-linked memory built for the physical world.</h2>
              <p>Bullyx turns scattered engineering and operations data into a <strong>living company brain</strong>. It retrieves only the information each teammate is allowed to see, cites the evidence behind every answer, and makes uncertainty visible. A useful answer can become a <strong>scoped investigation or field task</strong> without losing the sources, assumptions, or human owner.</p>
              <div className="bx-control-visual" aria-label="Bullyx flow from robotics sources to grounded work">
                <div className="bx-control-node"><small>ROBOTICS SOURCES</small><strong>Logs, code, docs, field history</strong><span>Permission-aware sync</span></div>
                <i className="bx-control-arrow">↓</i>
                <div className="bx-control-node primary"><small>BULLYX COMPANY BRAIN</small><strong>Retrieves + connects evidence</strong><span>Unknowns stay explicit</span></div>
                <div className="bx-control-branch"><span>Every claim stays traceable</span><i>→</i></div>
                <div className="bx-control-node review"><small>TEAM ANSWER</small><strong>Facts, hypotheses, next checks</strong><span>Cited to source records</span></div>
                <i className="bx-control-arrow">↓</i>
                <div className="bx-control-node final"><small>GROUNDED WORK</small><strong>Assign + learn</strong><span>Owner and outcome preserved</span></div>
              </div>
            </article>
            <article className="bx-usecase-slider" id="use-cases">
              <span className="bx-kicker">USE CASES</span>
              <div className="bx-usecase-slide" aria-live="polite">
                <small>{useCases[activeUseCase].label}</small>
                <h2>{useCases[activeUseCase].title}</h2>
                <p>{useCases[activeUseCase].body}</p>
                <UseCaseVisual index={activeUseCase} />
              </div>
              <div className="bx-usecase-controls">
                <button type="button" aria-label="Previous use case" onClick={() => setActiveUseCase((activeUseCase - 1 + useCases.length) % useCases.length)}>←</button>
                <span>{String(activeUseCase + 1).padStart(2, '0')} / {String(useCases.length).padStart(2, '0')}</span>
                <button type="button" aria-label="Next use case" onClick={() => setActiveUseCase((activeUseCase + 1) % useCases.length)}>→</button>
              </div>
            </article>
          </Reveal>
        </section>

        <section className="bx-workflow" id="how-it-works">
          <Reveal className="bx-section-intro light">
            <span className="bx-kicker">HOW THE BRAIN WORKS</span>
            <h2>One memory for<br/>every robot team.</h2>
            <p>Bullyx sits across the robotics stack, connecting what the robot did with what the company knew, decided, and tried next.</p>
          </Reveal>
          <Reveal className="bx-workflow-layout">
            <div className="bx-step-list">
              {steps.map((step, i) => <button key={step[1]} type="button" className={activeStep === i ? 'active' : ''} onMouseEnter={() => setActiveStep(i)} onFocus={() => setActiveStep(i)} onClick={() => setActiveStep(i)}><span>{step[0]}</span><strong>{step[1]}</strong><i>→</i></button>)}
            </div>
            <div className="bx-step-stage">
              <span className="bx-stage-number">{steps[activeStep][0]}</span>
              <div><small>ROBOTICS KNOWLEDGE LOOP</small><h3>{steps[activeStep][1]}</h3><p>{steps[activeStep][2]}</p></div>
              <div className="bx-stage-track"><span style={{ width: `${(activeStep + 1) * 20}%` }} /></div>
            </div>
          </Reveal>
        </section>

        {showExtendedSections && <section className="bx-use-case" id="use-case">
          <Reveal className="bx-use-copy">
            <span className="bx-kicker">A REALISTIC ROBOTICS WORKFLOW</span>
            <h2>Atlas-07 starts drifting at one customer site.</h2>
            <p>Before an engineer opens another blank incident doc, Bullyx assembles the robot context and makes the evidence gaps visible.</p>
            <div className="bx-case-facts">
              {['Robot and site configuration', 'ROS diagnostic window', 'Recent software changes', 'Comparable past incidents', 'Current recovery runbook', 'Missing environment data', 'Grounded test hypothesis', 'Named engineering owner'].map(item => <span key={item}>{item}</span>)}
            </div>
          </Reveal>
          <Reveal className="bx-review-flow">
            <div className="bx-review-head"><span>GROUNDED INVESTIGATION</span><b>Known facts · explicit unknowns</b></div>
            <div className="bx-review-row"><span>01</span><div><small>AFFECTED ASSET</small><strong>Atlas-07 · customer site B</strong></div><em>Production robot</em></div>
            <div className="bx-review-row"><span>02</span><div><small>OBSERVED PATTERN</small><strong>Map-frame reset after recovery</strong></div><em>3 cited logs</em></div>
            <div className="bx-review-row"><span>03</span><div><small>COMPARABLE INCIDENT</small><strong>RBX-173 · Atlas-03</strong></div><em>Same release family</em></div>
            <div className="bx-review-row"><span>04</span><div><small>NEXT SAFE CHECK</small><strong>Replay recovery with site map</strong></div><em>Autonomy owner</em></div>
            <div className="bx-review-actions"><button type="button">Open sources</button><button type="button" className="approve">Assign investigation</button></div>
            <p>The record preserves the question, evidence, hypotheses, missing context, owner, and eventual outcome.</p>
          </Reveal>
        </section>}

        {showExtendedSections && <section className="bx-capabilities">
          <Reveal className="bx-section-intro">
            <span className="bx-kicker">PRODUCT CAPABILITIES</span>
            <h2>One brain across the full robotics lifecycle.</h2>
            <p>Incidents, releases, tests, robot configurations, field history, and team decisions stay connected from the lab to every customer site.</p>
          </Reveal>
          <Reveal className="bx-capability-list">
            {capabilities.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
          </Reveal>
        </section>}

        {showExtendedSections && <section className="bx-security" id="security">
          <Reveal className="bx-security-copy">
            <span className="bx-kicker">TRUST BY DESIGN</span>
            <h2>Evidence is explicit.<br/>Uncertainty stays visible.</h2>
            <p>Robotics lives in the physical world, where a plausible answer is not enough. Bullyx keeps sources, unknowns, ownership, and safe next checks in the interface.</p>
          </Reveal>
          <Reveal className="bx-principles">
            {principles.map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
          </Reveal>
        </section>}

        {showExtendedSections && <section className="bx-scope">
          <Reveal className="bx-scope-copy">
            <span className="bx-kicker">CURRENT PRODUCT SCOPE</span>
            <h2>Start with memory. Expand into trusted workflows.</h2>
            <p>The first deployment focuses on indexing company knowledge, asking cited questions, and assigning grounded follow-up work. Direct robot control and unsupervised production changes remain outside the product boundary.</p>
          </Reveal>
          <Reveal className="bx-scope-grid">
            <div><span>FOUNDATION AVAILABLE NOW</span><ul><li>Organization-isolated knowledge index</li><li>Manual ingestion for logs, reports, and runbooks</li><li>Cited Ask conversations and source viewer</li><li>Answer feedback and correction signals</li><li>Grounded agent assignments with evidence</li><li>Connector-ready robotics source catalog</li></ul></div>
            <div className="caution"><span>IMPORTANT BOUNDARIES</span><ul><li>No direct robot actuation from an answer</li><li>No claim is accepted without accessible evidence</li><li>Adding a source does not grant write access</li><li>Humans own production and field decisions</li><li>Direct connectors require deployment setup</li></ul></div>
          </Reveal>
        </section>}

        <section className="bx-final">
          <Reveal>
            <span className="bx-kicker">JOIN THE WAITLIST</span>
            <h2>Stop rebuilding context from scratch.</h2>
            <p>We’re working with robotics teams that want faster investigations, safer releases, stronger field handoffs, and a company memory that compounds with every deployment.</p>
            <div className="bx-actions">
              <button type="button" onClick={openWaitlist}>Join waitlist <Arrow /></button>
              <button className="bx-final-secondary" type="button" onClick={openDemo}>Request a pilot</button>
              <a href="mailto:bullyxai@gmail.com">Talk to the team</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <a className="bx-logo" href="#top" aria-label="Bullyx home"><img src="/bullyx-logo-engineering.png" alt="Bullyx" width="160" height="92" /></a>
        <p>The source-linked company brain for robotics teams.</p>
        <span>© 2026 BULLYX, INC.</span>
      </footer>
      <DemoRequestModal open={Boolean(leadIntent)} intent={leadIntent || 'demo'} onClose={() => setLeadIntent(null)} />
      <ConnectorModal open={connectorsOpen} onClose={() => setConnectorsOpen(false)} />
    </div>
  )
}
