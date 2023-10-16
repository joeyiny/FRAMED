const DISPLAY_NAME = 'displayName';

// Generate random name 
const generateDisplayName = () => {
    const adjectives = [
      'Water', 'Saucy', 'Lil', 'Yummy', 'Spicy', 'Chilly', 'Silly', 'Ice', 'Honey', 'Captain', 'Zesty', 'Toasty'
    ];
    const nouns = [
      'Fren', 'Boi', 'Cake', 'Dude', 'Spice', 'Fella', 'Beast', 'Tomato', 'Pickle', 'Bud', 'Bean', 'Muffin'
    ];
  
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
    return `${randomAdjective} ${randomNoun}`;
  };

// Stores in local storage.
const setDisplayNameInLocalStorage = (id: string) => {
  localStorage.setItem(DISPLAY_NAME, id);
};

// Retrieves from local storage.
const getDisplayNameFromLocalStorage = (): string | null => {
  return localStorage.getItem(DISPLAY_NAME);
};

// Generates a username if there isn't one already
const ensureDisplayName = (): string => {
  let attendeeID = getDisplayNameFromLocalStorage();
  if (!attendeeID) {
    attendeeID = generateDisplayName();
    setDisplayNameInLocalStorage(attendeeID);
  }
  return attendeeID;
};

export {
  ensureDisplayName,
  getDisplayNameFromLocalStorage,
  setDisplayNameInLocalStorage
};
