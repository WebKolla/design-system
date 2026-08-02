import { Button } from '@/components/atoms/Button/Button'
import { Field } from '@/components/molecules/Field/Field'
import { PHOTOS } from '@/assets/photography'

/**
 * 2g · Sign in.
 *
 * Two panels, no site chrome: an ink panel carrying the proposition and a
 * surface panel carrying the form. The ink panel is one of the three places
 * `ink/*` is used, so every colour on it comes from that mode-invariant set —
 * `muted-foreground` here would measure about 2:1.
 *
 * Below 834 the ink panel is dropped rather than stacked. On a phone it would
 * push the form below the fold, and the form is the entire purpose of the page.
 */
export function SignIn() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="bg-ink relative hidden flex-col justify-between overflow-hidden p-12 md:flex">
        <img
          src={PHOTOS.loginBackground.src}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-15"
        />

        <div className="relative flex items-center gap-2.5">
          <span
            aria-hidden
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
          >
            TS
          </span>
          <span className="text-heading-block text-ink-foreground">TimeSubmit</span>
        </div>

        <div className="relative flex max-w-[420px] flex-col gap-4">
          <p className="text-heading-section text-ink-foreground">
            Submit time, get approvals, generate invoices.
          </p>
          <p className="text-body-lg text-ink-muted">
            Approvers sign off hours without ever seeing what those hours bill
            at. That is the whole point.
          </p>
        </div>

        <p className="text-body-caption text-ink-faint relative">
          © 2026 TimeSubmit Ltd.
        </p>
      </div>

      <div className="bg-surface flex items-center justify-center p-8">
        <form className="flex w-full max-w-[360px] flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-heading-page-title text-foreground">Sign in</h1>
            <p className="text-body text-muted-foreground">
              No account?{' '}
              <a href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                Start a free practice
              </a>
            </p>
          </div>

          <Field
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="you@consultancy.co.uk"
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between gap-3">
            <a
              href="/reset"
              className="text-body-caption text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgotten your password?
            </a>
          </div>

          <Button type="submit">Sign in</Button>

          <p className="text-body-caption text-subtle-foreground">
            Signing in accepts our{' '}
            <a href="/terms" className="text-primary underline-offset-4 hover:underline">
              terms
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
              privacy notice
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  )
}
