/**
 * Copyright 2016 - Silke Hofstra
 *
 * Licensed under the EUPL, Version 1.1 or -- as soon they will be approved by
 * the European Commission -- subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

const indexFile = "../index.json";
const listDir = "../lists/";
const language = document.querySelector("html").getAttribute("lang");
const defaultLength = 4;
const hashSpeed = 5; // In 10^6 attempts/second
const list = document.getElementById("list");
const passwordLength = document.getElementById("password-length");

// Password list
let passwords = [];
let defaultList = "";

// Password settings
const defaultPasswordSettings   = { joinChar: " ", lowerCase: true };
const shortListPasswordSettings = { joinChar: "", lowerCase: false };

// Time units
const secondsHour = 3600;
const secondsDay = 86400;
const secondsYear = 31558149.54; // Seconds in a sidereal year
let units = {
    "hour": "× " + secondsHour + " s",
    "day": "× " + secondsDay + " s",
    "year": "× " + secondsYear + " s",
    "eternity": "∞ s"
};

// Set the inner HTML for an element
function setHTML(selector, html) {
    "use strict";

    let list = document.querySelectorAll(selector);
    for (let e of list) {
        e.innerHTML = html;
    }
}

// Format time to a human readable format.
function formatTime(time) {
    "use strict";

    let text = "";
    if (time >= 0 && time < 2 * secondsDay) {
        text = Math.round(time / secondsHour) + " " + units.hour;
    } else if (time < 2 * secondsYear) {
        text = Math.round(time / secondsDay) + " " + units.day;
    } else if (time < secondsYear * Math.pow(10, 9)) {
        text = Math.round(time / secondsYear) + " " + units.year;
    } else {
        text = units.eternity;
    }

    return text;
}


// Get settings from the location hash
function parseLocationHash() {
    "use strict";
    const hash = window.location.hash.substring(1).split(";");
    return {
        list: hash[0],
        length: Number(hash[1])
    };
}

// Update the window location hash
function updateLocationHash() {
    "use strict";
    if (window.location.hash ||
        list.value !== defaultList ||
        Number(passwordLength.value) !== defaultLength)
    {
        window.location.hash = "#" + list.value + ";" + passwordLength.value;
        document.querySelector("a.generate.button").href = window.location.hash;
    }
}

// Generate a random password from the loaded list
function generatePassword(length, lowerCase) {
    "use strict";

    // Array for password generation
    const random = new Uint32Array(passwordLength.value);
    let gen = [];

    // Fill the array with random values
    window.crypto.getRandomValues(random);

    for (let n of random) {
        // Get random word from list
        let w = passwords[Math.floor(passwords.length * n / Math.pow(2, 32))];

        // Transform to lower case if required
        if (lowerCase) {
            w = w.toLowerCase();
        }

        // Push word into array
        gen.push(w);
    }

    return gen;
}

// Generate a password from the loaded list and show it.
function generate() {
    "use strict";

    // Required password passwordLength
    let minLength = passwordLength.value * Math.log(passwords.length) / Math.log(26);
    let settings  = defaultPasswordSettings;

    // Small lists have different behaviour
    if (passwords.length < 1000 || passwords[0] === "😀") {
        minLength = 0;
        settings  = shortListPasswordSettings;
    }

    // Generate a random password
    const gen = generatePassword(passwordLength.value, settings.lowerCase);

    // Check if the password has as much entropy as the individual letters
    if (gen.join("").length >= minLength) {
        // Display the password
        setHTML("h1#password", gen.join(settings.joinChar));
    } else {
        // Try again
        console.log(
            "Not enough entropy, " + minLength + " characters required: " +
            gen.join(settings.joinChar)
        );
        generate();
    }
}

// Update the password settings and change the values of the texts
function update() {
    "use strict";

    const space = Math.pow(passwords.length, passwordLength.value);
    const bits = Math.log(space) / Math.log(2);
    const time = space / 2 / hashSpeed / Math.pow(10, 6);

    // Show the results in the text
    setHTML(".wordCount", passwords.length);
    setHTML(".entropyBits", Math.round(bits));
    setHTML(".entropyYears", formatTime(time));
    setHTML(".hashSpeed", hashSpeed);

    // Update the URL hash
    updateLocationHash();

    // Generate a new password
    generate();
}

// Load a password list
function loadPasswords(list) {
    "use strict";
    fetch(listDir + list + ".json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Save list
            passwords = data;

            // Update the password
            update();
        });
}

// Append a list to the dictionary list
function appendList(name, data) {
    "use strict";
    let list = document.getElementById("list");

    // Add description option
    let option = new Option(data._description);
    option.disabled = true;
    list.add(option);

    // Add other options
    for (let l in data) {
        if (data.hasOwnProperty(l) && l.substring(0, 1) !== "_") {
            list.add(new Option(data[l], name + "/" + l));
        }
    }
}

// Load the initial password lists
function init() {
    "use strict";

    // Set callbacks for list/passwordLength changes
    list.onchange = () => {
        loadPasswords(list.value);
    };
    passwordLength.onchange = () => {
        update();
    };

    // Load the index
    fetch(indexFile)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Add the lists for the language to the menu
            let lists = data[language].lists;
            for (let name in lists) {
                if (name.substring(0,1) !== '_') {
                    appendList(name, lists[name]);
                }
            }

            // Save units
            units = data[language].units;

            return lists;
        })
        .then((lists) => {
            // Set list and passwordLength to defaults
            defaultList = language + "/" + lists._default;
            let conf = {list: defaultList, length: defaultLength};

            // Override list/passwordLength from location
            if (window.location.hash) {
                conf = parseLocationHash();
            }

            // Set the selectors to the correct values and load the list.
            list.value = conf.list;
            passwordLength.value = conf.length;
            loadPasswords(conf.list);
        });
}

// Initialise the password generator.
try {
    init();
}
catch(error) {
    document.getElementById("error").style.display = "block";
    throw error;
}
