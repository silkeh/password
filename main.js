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

var passwords;
var passwordLength = 4;
var defaultList = 2000;
var hashSpeed = 10000;

// Load a password list
function loadPasswords(list) {
    $.getJSON("lists/" + list + ".json", function ( data ) {
        // Save list
        passwords = data;

        // Generate a password with the list
        generate();

        // Update displayed word counts
        updateText();
    });
}

// Generate a password from the loaded list
function generate() {
    var gen = [];

    // Grab `passwordLength` random elements
    for ( i = 0; i < passwordLength; i++ ) {
        var word;

        // Only pick words that have sufficient length
        while (gen[i] == undefined) {
            // Get password from list
            var value = new Uint32Array(1);
            window.crypto.getRandomValues(value);
            word = passwords[Math.floor(value[0]/(Math.pow(2,32)-1) * passwords.length)].toLowerCase();

            // Save password if long enough
            if ( Math.pow(26, word.length) > passwords.length )
                gen[i] = word;
        }
    }

    // Display as password
    $( "h1#password" ).html(gen.join(" "));
}

// Set the length of the password
function setLength(length) {
    passwordLength = length;

    // Generate a new password
    generate();

    // Update the text
    updateText();
}

// Change the values of the texts
function updateText() {
    var space = Math.pow(passwords.length, passwordLength);
    var bits  = Math.log(space)/Math.log(2);

    $('.wordcount').html(passwords.length);
    $('.entropyBits').html(Math.round(bits, 0));
    $('.entropyYears').html(Math.round(space/hashSpeed/31556925.1163, 1));
    $('.hashSpeed').html(hashSpeed);
}

// Start with the default word list
loadPasswords(defaultList);

// Create change functions when document is ready.
$( "document" ).ready( function () {
    $("#list").val(defaultList);
    $("#password-length").val(passwordLength);

    $("#list").change(function () {
        loadPasswords($("#list").val());
    });

    $("#password-length").change(function () {
        setLength($("#password-length").val());
    })
});

