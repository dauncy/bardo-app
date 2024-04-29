import { Separator } from '@app/components/bardo/Separator'
import { MainNav } from '@app/components/nav/MainNav'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  return json({
    currentUser: user && authProfile ? user : null,
  })
}

export default function ToSPage() {
  const { currentUser } = useLoaderData<typeof loader>()
  return (
    <div className="relative flex h-max min-h-full w-full min-w-full flex-1 flex-col">
      <MainNav user={currentUser} />
      <div className="flex flex-1 flex-col items-center bg-violet-50 px-4 pb-3 pt-[66px] md:px-6">
        <div className="mx-auto w-full max-w-3xl flex-1 flex-col rounded-md border bg-white p-4 shadow md:p-6 ">
          <header>
            <h1 className="font-semibold text-3xl text-foreground md:text-left">{'Terms of Service'}</h1>
            <h2 className="mt-1 font-regular tracking-tight text-foreground/[0.8] md:mt-3 md:font-medium md:text-[17px]">
              {'This is meant to be read in conjuction with our'}
              <span> </span>
              <span className="font-medium text-violet-600 underline">
                <Link to={'/privacy'}>{'Privacy Policy.'}</Link>
              </span>
            </h2>
            <Separator className="my-3 md:mb-5 md:mt-7" />
            <p className="font-regular text-sm text-foreground">{'Date: May 1st, 2024'}</p>
          </header>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Introduction'}</h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              This Privacy Policy details important information regarding the collection, use and disclosure of User information collected on Bardo("website"). The aim of this Privacy Policy is to help you understand how your personal information is used and your choices regarding said use. By using the website, you agree that Bardo can collect, use, disclose, and process your information as described in this Privacy Policy. This Privacy Policy only applies to the website, and not to any other websites, products or services you may be able to access or link to via bardo. We encourage you to read the privacy policies of any other websites you visit before providing your information to them.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">
              {'What we Collect and Why'}
            </h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              The personal information collected from you includes:
            `}</p>
            <ul className="my-3 ml-8 list-disc text-[16px]/[28px] text-foreground">
              <li>{'Your email'}</li>
              <li>
                {
                  'Demographic information such as date of birth, gender, race, education level as provided by you to Bardo via filling out forms or any other means.'
                }
              </li>
            </ul>
            <p className="text-[16px]/[28px] text-foreground">{`
              The website only collects this information via direct interactions with forms or other explicit interactions.
            `}</p>
            <p className="text-[16px]/[28px] text-foreground">{`
              Bardo uses demographic information shared by you to conduct research to improve the practices of post-psychedelic integration. All analysis or other research with demographic data will be de-indetified.
            `}</p>
            <p className="text-[16px]/[28px] text-foreground">{`
              The website encourages you not to share any personaly identifiable data such as your name, location or place of work.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">
              {'Information Not Collected'}
            </h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              Any other personally-identifiable information about you shall not be collected, unless you give it to Bardo. : by filling out a form, giving written feedback, communicating via third party social media sites, or otherwise communicating via the website.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Cookies'}</h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              The website uses cookies.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Firebase'}</h3>
            <p className="text-[16px]/[28px] text-foreground">
              {`
              The website uses Firebase as our authentication provider. 
            `}
              <span>{"Read about Firebase's privacy measures"}</span>
              <span> </span>
              <span className="font-medium text-violet-600 underline">
                <a href={'https://firebase.google.com/support/privacy'} target={'_blank'} rel="noreferrer">
                  {'here.'}
                </a>
              </span>
            </p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Security'}</h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              No organization, Bardo included, can guarantee the security of information processed online. However, Bardo has appropriate security measures in place to protect your personal information. Personal information you provide is stored on servers with limited accesss, encryption, or both.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">
              {'Changes and Updates'}
            </h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              Your personal information will be processed in accordance with this Privacy Policy, and as part of that you will have limited or no opportunity to otherwise modify how your information is used.
            `}</p>
            <p className="text-[16px]/[28px] text-foreground">{`
              This Privacy Policy may be revised and the latest revision will be reflected by the posted date above. Revisit this page to stay aware of any changes. Your continued use of the Bardo website constitutes your agreement to this Privacy Policy and any future revisions.
            `}</p>

            <p className="text-[16px]/[28px] text-foreground">{'Contatc Information:'}</p>
            <a
              className="ml-5 font-medium text-[16px]/[28px] text-violet-600 underline"
              href={`mailto:privacy@bardo.app`}
            >
              {'privacy@bardo.app'}
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
