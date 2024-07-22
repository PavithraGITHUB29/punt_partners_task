// app.js
const fonts = {
  "Roboto": {
    "variants": ["400", "400italic", "700", "700italic"],
    "urls": {
      "400": "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
      "400italic": "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,400&display=swap",
      "700": "https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap",
      "700italic": "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,700;1,700&display=swap"
    }
  },
  "Open Sans": {
    "variants": ["400", "400italic", "600", "600italic"],
    "urls": {
      "400": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap",
      "400italic": "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;1,400&display=swap",
      "600": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap",
      "600italic": "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,600;1,600&display=swap"
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const fontFamilySelector = document.getElementById('fontFamilySelector');
  const fontWeightSelector = document.getElementById('fontWeightSelector');
  const italicToggle = document.getElementById('italicToggle');
  const textEditor = document.getElementById('textEditor');
  const setButton = document.getElementById('setButton');
  const resetButton = document.getElementById('resetButton');

  // Default settings
  const defaultSettings = {
    text: '',
    fontFamily: 'Roboto',
    fontWeight: '400',
    isItalic: false
  };

  // Load saved settings
  const savedText = localStorage.getItem('text') || defaultSettings.text;
  const savedFontFamily = localStorage.getItem('fontFamily') || defaultSettings.fontFamily;
  const savedFontWeight = localStorage.getItem('fontWeight') || defaultSettings.fontWeight;
  const savedIsItalic = localStorage.getItem('isItalic') === 'true' || defaultSettings.isItalic;

  textEditor.value = savedText;
  italicToggle.checked = savedIsItalic;

  // Populate font family selector
  Object.keys(fonts).forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    fontFamilySelector.appendChild(option);
  });

  fontFamilySelector.value = savedFontFamily;
  updateFontWeights(savedFontFamily, savedFontWeight, savedIsItalic);

  // Event listeners
  fontFamilySelector.addEventListener('change', () => {
    const selectedFontFamily = fontFamilySelector.value;
    updateFontWeights(selectedFontFamily);
  });

  fontWeightSelector.addEventListener('change', () => {
    updateFontStyle();
  });

  italicToggle.addEventListener('change', () => {
    updateFontStyle();
  });

  setButton.addEventListener('click', () => {
    updateFontStyle();
    saveSettings();
  });

  resetButton.addEventListener('click', () => {
    resetToDefault();
  });

  textEditor.addEventListener('input', () => {
    localStorage.setItem('text', textEditor.value);
  });

  function updateFontWeights(fontFamily, selectedWeight = null, isItalic = false) {
    fontWeightSelector.innerHTML = '';

    const weights = fonts[fontFamily].variants.filter(v => !v.includes('italic'));
    weights.forEach(weight => {
      const option = document.createElement('option');
      option.value = weight;
      option.textContent = weight;
      fontWeightSelector.appendChild(option);
    });

    const closestVariant = findClosestVariant(fontFamily, selectedWeight || '400', isItalic);
    fontWeightSelector.value = closestVariant.replace('italic', '');
    italicToggle.disabled = !fonts[fontFamily].variants.includes(`${fontWeightSelector.value}italic`);
    italicToggle.checked = closestVariant.includes('italic');

    updateFontStyle();
  }

  function findClosestVariant(fontFamily, weight, isItalic) {
    const variants = fonts[fontFamily].variants;
    const target = `${weight}${isItalic ? 'italic' : ''}`;

    if (variants.includes(target)) {
      return target;
    }

    if (isItalic) {
      const italicVariants = variants.filter(v => v.includes('italic'));
      if (italicVariants.length > 0) {
        return italicVariants.reduce((prev, curr) => {
          const prevWeight = parseInt(prev.replace('italic', ''));
          const currWeight = parseInt(curr.replace('italic', ''));
          return Math.abs(currWeight - weight) < Math.abs(prevWeight - weight) ? curr : prev;
        });
      }
    }

    return variants.reduce((prev, curr) => {
      const prevWeight = parseInt(prev.replace('italic', ''));
      const currWeight = parseInt(curr.replace('italic', ''));
      return Math.abs(currWeight - weight) < Math.abs(prevWeight - weight) ? curr : prev;
    });
  }

  function updateFontStyle() {
    const fontFamily = fontFamilySelector.value;
    const fontWeight = fontWeightSelector.value;
    const isItalic = italicToggle.checked;
    const variant = `${fontWeight}${isItalic ? 'italic' : ''}`;
    const fontUrl = fonts[fontFamily].urls[variant];

    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    textEditor.style.fontFamily = fontFamily;
    textEditor.style.fontWeight = fontWeight;
    textEditor.style.fontStyle = isItalic ? 'italic' : 'normal';

    setTimeout(() => {
      document.head.removeChild(link);
    }, 1000);
  }

  function resetToDefault() {
    textEditor.value = defaultSettings.text;
    fontFamilySelector.value = defaultSettings.fontFamily;
    updateFontWeights(defaultSettings.fontFamily, defaultSettings.fontWeight, defaultSettings.isItalic);
    italicToggle.checked = defaultSettings.isItalic;
    saveSettings();
  }

  function saveSettings() {
    localStorage.setItem('text', textEditor.value);
    localStorage.setItem('fontFamily', fontFamilySelector.value);
    localStorage.setItem('fontWeight', fontWeightSelector.value);
    localStorage.setItem('isItalic', italicToggle.checked);
  }
});
