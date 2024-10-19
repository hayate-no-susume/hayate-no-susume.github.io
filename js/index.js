// Encodes special characters in the input string.
const encodeSpecialCharacters = (input) =>
  encodeURIComponent(input).replace(/\(/g, "%28").replace(/\)/g, "%29");

// Smoothly scrolls to an element specified by its ID, accounting for an offset.
const scrollToElement = (elementId, offset) => {
  const element = document.getElementById(elementId);
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: elementPosition - offset,
    behavior: "smooth"
  });
};

// Appends a specific suffix to a name to generate a title.
const generateTitle = (name) => {
  const suffix = name.endsWith(")") ? " のすすめ" : "のすすめ";
  return `${name}${suffix}`;
};

// Updates the main page's share link with a new URL and title.
const updateMainpageShareLink = () => {
  const shareMainpageContainer = document.getElementById("shareMainpageContainer");

  shareMainpageContainer.innerHTML = createShareLink(BASE_URL, BASE_TITLE);
  twttr.widgets.load(shareMainpageContainer);
  shareMainpageContainer.innerHTML += "サイトの共有"; // Added translation for clarity
};

// Updates the character share link and map based on the selected character.
const updateCharacterShareLinkAndMap = () => {
  const characterSelect = document.getElementById("characterSelect");
  const selectedCharacterValue = characterSelect.value;
  const selectedCharacterName = characterSelect.options[characterSelect.selectedIndex].text;

  updateCharacterShareLink(selectedCharacterValue, selectedCharacterName); // Update the character share link.
  updateCharacterMap(selectedCharacterValue); // Update the character map.
};

// Updates the share link with the character's name, generating a new URL and title.
const updateCharacterShareLink = (characterValue, characterName) => {
  const shareCharacterContainer = document.getElementById("shareCharacterContainer");
  const dataUrl = `${BASE_URL}?c=${encodeSpecialCharacters(characterName)}`;
  const dataText = generateTitle(characterName);

  if (characterValue != 0) {
    shareCharacterContainer.innerHTML = createShareLink(dataUrl, dataText);
    twttr.widgets.load(shareCharacterContainer);
    shareCharacterContainer.innerHTML += `${characterName}${characterName.endsWith(")") ? " " : ""}の共有`;
  } else {
    shareCharacterContainer.innerHTML = "";
  }
};

// Updates the character map image source based on the selected character value.
const updateCharacterMap = (characterValue) => {
  const characterMapObject = document.getElementById("characterMapObject");
  const newImageSrc = `images/character-${characterValue}.svg`;
  const tempImage = new Image();

  tempImage.onload = () => {
    characterMapObject.setAttribute("data", newImageSrc);
  };

  tempImage.src = newImageSrc;
};

// Generates the HTML for a Twitter share link with the specified URL and text.
const createShareLink = (url, text) =>
  `<a href="https://twitter.com/share?ref_src=twsrc%5Etfw"
    class="twitter-share-button"
    data-show-count="false"
    data-url="${url}"
    data-text="${text}"
    data-lang="en">
    Tweet
  </a>
  <br>`;

// Initializes the page on window load.
window.addEventListener("load", function() {
  // Get URL parameters and target the character selection dropdown
  const urlParams = new URLSearchParams(window.location.search);
  const characterSelect = document.getElementById("characterSelect");

  // Retrieve the character name from URL parameters, if provided
  const characterNameFromUrl = urlParams.get("c");
  const characterIndex = CHARACTER_NAMES.indexOf(characterNameFromUrl);

  // If the character name is valid, update the page title and scroll to a specific element
  if (characterIndex !== -1) {
    document.title = generateTitle(characterNameFromUrl);
    characterSelect.options[characterIndex + 1].selected = true;
    scrollToElement("characterMapTitle", 15);
  }

  // Set the selected option in the character dropdown and update the share link and map
  updateMainpageShareLink();
  updateCharacterShareLinkAndMap();
});
