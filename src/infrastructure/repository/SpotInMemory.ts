import { SpotRepository } from '../../domain/repository'
import { Spot, Location } from '../../domain/model'

interface Database {
  [key: string]: Spot
}

const parkRobinson = new Spot(
  'spot-1',
  'Parc Robinson',
  `
# Magna non nido semper

## Tenet dis o adsueta stratum primordia fuere

Lorem markdownum pondere circumfluus Venus cacumina ipso circumspexit magis. Est
esse; in pater forsitan. Augur visus et habuit miserere sanguine nubes; insidias
positoris. In perdere *miscuit* non cantat numen hic dedere in carinas remis
merguntque brevis viribus.

Temptamina ore ostia patrio inque petisses ferit, moenia intrat honoris
patentibus nivea Phoebus *coniugium* superbos incandescit. Anima serpens narrat
et violenta frontem florem. Vetuere quas, Idaeumque mortales nulli proximus in
care sive est sceleris vitta.

## Tamen quae

Concipit *blanditiae deiecto* ab poenas, crura meminere, iam bracchiaque equorum
munera rigescere sanguis. Mira *visus sequar* putes media sidera; illa eo eodem,
Iovi quo **bibisset** haerentem! Ista tamen vulnus factaque suco manus robur ad
graves possem? **Clausit** petentem Elpenora et praesentior multum!

1. Cornua lupi pectore sinus iunctura intravit totiens
2. Pervenit dedere medium recludam undique tutus et
3. Talia oris damnosa publica umerum
4. Tibi insultavere lacerum fusum
5. Pius venires

Ille dubito tenebant moverent *omnibus simulatoremque imperium* cum remos
pariter. Me partem volventia; aquarum os profundo aliquem? Exempla missa ego
Minos foramen, sit latratu spoliis aequantibus quantum longum tridentigero neci
cum [defessa heres](http://succincta.com/) iniqua. Casu *suis animaeque* forma
vincirem, ut vitiato et corpus: vivit pice; postquam ut omnes plus.

Vellem Syenites scilicet. In nec tenentem qua totaque qualia umerus foedumque,
omnes [regnum](http://imaginelibratum.com/obvius.html) certior vulnera.  
  `,
  {
    latitude: 48.909018,
    longitude: 2.2930765,
  },
  'user-id-1'
)
const skateparkCoubevoie = new Spot(
  'spot-2',
  'Skatepark de Courbevoie',
  null,
  {
    latitude: 48.9017561,
    longitude: 2.235201,
  },
  'user-id-1'
)
const espaceGlisseParis = new Spot(
  'spot-3',
  'Espace Glisse Paris 18',
  `
# Luxit sollicitare viderat ipse

## Spumisque Erycis pulvere

Lorem markdownum permulcet Iphide et acervos fulvum. Rerumque stipe caerula,
spectans nemorisque **tamen huc** Teucras traxerunt misit et libido vicinia;
conbibit at.

Ullam et aere qua humum ante interea, ut sequentes adspice matris Diomede terras
discedere, bubus aequus, agiturque. Rursus ima in
[praesagia](http://teucras.com/), tumulo caput, lignoque; ferrumque exeat
dimittere, ulla torsit mortisque. Oculos summo mihi stirpe, truncis tetigit
dimittit se fonte que meroque. Illa altera [passis
quas](http://tum-coroneus.net/absciditmaerens) praebuerat nomen, sum spoliare
pulveris.

## Et diversa lenta tenerum iurasse calido

Iam vigil eripitur numquam poenas mixtaque reddere perosus gutture quoque. Qua
patulis Nostra, odium non sollertia parere creverat, in in redolentia oravique
moneo, et ulmi quid luctus. Reluxit **verba**!

## Parvum hanc quos

Terrarum ecce remisit auras se factis in tollit clausit urbes prohibebant
brevis, solum cui, noverca. Habent ignobilitate voce debueram utrum ducis
efferor recentibus vulgusque diva spectatosque fieri dexteriore fallat. Gravi
nato quod *Minos esse caeno* dictis ignibus culpae detrahat, peragat sol? Nec
proelia numina fecerit liquescunt ferro, [advolat forte](http://pyramus.io/),
pars. Regimen vobis; vel faciem *ille*, male nunc penetravit tegat.

Herculeis omni; satis quid terrae flumina cruor levis vultuque inplevitque quis
reginam intumuit? Hic cretus [Orithyian](http://secum-flatuque.com/spem)
iuventa, cur aut [quae](http://spectantia-et.org/) Ioles ulla exhalantes frater
strepitum montis. Cernere carpitur et sine misit novus, summae ore cursu laterum
super instruis geruntur date stultos. Est mirae occupat aestusque aeternamque
[se illic](http://maenalon.io/lumen-pirithoi) non harenae variatus nuper agro
loquendo iam, constitit Argolica.

Mixtos mihi dedantur in bracchia Euippe usus potest pontus, et. Non illi, mihi
exstantem est. Fuit Aegea laevum solis acta [Andros sit
in](http://www.quidem.io/referebat) premunt, adparuit iterum parte. Tu vitta
admotam: [obstantia fovesque](http://quaerunt.net/ergo). Et et est colubras,
dextra et non et Laestrygonis locorum posse se relinquet cedere!
  `,
  {
    latitude: 48.899555,
    longitude: 2.3630618,
  },
  'user-id-2'
)
const skateparkBourse = new Spot(
  'spot-4',
  'Skate Park Léon Cladel',
  null,
  {
    latitude: 48.8685633,
    longitude: 2.3417836,
  },
  'user-id-1'
)

const database: Database = {
  [parkRobinson.id]: parkRobinson,
  [skateparkCoubevoie.id]: skateparkCoubevoie,
  [espaceGlisseParis.id]: espaceGlisseParis,
  [skateparkBourse.id]: skateparkBourse,
}

const degreesToRadians = (value: number): number => (value * Math.PI) / 180

const getDistance = (p1: Location, p2: Location) =>
  p1.latitude === p2.latitude && p1.longitude === p2.longitude
    ? 0
    : Math.acos(
        Math.cos(degreesToRadians(p1.latitude)) *
          Math.cos(degreesToRadians(p2.latitude)) *
          Math.cos(
            degreesToRadians(p1.longitude) - degreesToRadians(p2.longitude)
          ) +
          Math.sin(degreesToRadians(p1.latitude)) *
            Math.sin(degreesToRadians(p2.latitude))
      ) * 6371

export const SpotInMemory = (): SpotRepository => {
  return {
    persist: spot => {
      database[spot.id] = spot

      return Promise.resolve(spot)
    },

    findByLocation: (latitude, longitude, radius) => {
      console.log('Finding spots for center:', { latitude, longitude })
      const matchingSpots = Object.values(database)
        .filter(({ location, name }) => {
          const distance = getDistance({ latitude, longitude }, location)
          console.group('Spot')
          console.log('Name:', name)
          console.log('Location:', location)
          console.log('Distance:', distance)
          console.groupEnd()

          return distance <= radius
        })
        .sort((a, b) => {
          const aDistance = getDistance({ latitude, longitude }, a.location)
          const bDistance = getDistance({ latitude, longitude }, b.location)

          return aDistance - bDistance
        })

      return Promise.resolve(matchingSpots)
    },

    findById: id => {
      const spot = database[id] || null

      return Promise.resolve(spot)
    },
  }
}
