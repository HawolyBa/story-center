export const capitalize = (str) => {
  return str
      .toLowerCase()
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.substr(1))
      .join(' ');
}


export const onlyUnique = (value, index, self) => { 
  return self.indexOf(value) === index;
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const occurences = arr => {

  let counts = arr.reduce((a, b) => {
    a[b] = (a[b] || 0) + 1;
    return a;
  }, {});

  let tab = []
  for (let key in counts) {
    tab.push({tag: key, times: counts[key]})
  }
  
  return tab
}

export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

export const sortAlpha = arr => {
  arr.sort(function(a, b){
    var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
    if (nameA < nameB) //sort string ascending
     return -1;
    if (nameA > nameB)
     return 1;
    return 0; //default return value (no sorting)
   });
   return arr
}

export const deleteSpaces = str => {
  return str.replace(/\s/g,'');
}