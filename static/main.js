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

let passwords;
let passwordLength = 4;
let hashSpeed = 5; // In 10^6 attempts/second
let language = $("html").attr("lang");
let defaultList = language + "/5000";

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

// Generate a password from the loaded list
function generate() {
    "use strict";

    // Required password length
    let minLength = Math.log(passwords.length) / Math.log(26);
    let joinChar = " ";
    let lowerCase = true;

    // Small lists have different behaviour
    if (passwords.length < 1000) {
        minLength = 0;
        joinChar = "";
        lowerCase = false;
    }

    // Array for password generation
    const random = new Uint32Array(passwordLength);
    let gen = [];

    // Fill the array with random values
    window.crypto.getRandomValues(random);

    random.forEach(function (n) {
        // Get random word from list
        let w = passwords[Math.floor(Number(n) / Math.pow(2, 32) * passwords.length)];

        // Transform to lower case if required
        if (lowerCase) {
            w = w.toLowerCase();
        }

        // Push word into array
        gen.push(w);
    });

    // Generate an array with the word lengths
    const lengths = gen.map(function (el) {
        return el.length;
    });

    // Check if every word has as much entropy as the individual letters
    if (Math.min.apply(Math, lengths) >= minLength) {
        // Display the password
        $("h1#password").html(gen.join(joinChar));
    } else {
        // Try again
        console.log(
            "Not enough entropy, " + minLength + " characters required: " + gen.join(joinChar)
        );
        generate();
    }
}

// Change the values of the texts
function updateText() {
    "use strict";

    const space = Math.pow(passwords.length, passwordLength);
    const bits = Math.log(space) / Math.log(2);
    const time = space / 2 / hashSpeed / Math.pow(10, 6);
    let text = "";

    // Make time readable
    if (time >= 0 && time < 2 * secondsDay) {
        text = Math.round(time / secondsHour) + " " + units.hour;
    } else if (time < 2 * secondsYear) {
        text = Math.round(time / secondsDay) + " " + units.day;
    } else if (time < secondsYear * Math.pow(10, 9)) {
        text = Math.round(time / secondsYear) + " " + units.year;
    } else {
        text = units.eternity;
    }

    // Show the results in the text
    $(".wordCount").html(passwords.length);
    $(".entropyBits").html(Math.round(bits));
    $(".entropyYears").html(text);
    $(".hashSpeed").html(hashSpeed);
}

// Set the length of the password
function setLength(length) {
    "use strict";

    passwordLength = Number(length);

    // Generate a new password
    generate();

    // Update the text
    updateText();
}

// Load a password list
function loadPasswords(list) {
    "use strict";

    $.getJSON(listDir + list + ".json", function (data) {
        // Save list
        passwords = data;

        // Generate a password with the list
        generate();

        // Update displayed word counts
        updateText();
    });
}

// Create an option in the dictionary list
function createOption(name, list, descr) {
    "use strict";

    // Create option from
    const option = $("<option />").val(name + "/" + list).text(descr);

    // Lists starting with _ are disabled
    if (!list) {
        option.attr("disabled", "disabled");
    }

    // Append to the list
    $("#list").append(option);
}

// Append a list to the dictionary list
function appendList(name, data) {
    "use strict";

    // Add description option
    createOption(name, false, data._description);

    // Add other options
    $.each(data, function (list, descr) {
        if (list.substring(0, 1) === "_") {
            return true;
        }
        createOption(name, list, descr);
    });
}

// Load the list of available password dictionaries
function loadList(indexFile) {
    "use strict";

    $.getJSON(indexFile, function (data) {
        // Add the lists for the language to the menu
        appendList(language, data[language].lists.local);
        appendList("generic", data[language].lists.generic);

        // Save units
        units = data[language].units;

        // Load the default word list
        loadPasswords(defaultList);
    });
}

loadList(indexFile);

// Create change functions when document is ready.
$("document").ready(function () {
    "use strict";

    const list = $("#list");
    const length = $("#password-length");
    list.val(defaultList);
    length.val(passwordLength);

    list.change(function () {
        loadPasswords($("#list").val());
    });

    length.change(function () {
        setLength($("#password-length").val());
    });
});

