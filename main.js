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
var language = $('html').attr('lang');

// Load a password list
function loadPasswords(list) {
    $.getJSON("lists/" + language + '/' + list + ".json", function ( data ) {
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
    // Required password length
    var minLength = Math.log(passwords.length)/Math.log(26);

    // Array for password generation
    var random = new Uint32Array(passwordLength);
    var gen = [];

    // Fill the array with random values
    window.crypto.getRandomValues(random);

    random.forEach(function (n) {
        var w = passwords[Math.floor(Number(n)/Math.pow(2,32) * passwords.length )];
        gen.push(w.toLowerCase());
    });

    // Generate an array with the word lengths
    var lengths = gen.map(function (el) { return el.length });

    // Check if every word has as much entropy as the individual letters
    if ( Math.min.apply(Math, lengths) >= minLength ) {
        // Display the password
        $( "h1#password" ).html(gen.join(" "));
    } else {
        // Try again
        console.log(
            'Not enough entropy, '
            + Math.ceil(minLength) + ' characters required: '
            + gen.join(" ")
        );
        generate();
    }
}

// Set the length of the password
function setLength(length) {
    passwordLength = Number(length);

    // Generate a new password
    generate();

    // Update the text
    updateText();
}

// Change the values of the texts
function updateText() {
    var space = Math.pow(passwords.length, passwordLength);
    var bits  = Math.log(space)/Math.log(2);

    $('.wordCount').html(passwords.length);
    $('.entropyBits').html(Math.round(bits));
    $('.entropyYears').html(Math.round(space/hashSpeed/31556925.1163));
    $('.hashSpeed').html(hashSpeed);
}

// Load the list of available password dictionaries
function loadList() {
    $.getJSON("lists/index.json", function ( data ) {
        // Save list
        $.each(data['nl'], function(list, descr) {
            $("#list").append($("<option />").val(list).text(descr));
        });

        // Load the default word list
        loadPasswords(defaultList);
    });
}

loadList();

// Create change functions when document is ready.
$( "document" ).ready( function () {
    var list = $("#list");
    var leng = $("#password-length");
    list.val(defaultList);
    leng.val(passwordLength);

    list.change(function () {
        loadPasswords($("#list").val());
    });

    leng.change(function () {
        setLength($("#password-length").val());
    })
});

