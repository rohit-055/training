function myFunction() {
   var element = document.getElementById("myDIV");
   element.classList.toggle("mystyle");
}
function myfirsttab() {
   var element = document.getElementById("fristtab");
   element.classList.toggle("tabone");
}
function mysecondtab() {
   var element = document.getElementById("secondtab");
   element.classList.toggle("tabone");
}
function mythirdtab() {
   var element = document.getElementById("thirdtab");
   element.classList.toggle("tabone");
}
function rotaticon () {
  var element = document.getElementById("myicon");
  element.classList.toggle("iconrotate")
}
function link () {
  var element = document.getElementById("linkid");
  element.classList.toggle("linksvg")
}
function infonoti (){
  var element = document.getElementById("infoid");
  element.classList.toggle("infosvg")
}
function keydate (){
  var element = document.getElementById("keyid");
  element.classList.toggle("keysvg")
}

//  let generatedCaptcha = '';

//   function generateCaptcha() {
//     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid similar-looking chars
//     let captcha = '';
//     for (let i = 0; i < 6; i++) {
//       captcha += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     document.getElementById('captcha').textContent = captcha;
//     generatedCaptcha = captcha;
//   }

//   function validateCaptcha() {
//     const userInput = document.getElementById('captcha-input').value.trim();
//     const message = document.getElementById('message');
//     if (userInput.toUpperCase() === generatedCaptcha) {
//       message.textContent = "CAPTCHA Passed!";
//       message.style.color = "green";
//     } else {
//       message.textContent = "Incorrect CAPTCHA. Try again.";
//       message.style.color = "red";
//       generateCaptcha(); // refresh CAPTCHA
//     }
//     document.getElementById('captcha-input').value = '';
//   }

//   // Generate on load
//   generateCaptcha();