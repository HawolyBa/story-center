export const tagsTimes = (popularTags) => {
  let counts = popularTags.reduce((a, b) => {
    a[b] = (a[b] || 0) + 1;
    return a;
  }, {});

  let tab = []
  for (let key in counts) {
    tab.push({tag: key, times: counts[key]})
  }

  tab = tab.sort((a, b) => b.times - a.times)
  return tab
}

export const getAllFromCollection = (getFirestore, collection) => {
  return getFirestore()
    .collection(collection)
    .get()
}

export const getOneFromCollection = (getFirestore, collection, id) => {
  return getFirestore()
    .collection(collection)
    .doc(id)
    .get()
}

export const onlyUnique = (value, index, self) => { 
  return self.indexOf(value) === index;
}

export const getAllChapters = (getFirestore, id) => {
  return getFirestore()
    .collection('stories')
    .doc(id)
    .collection('chapters')
    .get()
}

export const getDataFormSnapshot = (snapshot, type, dispatch) => {
  let data = []
  snapshot.docs.forEach(doc => {
    data = [...data, { ...doc.data(), id: doc.id }]
  })

  return data
}

export const getSubCollection = (getFirestore, parentCollection, collection, id) => {
  return getFirestore()
     .collection(parentCollection)
     .doc(id)
     .collection(collection)
     .get()
 }

export const getOneChapter = (getFirestore, storyId, chapid) => {
  return getFirestore().collection('stories')
    .doc(storyId)
    .collection('chapters')
    .doc(chapid)
    .get()
}

export const uniqueElements = arr => [...new Set(arr)]

export const uniqueElementsBy = (arr, fn) =>
arr.reduce((acc, v) => {
  if (!acc.some(x => fn(v, x))) acc.push(v);
  return acc;
}, []);

export const addToFavoriteHelper = async (userQuery, favArray, id, getFirestore, userId, collection) => {
  let newArray = userQuery.data()[favArray]
  newArray.push(!newArray.includes(id) ? id: null)
  await getFirestore().collection('users').doc(userId).update({
    [favArray]: newArray
  })
  const query = await getOneFromCollection(getFirestore, collection, id)
  
  const likedBy = query.data().likedBy
  if (likedBy.indexOf(userId) === -1) {
    await getFirestore().collection(collection).doc(id).update({ likedBy: [...likedBy, userId] })
  }
}


export const removeFromFavorite = async (userQuery, favArray, id, getFirestore, userId, collection) => {
  let newArray = userQuery.data()[favArray]
  const index = newArray.indexOf(id)
  newArray.splice(index, 1)
  await getFirestore().collection('users').doc(userId).update({ [favArray]: newArray })
  const query = await getOneFromCollection(getFirestore, collection, id)
  newArray = query.data().likedBy ? query.data().likedBy: []
  newArray.splice(userId, 1)
  getFirestore().collection(collection).doc(id).update({ likedBy: newArray })
}

export const findifFavorite = (query, favArray, id) => {
  return query.data()[favArray].includes(id)
}

export const reduceCharactersByStories = data => {
  const result = data.reduce((acc, d) => {
    const found = acc.find(a => a.id === d.id);

    const value = d.characters

    if (!found) {
      acc.push({id: d.id, characters: value})
    }
    else {
      found.characters.push(value)
    }
    return acc;
  }, []);

  return result
}

export const reduceLocByStories = data => {
  const result = data.reduce((acc, d) => {
    const found = acc.find(a => a.id === d.id);

    const value = d.locations

    if (!found) {
      acc.push({ id: d.id, locations: value })
    }
    else {
      found.locations.push(value)
    }
    return acc;
  }, []);

  return result
}

export const reduceChaptersNote = data => {
  const result = data.reduce((acc, d) => {
    const found = acc.find(a => a.storyId === d.storyId);

    const value = d.note
    if (!found) {
      acc.push({storyId:d.storyId, note: [value]})
    }
    else {
      found.note.push(value)
    }
    return acc;
  }, []);

  return result
}

export const reduceLocationsByStories = data => {
  const result = data.reduce((acc, d) => {
    const found = acc.find(a => a.storyId === d.storyId);

    const value = {
      id: d.id,
      image: d.image,
      name: d.name,
      description: d.description,
      storyTitle: d.storyTitle
    }
    if (!found) {
      acc.push({storyId:d.storyId, locations: [value]})
    }
    else {
      found.note && found.note.push(value)
    }
    return acc;
  }, []);

  return result
}

export const reduceChapters = data => {
  const result = data.reduce((acc, d) => {
    const found = acc.find(a => a.storyId === d.storyId);

    const value = { id: d.id, title: d.title };
    if (!found) {
      acc.push({storyId:d.storyId, chapters: [value]})
    }
    else {
      found.chapters.push(value)
    }
    return acc;
  }, []);

  return result
}