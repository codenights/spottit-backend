import { CommentRepository } from '../../domain/repository'
import { Comment } from '../../domain/model'

interface Database {
  [key: string]: Comment
}

const comment1 = new Comment(
  'comment-1',
  'user-id-1',
  'spot-1',
  `# Minor bracchia diemque

## Torquet montes

Lorem markdownum redeuntem tu sana, silentum inexpleto es sitim color, guttae.
Ignisque Lyncides vacet, et longo, laudibus Hyperborea ablata tollentes, fecit
sibi positis. Ait hic iuvenem, satus tempora; poma crebri, ingens, det armo imum
ore. Proelia sed crinem et huc altera fortuna! In occiduae [graves
quid](http://www.caper-amplectitur.org/sacrosat) traiecit, qui quondam Iovis,
[sumpsitque](http://atque.org/).`,
  new Date(Date.UTC(2019, 3, 16))
)
const comment2 = new Comment(
  'comment-2',
  'user-id-2',
  'spot-1',
  `# Tu sole fata ducebas

## Plura Haemonias tegit

Lorem markdownum Illa. Errat posse quoque, tua fulmina se nulla.

    indexArchitectureName += server + thermistor;
    var path = heuristicSata(printerOverclocking);
    var clipboardModel = clickGigabyteUp + mnemonicInterfaceHashtag + -2 -
            app_secondary_output;

Quibus sunto et tota laevum spes uritur devenit enim quo, **non** fecit
praecordia! Volucrum accepti placebimus spatio victoria super iuvenem? [Pro in
paterno](http://mortes.io/addidit) videbor; fame terra auctor silicem: cucurri,
sit et. Vectus est spretae arcana; sua vox essent cristis antemnas frena penset
me oculos trahuntur adurat formamque [infelix](http://pellis.org/causahabet).
`,
  new Date(Date.UTC(2019, 3, 17))
)
const comment3 = new Comment(
  'comment-3',
  'user-id-1',
  'spot-1',
  `# Nuper nosces oraque hos revolutaque sensit tuae

## Undique effugere vinci quo

Lorem markdownum *comitum* cervice tibi, fratrum quae quondam gramen sulphure:
ego ordine urbs luctus, terram huc utque. Miserum nullo. Aptato est, te tanta
sanguine Lernae pignus petitis adeunt insignia venabula aras, voluptas ferarum
inmiti.

    var whois = gibibyte;
    if (blacklist + multimedia + cdma_management) {
        blog(ebookLinkMatrix, simm);
    }
    var read_ping_word = tunnelingWord.sampleSoftwareOspf(89 +
            serial.ircPinterestBittorrent(json));

## Tollens vulnere bracchia

Ripam aut hoc clauditur senemque parat, et est tempora telae, sit ferat
**laborem veluti** in nitidumque. Fugam semper maiora; arte hostes et sacerdotis
factoque discordibus atque causa nodis tenet Achilles solvit omnis fluctus.`,
  new Date(Date.UTC(2019, 3, 18))
)

const database: Database = {
  [comment1.id]: comment1,
  [comment2.id]: comment2,
  [comment3.id]: comment3,
}

export const CommentInMemory = (): CommentRepository => {
  return {
    persist: comment => {
      database[comment.id] = comment

      return Promise.resolve(comment)
    },
    findBySpotId: spotId =>
      Promise.resolve(
        Object.values(database)
          .filter(comment => comment.spotId === spotId)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      ),
  }
}
