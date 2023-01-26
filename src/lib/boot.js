import $ from 'jquery';
console.log('booting ...');
$('#currentYear').text(new Date().getFullYear());
$('#footerDate').text(`${new Date()}`);
setTimeout(() => {
  $('#Award-Play').text('Award Plug and Play Bios Extention v.08');
}, 500);

setTimeout(() => {
  $('#primaryMaster').show();
}, 1200);

setTimeout(() => {
  $('#secondryMaster').show();
}, 2000);

setTimeout(() => {
  $('#primarySlave').show();
}, 3000);

setTimeout(() => {
  $('#secondarySlave').show();
}, 4400);

setTimeout(() => {
  $('.boot-data-first-page').hide();
  $('.boot-data-second-page').show();
}, 5500);

setTimeout(() => {
  $('.boot-data-second-page').hide();
  $('.boot-data-windows').show();
}, 7500);
