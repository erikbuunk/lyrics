const sharpkeys = ["c", "g", "d", "a", "e", "b", "f#", "c#"]
const flatkeys = ["c", "f", "bb", "eb", "ab", "db", "gb", "cb"]

const sharpOrder = ["", "f", "c", "g", "d", "a", "e", "b"]
const flatOrder = ["", "b", "e", "a", "d", "g", "c", "f"]



// chord parser
// Cm7/Bb => {root: "C", type : "m7", bass: "Bb"}
// {root: "Ab", type : "m7b5", bass: "Bb"}
function chordParser(chord) {
  let n = chord.indexOf("/");

  if (n >= 0) {
    bass = chord.substring(n + 1)
  } else {
    n = chord.length
    bass = ""
  }

  let root = chord[0]
  if (chord[1] === 'b' || chord[1] === "#") {
    root += chord[1]
    type = chord.substring(2, n)
  } else {
    type = chord.substring(1, n)
  }
  return {
    root: root,
    type: type,
    bass: bass
  }

}


//   "97": "a",     "98": "b",     "99": "c",     "100": "d",    
// "101": "e",    "102": "f",    "103": "g", 


// returns the notes of the scale in the major key
function getKeyNotes(key) {

  let notes = []
  let start = key.toLowerCase().charCodeAt(0)
  for (let i = 0; i < 7; i++) {
    nr = start + i
    if (nr > 103) {
      nr = nr - 7
    }
    notes.push(String.fromCharCode(nr))
  }
  
  let sk = sharpkeys.indexOf(key)
  if(sk>=0) { // return 2
    
    for (let i = 1; i <= sk; i++) {
      notes[notes.indexOf(sharpOrder[i])] = sharpOrder[i] + "#"
    }
  }
  
  let fk = flatkeys.indexOf(key)
  if(fk >= 0) {
      for (let i = 1; i <= fk; i++) {
        notes[notes.indexOf(flatOrder[i])] = flatOrder[i] + "b"
    }
  }

  return notes;
}

// returns the degree (number) in the scale of the given note
// 2 for d in c scale
function noteNrInKey(key, note) {
  notes = getKeyNotes(key)
  
  degree = notes.indexOf(note.toLowerCase())
  
  return degree;
}

//Todo: als note niet gevonden alternatief zoeken.
function transpose (fromkey, tokey, note) {
  
  degree = noteNrInKey(fromkey.toLowerCase(), note.toLowerCase())
  
  if(degree>=0) {
   return getKeyNotes(tokey.toLowerCase())[degree];
  } else {
    // return "<Unkown>"
    // TODO find alternative
    // find base note (no #, b)
    let base_note = note[0]
    // print(base_note)
    
    for(let n of notes) {
      // find degree of base note in from_key 
      
      if (n[0] === base_note) {
        
        
        // get transposition of keynote.
        
        altNote = getAlteration(note)
        
        
        
        // get transposition of note (original key)
        altSource = getAlteration(n)            
        
        
        // get difference
        let dif = altNote - altSource
        
        // find degree in to_key
        degree = noteNrInKey(fromkey.toLowerCase(), n.toLowerCase())
        
        new_note = getKeyNotes(tokey)[degree]
        
    // get transposition in new key
            // add difference
    // return result

        return new_note[0] + returnAlteration(getAlteration(new_note) + dif)
      
      }
    }
    
    

    

  }
  
}

function getAlteration(note) {
  if(note.length === 1) {
    return 0
  }
  
  let tr = note[1]
  if (tr === '$') return -2
  if (tr === 'b') return -1
  if (tr === '#') return 1
  if (tr === 'x') return +2
  
  return -99
  
}
  

function returnAlteration(incr) {
 
  if (incr == 0) return ''
  if (incr === -2) return '$'
  if (incr === -1) return 'b'
  if (incr === +1) return '#'
  if (incr === +2) return 'x'
  
  return -99
  
}

function noteToUpper(note) {
  return note[0].toUpperCase() + note.substring(1)
}

function transposeChord(from_key, to_key, chord_text) {

  if(chord_text[0] === '|') {
     return chord_text
  }

  
  chord  = chordParser(chord_text)
  
  new_chord = transpose(from_key, to_key, chord.root.toLowerCase())
  new_chord =  noteToUpper(new_chord)+ chord.type
  
  
  // TODO: transpose. bass note
  if(chord.bass!=="") {
    new_chord = new_chord + "/" + noteToUpper(transpose(from_key, to_key,  chord.bass))
  }
  
  return new_chord;
}
