QUnit.test( "Basic Auth", function( assert ) {
  assert.ok(basicAuth("dh@netlive.ch","12345678") === "Basic ZGhAbmV0bGl2ZS5jaDoxMjM0NTY3OA==", "Auth ok");
});

QUnit.test( "Alert Handler Success", function( assert ) {
  const $alert = $("<div class='alert'>");
  const $alertElement = alertHandler($alert, "success", "success text");

  assert.ok($alertElement.hasClass("alert-success"), "Has correct Class");
  assert.ok($alertElement.html() === "success text", "Has correct Text");
});

QUnit.test( "Alert Handler Danger", function( assert ) {
  const $alert = $("<div class='alert'>");
  const $alertElement = alertHandler($alert, "danger", "warning text");

  assert.ok($alertElement.hasClass("alert-danger"), "Has correct Class");
  assert.ok($alertElement.html() === "warning text", "Has correct Text");
});
