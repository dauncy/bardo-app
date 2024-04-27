import { Button } from '../bardo/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../bardo/Dialog'
import { Icons } from '../bardo/Icons'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'

export const LearnMoreModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className="mt-1 flex w-full flex-1 items-center gap-x-2 self-start">
          {'Learn More'}
          <Icons.ArrowUpRight className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-start justify-start">
        <DialogHeader>
          <DialogTitle>{'About Bardo'}</DialogTitle>
        </DialogHeader>

        <TypographyParagraph className="text-muted-foreground" size={'small'}>
          {
            "Our mission is to provide users a dedicated space to document their unique psychedelic experiences and the opportunity to share them with others. It's a group experiment where we attempt to articulate and make sense of experiences beyond our known capacities induced by psychedelics. We created Bardo.app so users can turn to each other for a sanity check. Together, our collective experiences will help us to understand a new reality. We hope you'll share our mission and join the Bardo.app community today!"
          }
        </TypographyParagraph>
      </DialogContent>
    </Dialog>
  )
}
