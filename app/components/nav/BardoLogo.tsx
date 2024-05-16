import { Link } from '@remix-run/react'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'

export const BardoLogo = () => {
  return (
    <Link to={'/'} className="flex cursor-pointer items-center gap-x-2">
      <div className="flex size-12 items-center justify-center rounded-full border border-2 border-black bg-yellow-200">
        <img src={'/logo.png'} alt="" className="flex size-7 object-contain object-center" />
      </div>
      <TypographyParagraph size={'large'} className="font-semibold text-2xl uppercase">
        {'Bardo'}
      </TypographyParagraph>
    </Link>
  )
}
