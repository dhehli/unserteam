QUnit.test( "Basic Auth", function( assert ) {
  assert.ok(basicAuth("dh@netlive.ch","12345678") === "Basic ZGhAbmV0bGl2ZS5jaDoxMjM0NTY3OA==", "Auth ok");
});

QUnit.test( "Ajax Handler Get User", function( assert ) {
  const done = assert.async();
  const authSession = $.session.set('Authorization', 'Basic ZGhAbmV0bGl2ZS5jaDoxMjM0NTY3OA==');

  const ajax = ajaxHandler("get", "/api/v1/users", {}, 'session');
  ajax.then(msg =>{
    const message = JSON.parse(msg);
    assert.ok(Array.isArray(message), "Returned Data is Array");
    done();
  })
  $.session.remove('Authorization');
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
