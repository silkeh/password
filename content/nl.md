---
title: Nederlandstalige wachtwoordgenerator
lang: nl
language: Nederlands
licence: Licentie
text:
  generate: Genereer
  list: Lijst
  words: Woorden
  licenced: In licentie gegeven krachtens de
  description: |
    Dit is een willekeurig, gegenereerd wachtwoord uit een lijst van <span class="wordCount"></span>&nbsp;woorden.
    Het wachtwoord heeft een entropie van <span class="entropyBits"></span>&nbsp;bits,
    waardoor het ongeveer <span class="entropyYears"></span>&nbsp;kost om het wachtwoord te kraken met
    <span class="hashSpeed"></span>&nbsp;miljoen pogingen per seconde.
  error: |
    Er is iets misgegaan bij het laden van de pagina.
---

## Wat doet dit?
Deze wachtwoordgenerator genereert een veilig en goed te onthouden wachtwoord volgens de uitleg van [XKCD 936][xkcd].
Het gebruik van willekeurige woorden zorgt voor wachtwoorden die beter te onthouden zijn,
terwijl het wachtwoord nog steeds moeilijk te kraken is.

Het wachtwoord wordt veilig door jouw browser gegenereerd,
waardoor het wachtwoord de browser nooit verlaat.

## Waarvoor kan ik dit wachtwoord gebruiken?
Dit wachtwoord is geschikt voor wachtwoorden die *uniek* en *goed te onthouden* moeten zijn.
Het wachtwoord is echter slechter dan een lang volledig willekeurig wachtwoord.
Gebruik daarom altijd een wachtwoordmanager zoals [KeePassX][], [LastPass][] of [1Password][] om volledig willekeurige wachtwoorden te genereren en op te slaan.

## Bronnen
Woordenlijsten:

  - Meest voorkomende woorden: Gegenereerd aan de hand van artikelen van [De Correspondent][corr].
    Licentie: publiek domein ([CC0 1.0][cc0-1.0]).
  - Complete Woordenlijst: [OpenTaal][].
    Licentie: [Creative Commons, Naamsvermelding 3.0 (unported)][cc-by-3.0]
    *of*
    [BSD (herziene versie)][bsd-2-clause].
  - Diceware: Gegenereerd met [DiceWords][] van [Remko Tronçon][diceware].
    Licentie: [MIT][mit].

[xkcd]: https://xkcd.com/936
[corr]: https://decorrespondent.nl
[opentaal]: http://www.opentaal.org/bestanden/doc_download/20-woordenlijst-v-210g-voor-openofficeorg-3
[dicewords]: https://github.com/remko/dicewords/
[diceware]: https://el-tramo.be/blog/diceware-nl/
[keepassx]: https://www.keepassx.org/
[lastpass]: https://www.lastpass.com/nl/
[1password]: https://1password.com/
[cc0-1.0]: http://creativecommons.org/publicdomain/zero/1.0/
[cc-by-3.0]: http://creativecommons.org/licenses/by/3.0/legalcode
[bsd-2-clause]: https://opensource.org/licenses/BSD-2-Clause
[mit]: https://opensource.org/licenses/MIT
