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
              {
                'These Terms of Service ("Terms") govern your access to and use of Bardo\'s website and services ("Services"). Please read these Terms carefully before using our Services. By accessing or using our Services, you agree to be bound by these Terms and our'
              }
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
              Bardo is a social platform designed for human connection, and sharing psychedelic experiences. Similar to other social apps, Bardo allows users to create profiles, share posts, and engage with others in a virtual community.
              However, different from other social apps, Bardo encourages anonymity. We strongly suggest users refrain from shairing their real names or any other personal identifiable information.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Eligibility'}</h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              To use Bardo, you must be a human. Bots and automated scraping tools are strictly prohibited from accessing or using our Services. By accessing or using Bardo, you represent and warrant that you are a human and will not use any automated means to access, scrape, or collect information from our platform.
            `}</p>
            <p className="text-[16px]/[28px] text-foreground">{`
              Children under the age of 13 are prohibitted from accessing or using Bardo's Services.
            `}</p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Prohibited Content'}</h3>
            <p className="text-[16px]/[28px] text-foreground">{`
              We strive to maintain a positive and respectful community on Bardo. Therefore, the following types of content are strictly prohibited:
            `}</p>
            <ul className="my-3 ml-8 list-disc text-[16px]/[28px] text-foreground">
              <li>
                {
                  'Derogatory content: Content that is defamatory, demeaning, or offensive towards individuals or groups.'
                }
              </li>
              <li>
                {
                  'Hate speech: Content that promotes violence, discrimination, or intolerance based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.'
                }
              </li>
              <li>
                {
                  'Inappropriate content: Content that is sexually explicit, pornographic, or otherwise inappropriate for our community.'
                }
              </li>
              <li>
                {
                  'Illegal activities: This is not a platform for buying or selling illegal substances. Bardo does not encourage nor condone engaging in illegal activities.'
                }
              </li>
            </ul>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">
              {'Reporting Violations'}
            </h3>
            <p className="text-[16px]/[28px] text-foreground">
              <span>
                {
                  'If you encounter any content on Bardo that violates these Terms or our Community Guidelines, please report it immediately to our team at'
                }
              </span>
              <span> </span>
              <span>
                <a href={'mailto:contact@bardo.app'} className="font-medium text-violet-600 underline">
                  {'contact@bardo.app'}
                </a>
              </span>
              <span>{'. '}</span>
              <span>{'We take all reports seriously and will take appropriate action to address violations.'}</span>
            </p>
          </section>

          <section className="space-y-1 py-5">
            <h3 className="font-semibold text-lg md:font-medium md:text-2xl md:leading-none">{'Conclusion'}</h3>
            <p className="text-[16px]/[28px] text-foreground">
              {
                'By using Bardo, you agree to abide by these Terms and our Community Guidelines. We reserve the right to suspend or terminate your access to our Services if you violate these Terms or engage in prohibited conduct. If you have any questions or concerns about these Terms, please contact us at'
              }
              <span> </span>
              <span>
                <a className="font-medium text-violet-600 underline" href={'mailto:contact@bardo.app'}>
                  {'contact@bardo.app'}
                </a>
              </span>
              <span>{'.'}</span>
            </p>
            <p>{'Thank you for being a part of the Bardo community!'}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
