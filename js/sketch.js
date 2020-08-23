let sel;
let fromKey = 'G'
let toKey = 'Ab'

let lyrics;

function preload() {
  lyrics = loadStrings('assets/shallow.txt');
}

function isChordLine(line) {
  let nr = 0
  for (let c of line) {
    if (c == ' ' || c == "|") {
      nr += 1
    }
  }

  let frac = nr / line.length
  return (frac > 0.4 && frac <= 0.99)

  // regular lines have around 20% spaces
  // lines with chord above text around 80%
  // separate lines with only chords around 40

}

function changeTranspose() {
  toKey = sel.value();
  updateLyrics()
}

function updateLyrics() {
  let d = select('#lyrics').html('')

  // const lines = lyrics.split('\n')
  for (let line of lyrics) {

    if (isChordLine(line)) {

      let arr = []
      let spaces = 0

      let word = ""
      for (let pos = 0; pos < line.length; pos++) {



        if (line[pos] === " ") { //space
          if (word !== "") { //last one was word

            arr.push({
              type: "chord",
              chord: word,
            })

            word = ""
          }

          spaces += 1

        } else if (line[pos] === "|") {

          if (word !== "") { //last one was word

            arr.push({
              type: "chord",
              chord: word,
            })

            word = ""
          }

          if (spaces !== 0) {
            arr.push({
              type: "whitespace",
              count: spaces
            })
            spaces = 0
          }
          arr.push({
            type: "other",
            text: "|"
          })
        } else {
          // new word?
          if (word === "") {
            arr.push({
              type: "whitespace",
              count: spaces
            })
            spaces = 0
          }

          // append word (chord)
          word += line[pos]
        }
      }
      printChords(fromKey, toKey, arr)
    } else {

      // d = select('#lyrics');
      d.child(createElement('pre', line))
    }

  }
}


function printChords(fromkey, tokey, arr) {
  print(arr)
  let d = select('#lyrics');
  let line_elm
  d.child(line_elm = createElement('span'))
  line_elm.class('lyrics_line')

  let s = ' '.repeat(200)

  for (let c of arr) {
    if (c.type === 'chord') {
      chord = transposeChord(fromkey, tokey, c.chord)
      line_elm.child(elm = createElement('span', chord))
      elm.class('chord')
      // s = s.replaceAt(c.pos, chord)
    } else if (c.type === 'whitespace') {
      line_elm.child(elm = createElement('span', " ".repeat(c.count)))
      elm.class('whitespace')
    } else {
      line_elm.child(elm = createElement('span', "|"))
      // elm.class('whitespace')
    }
  }

  s = s.rtrim(' ')


}

function setup() {


  // fill combo box
  let arr = []
  for (k of sharpkeys) {
    arr.push(k.firstCharToUpper())
  }

  for (k of flatkeys) {
    if (k !== 'c') {
      arr.push(k.firstCharToUpper())
    }
  }

  // sort

  combodiv = select("#combo")
  combodiv.child(sel = createSelect())
  sel.class('form-control');

  for (k of arr) {
    sel.option(`${k}`)

  }

  sel.selected(toKey);
  sel.changed(changeTranspose);

  // write lyrics
  updateLyrics()


}